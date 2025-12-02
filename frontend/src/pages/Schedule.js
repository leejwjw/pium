import React, { useState, useEffect } from 'react';
import { scheduleAPI } from '../services/api';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatLocalDate, getCurrentLocalDate } from '../utils/dateUtils';
import './Common.css';
import './Attendance.css';

function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formData, setFormData] = useState({
        scheduleDate: getCurrentLocalDate(),
        title: '',
        description: ''
    });

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await scheduleAPI.getAll();
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (schedule = null) => {
        if (schedule) {
            setCurrentSchedule(schedule);
            setFormData({
                scheduleDate: schedule.scheduleDate,
                title: schedule.title,
                description: schedule.description || ''
            });
        } else {
            setCurrentSchedule(null);
            setFormData({
                scheduleDate: formatLocalDate(selectedDate),
                title: '',
                description: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentSchedule(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentSchedule) {
                await scheduleAPI.update(currentSchedule.id, formData);
            } else {
                await scheduleAPI.create(formData);
            }
            fetchSchedules();
            closeModal();
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('스케줄 저장 중 오류가 발생했습니다.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await scheduleAPI.delete(id);
            fetchSchedules();
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const getSchedulesForDate = (date) => {
        const dateStr = formatLocalDate(date);
        return schedules.filter(s => s.scheduleDate === dateStr);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const daySchedules = getSchedulesForDate(date);
            if (daySchedules.length > 0) {
                return (
                    <div className="schedule-marker">
                        {daySchedules.length}
                    </div>
                );
            }
        }
        return null;
    };

    if (loading) return <div className="loading">로딩중...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>스케줄 관리</h1>
                <p>학원 일정 관리</p>
            </div>

            <div className="card">
                <div className="filter-section">
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        <FiPlus /> 일정 추가
                    </button>
                </div>

                <div className="responsive-two-column">
                    <div className="calendar-view">
                        <Calendar
                            onChange={(date) => setSelectedDate(date)}
                            value={selectedDate}
                            tileContent={tileContent}
                            locale="ko-KR"
                        />
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '16px' }}>
                            {selectedDate.toLocaleDateString('ko-KR')} 일정
                        </h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>제목</th>
                                        <th>내용</th>
                                        <th>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getSchedulesForDate(selectedDate).length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="empty-state">일정이 없습니다</td>
                                        </tr>
                                    ) : (
                                        getSchedulesForDate(selectedDate).map(schedule => (
                                            <tr key={schedule.id}>
                                                <td><strong>{schedule.title}</strong></td>
                                                <td>{schedule.description || '-'}</td>
                                                <td>
                                                    <div className="actions">
                                                        <button className="action-btn edit-btn" onClick={() => openModal(schedule)}>
                                                            <FiEdit />
                                                        </button>
                                                        <button className="action-btn delete-btn" onClick={() => handleDelete(schedule.id)}>
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ marginBottom: '16px' }}>전체 일정</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>날짜</th>
                                    <th>제목</th>
                                    <th>내용</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="empty-state">일정이 없습니다</td>
                                    </tr>
                                ) : (
                                    schedules.map(schedule => (
                                        <tr key={schedule.id}>
                                            <td>{new Date(schedule.scheduleDate).toLocaleDateString('ko-KR')}</td>
                                            <td><strong>{schedule.title}</strong></td>
                                            <td>{schedule.description || '-'}</td>
                                            <td>
                                                <div className="actions">
                                                    <button className="action-btn edit-btn" onClick={() => openModal(schedule)}>
                                                        <FiEdit /> 수정
                                                    </button>
                                                    <button className="action-btn delete-btn" onClick={() => handleDelete(schedule.id)}>
                                                        <FiTrash2 /> 삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 일정 추가/수정 모달 */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{currentSchedule ? '일정 수정' : '일정 추가'}</h2>
                            <button className="close-btn" onClick={closeModal}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>날짜 *</label>
                                    <input
                                        type="date"
                                        name="scheduleDate"
                                        className="form-control"
                                        value={formData.scheduleDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>제목 *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="예: 크리스마스 휴원"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>내용</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="4"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="일정 상세 내용을 입력하세요"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>취소</button>
                                <button type="submit" className="btn btn-primary">{currentSchedule ? '수정' : '추가'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Schedule;
