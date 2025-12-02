import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { exportToExcel, formatDate } from '../utils/helpers';
import { FiPlus, FiSearch, FiDownload, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import './Students.css';

function Students() {
    const [students, setStudents] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL'); // 상태 필터
    const [sessionsFilter, setSessionsFilter] = useState('ALL'); // 주당 수업 필터
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [activeStudentCount, setActiveStudentCount] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        school: '',
        specialNotes: '',
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        parentContact: '',
        studentContact: '',
        status: 'ACTIVE',
        sessionsPerWeek: 2
    });

    useEffect(() => {
        fetchStudents();
        fetchActiveStudentCount();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await studentAPI.getAll();
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchActiveStudentCount = async () => {
        try {
            const response = await studentAPI.getActiveCount();
            setActiveStudentCount(response.data);
        } catch (error) {
            console.error('Error fetching active student count:', error);
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            fetchStudents();
            return;
        }
        try {
            const response = await studentAPI.search(searchKeyword);
            setStudents(response.data);
        } catch (error) {
            console.error('Error searching students:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await studentAPI.delete(id);
            fetchStudents();
            fetchActiveStudentCount();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const handleExport = () => {
        const exportData = students.map(s => ({
            이름: s.name,
            생년월일: s.birthDate,
            학교: s.school,
            상태: s.status === 'ACTIVE' ? '정상' : s.status === 'SUSPENDED' ? '중지' : '퇴원',
            주당수업: `주${s.sessionsPerWeek}회`,
            학부모연락처: s.parentContact,
            학생연락처: s.studentContact,
        }));

        // 통계 행 추가
        exportData.push({
            이름: '',
            생년월일: '',
            학교: `총 ${students.length}명`,
            상태: `정상 ${activeStudentCount}명`,
            주당수업: '',
            학부모연락처: '',
            학생연락처: ''
        });

        exportToExcel(exportData, '학생목록.xlsx');
    };

    const openModal = (student = null) => {
        if (student) {
            setCurrentStudent(student);
            setFormData({
                name: student.name || '',
                birthDate: student.birthDate || '',
                school: student.school || '',
                specialNotes: student.specialNotes || '',
                mon: student.mon || false,
                tue: student.tue || false,
                wed: student.wed || false,
                thu: student.thu || false,
                fri: student.fri || false,
                parentContact: student.parentContact || '',
                studentContact: student.studentContact || '',
                status: student.status || 'ACTIVE',
                sessionsPerWeek: student.sessionsPerWeek || 2
            });
        } else {
            setCurrentStudent(null);
            setFormData({
                name: '',
                birthDate: '',
                school: '',
                specialNotes: '',
                mon: false,
                tue: false,
                wed: false,
                thu: false,
                fri: false,
                parentContact: '',
                studentContact: '',
                status: 'ACTIVE',
                sessionsPerWeek: 2
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentStudent(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentStudent) {
                await studentAPI.update(currentStudent.id, formData);
            } else {
                await studentAPI.create(formData);
            }
            fetchStudents();
            fetchActiveStudentCount();
            closeModal();
        } catch (error) {
            console.error('Error saving student:', error);
            alert('학생 정보 저장 중 오류가 발생했습니다.');
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'ACTIVE': return '정상';
            case 'SUSPENDED': return '중지';
            case 'WITHDRAWN': return '퇴원';
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'ACTIVE': return 'status-active';
            case 'SUSPENDED': return 'status-suspended';
            case 'WITHDRAWN': return 'status-withdrawn';
            default: return '';
        }
    };

    // 필터링된 학생 목록
    const filteredStudents = students.filter(student => {
        console.log('🔍 Filtering student:', student.name, 'Status:', student.status, 'Sessions:', student.sessionsPerWeek);
        console.log('📊 Filters - Status:', statusFilter, 'Sessions:', sessionsFilter);

        const matchStatus = statusFilter === 'ALL' || student.status === statusFilter;
        const matchSessions = sessionsFilter === 'ALL' || student.sessionsPerWeek === parseInt(sessionsFilter);

        console.log('✅ Match results - Status:', matchStatus, 'Sessions:', matchSessions);

        return matchStatus && matchSessions;
    });

    console.log('📋 Total students:', students.length, 'Filtered:', filteredStudents.length);

    if (loading) return <div className="loading">로딩중...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>학생 관리</h1>
                <p>학생 정보 조회 및 관리 (정상 학생: <strong>{activeStudentCount}명</strong> / 전체: {students.length}명)</p>
            </div>

            <div className="card">
                {/* 필터 섹션 추가 */}
                <div className="filter-section" style={{ marginTop: '16px' }}>
                    <div className="filter-group">
                        <label>상태:</label>
                        <select
                            className="form-control"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">전체</option>
                            <option value="ACTIVE">정상</option>
                            <option value="SUSPENDED">중지</option>
                            <option value="WITHDRAWN">퇴원</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>주당 수업:</label>
                        <select
                            className="form-control"
                            value={sessionsFilter}
                            onChange={(e) => setSessionsFilter(e.target.value)}
                        >
                            <option value="ALL">전체</option>
                            <option value="1">주 1회</option>
                            <option value="2">주 2회</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <span style={{ color: '#666', fontSize: '14px' }}>
                            검색 결과: <strong>{filteredStudents.length}</strong>명
                        </span>
                    </div>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="학생 이름으로 검색..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="btn btn-secondary" onClick={handleSearch}>
                        <FiSearch /> 검색
                    </button>
                    <button className="btn btn-success" onClick={handleExport}>
                        <FiDownload /> Excel 내보내기
                    </button>
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        <FiPlus /> 학생 추가
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>생년월일</th>
                                <th>학교</th>
                                <th>상태</th>
                                <th>주당 수업</th>
                                <th>등원 요일</th>
                                <th>학부모 연락처</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="empty-state">학생 정보가 없습니다</td>
                                </tr>
                            ) : (
                                filteredStudents.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>{formatDate(student.birthDate)}</td>
                                        <td>{student.school || '-'}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(student.status)}`}>
                                                {getStatusLabel(student.status)}
                                            </span>
                                        </td>
                                        <td>주{student.sessionsPerWeek}회</td>
                                        <td>
                                            {[
                                                student.mon && '월',
                                                student.tue && '화',
                                                student.wed && '수',
                                                student.thu && '목',
                                                student.fri && '금',
                                            ].filter(Boolean).join(', ') || '-'}
                                        </td>
                                        <td>{student.parentContact || '-'}</td>
                                        <td>
                                            <div className="actions">
                                                <button className="action-btn edit-btn" onClick={() => openModal(student)}>
                                                    <FiEdit /> 수정
                                                </button>
                                                <button className="action-btn delete-btn" onClick={() => handleDelete(student.id)}>
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

            {/* 학생 추가/수정 모달 */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{currentStudent ? '학생 정보 수정' : '학생 추가'}</h2>
                            <button className="close-btn" onClick={closeModal}>
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>이름 *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>생년월일 *</label>
                                        <input
                                            type="date"
                                            name="birthDate"
                                            className="form-control"
                                            value={formData.birthDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>학교</label>
                                    <input
                                        type="text"
                                        name="school"
                                        className="form-control"
                                        value={formData.school}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>상태 *</label>
                                        <select
                                            name="status"
                                            className="form-control"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="ACTIVE">정상</option>
                                            <option value="SUSPENDED">중지</option>
                                            <option value="WITHDRAWN">퇴원</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>주당 수업 횟수 *</label>
                                        <select
                                            name="sessionsPerWeek"
                                            className="form-control"
                                            value={formData.sessionsPerWeek}
                                            onChange={handleInputChange}
                                        >
                                            <option value={1}>주 1회</option>
                                            <option value={2}>주 2회</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>등원 요일</label>
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="mon"
                                                checked={formData.mon}
                                                onChange={handleInputChange}
                                            />
                                            월요일
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="tue"
                                                checked={formData.tue}
                                                onChange={handleInputChange}
                                            />
                                            화요일
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="wed"
                                                checked={formData.wed}
                                                onChange={handleInputChange}
                                            />
                                            수요일
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="thu"
                                                checked={formData.thu}
                                                onChange={handleInputChange}
                                            />
                                            목요일
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="fri"
                                                checked={formData.fri}
                                                onChange={handleInputChange}
                                            />
                                            금요일
                                        </label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>학부모 연락처</label>
                                        <input
                                            type="tel"
                                            name="parentContact"
                                            className="form-control"
                                            value={formData.parentContact}
                                            onChange={handleInputChange}
                                            placeholder="010-1234-5678"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>학생 연락처</label>
                                        <input
                                            type="tel"
                                            name="studentContact"
                                            className="form-control"
                                            value={formData.studentContact}
                                            onChange={handleInputChange}
                                            placeholder="010-1234-5678"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>특이사항</label>
                                    <textarea
                                        name="specialNotes"
                                        className="form-control"
                                        rows="3"
                                        value={formData.specialNotes}
                                        onChange={handleInputChange}
                                        placeholder="알레르기, 특별한 주의사항 등"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    취소
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {currentStudent ? '수정' : '추가'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Students;
