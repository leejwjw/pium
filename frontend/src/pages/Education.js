import React, { useState, useEffect } from 'react';
import { educationAPI, subjectAPI, uploadAPI } from '../services/api';
import { FiPlus, FiEdit, FiTrash2, FiX, FiUpload, FiSettings, FiImage } from 'react-icons/fi';
import { getCurrentLocalMonth } from '../utils/dateUtils';
import './Common.css';

function Education() {
    const [records, setRecords] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(getCurrentLocalMonth());
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [newSubject, setNewSubject] = useState({ name: '', description: '' });
    const [formData, setFormData] = useState({
        yearMonth: getCurrentLocalMonth(),
        weekNumber: 1,
        subject: '',
        content: '',
        imagePath: ''
    });

    useEffect(() => {
        fetchSubjects();
        fetchRecords();
    }, [selectedMonth]);

    const fetchSubjects = async () => {
        try {
            const response = await subjectAPI.getAll();
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const fetchRecords = async () => {
        try {
            const response = await educationAPI.getByYearMonth(selectedMonth);
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching education records:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 이미지 파일 검증
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        setUploading(true);
        try {
            const response = await uploadAPI.uploadImage(file);
            setUploadedFile(response.data);
            setFormData(prev => ({ ...prev, imagePath: response.data.path }));
            alert('이미지가 업로드되었습니다.');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    const handleAddSubject = async () => {
        if (!newSubject.name.trim()) {
            alert('과목명을 입력하세요.');
            return;
        }
        try {
            await subjectAPI.create(newSubject);
            fetchSubjects();
            setShowSubjectModal(false);
            setNewSubject({ name: '', description: '' });
            alert('과목이 추가되었습니다.');
        } catch (error) {
            console.error('Error adding subject:', error);
            alert('과목 추가 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm('이 과목을 삭제하시겠습니까?')) return;
        try {
            await subjectAPI.delete(id);
            fetchSubjects();
        } catch (error) {
            console.error('Error deleting subject:', error);
            alert('과목 삭제 중 오류가 발생했습니다.');
        }
    };

    const openModal = (record = null) => {
        if (record) {
            setCurrentRecord(record);
            setFormData({
                yearMonth: record.yearMonth,
                weekNumber: record.weekNumber,
                subject: record.subject,
                content: record.content || '',
                imagePath: record.imagePath || ''
            });
            setUploadedFile(record.imagePath ? { path: record.imagePath } : null);
        } else {
            setCurrentRecord(null);
            setFormData({
                yearMonth: selectedMonth,
                weekNumber: 1,
                subject: subjects.length > 0 ? subjects[0].name : '',
                content: '',
                imagePath: ''
            });
            setUploadedFile(null);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentRecord(null);
        setUploadedFile(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentRecord) {
                await educationAPI.update(currentRecord.id, formData);
            } else {
                await educationAPI.create(formData);
            }
            fetchRecords();
            closeModal();
        } catch (error) {
            console.error('Error saving education record:', error);
            alert('교육 기록 저장 중 오류가 발생했습니다.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await educationAPI.delete(id);
            fetchRecords();
        } catch (error) {
            console.error('Error deleting education record:', error);
        }
    };

    const groupedRecords = records.reduce((acc, record) => {
        const week = record.weekNumber;
        if (!acc[week]) acc[week] = [];
        acc[week].push(record);
        return acc;
    }, {});

    if (loading) return <div className="loading">로딩중...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>교육 기록</h1>
                <p>주차별 교육 내용 관리</p>
            </div>

            <div className="card">
                <div className="filter-section">
                    <div className="filter-group">
                        <label>월 선택:</label>
                        <input
                            type="month"
                            className="form-control"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                    </div>
                    <div className="actions-group">
                        <button className="btn btn-secondary" onClick={() => setShowSubjectModal(true)}>
                            <FiSettings /> 과목 관리
                        </button>
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            <FiPlus /> 교육 기록 추가
                        </button>
                    </div>
                </div>

                <div className="summary-cards">
                    <div className="summary-card small">
                        <h4>총 기록</h4>
                        <p className="count">{records.length}건</p>
                    </div>
                    <div className="summary-card small">
                        <h4>주차</h4>
                        <p className="count">{Object.keys(groupedRecords).length}주</p>
                    </div>
                    <div className="summary-card small">
                        <h4>등록 과목</h4>
                        <p className="count">{subjects.length}개</p>
                    </div>
                </div>

                {Object.keys(groupedRecords).sort((a, b) => a - b).map(week => (
                    <div key={week} style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                            {week}주차
                        </h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>과목</th>
                                        <th>내용</th>
                                        <th>첨부 이미지</th>
                                        <th>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedRecords[week].map(record => (
                                        <tr key={record.id}>
                                            <td><span className="badge category-badge">{record.subject}</span></td>
                                            <td style={{ whiteSpace: 'pre-line', maxWidth: '400px' }}>{record.content || '-'}</td>
                                            <td>
                                                {record.imagePath ? (
                                                    <a href={`${process.env.REACT_APP_API_URL}${record.imagePath}`} target="_blank" rel="noopener noreferrer">
                                                        <FiImage /> 이미지 보기
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td>
                                                <div className="actions">
                                                    <button className="action-btn edit-btn" onClick={() => openModal(record)}>
                                                        <FiEdit /> 수정
                                                    </button>
                                                    <button className="action-btn delete-btn" onClick={() => handleDelete(record.id)}>
                                                        <FiTrash2 /> 삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {records.length === 0 && (
                    <div className="empty-state" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                        교육 기록이 없습니다. "교육 기록 추가" 버튼을 눌러 기록을 추가하세요.
                    </div>
                )}
            </div>

            {/* 교육 기록 추가/수정 모달 */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h2>{currentRecord ? '교육 기록 수정' : '교육 기록 추가'}</h2>
                            <button className="close-btn" onClick={closeModal}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>년월 *</label>
                                        <input
                                            type="month"
                                            name="yearMonth"
                                            className="form-control"
                                            value={formData.yearMonth}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>주차 *</label>
                                        <select
                                            name="weekNumber"
                                            className="form-control"
                                            value={formData.weekNumber}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {[1, 2, 3, 4, 5].map(w => (
                                                <option key={w} value={w}>{w}주차</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>과목 *</label>
                                    <select
                                        name="subject"
                                        className="form-control"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">과목 선택</option>
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.name}>{subject.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>교육 내용 *</label>
                                    <textarea
                                        name="content"
                                        className="form-control"
                                        rows="6"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="교육 내용을 입력하세요&#10;예:&#10;- 덧셈과 뺄셈의 기초&#10;- 받아올림이 있는 덧셈&#10;- 받아내림이 있는 뺄셈"
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>이미지 업로드</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            style={{ display: 'none' }}
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="btn btn-secondary" style={{ margin: 0, cursor: 'pointer' }}>
                                            <FiUpload /> {uploading ? '업로드 중...' : '이미지 선택'}
                                        </label>
                                        {uploadedFile && (
                                            <span style={{ color: '#4a90e2' }}>
                                                <FiImage /> {uploadedFile.originalFilename || '이미지 업로드됨'}
                                            </span>
                                        )}
                                    </div>
                                    {uploadedFile && (
                                        <img
                                            src={`${process.env.REACT_APP_API_URL}${uploadedFile.path}`}
                                            alt="Preview"
                                            style={{ marginTop: '10px', maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>취소</button>
                                <button type="submit" className="btn btn-primary">{currentRecord ? '수정' : '추가'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 과목 관리 모달 */}
            {showSubjectModal && (
                <div className="modal-overlay" onClick={() => setShowSubjectModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>과목 관리</h2>
                            <button className="close-btn" onClick={() => setShowSubjectModal(false)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>새 과목 추가</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="과목명"
                                        value={newSubject.name}
                                        onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                    <button className="btn btn-primary" onClick={handleAddSubject}>
                                        추가
                                    </button>
                                </div>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>과목명</th>
                                            <th>관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subjects.map(subject => (
                                            <tr key={subject.id}>
                                                <td>{subject.name}</td>
                                                <td>
                                                    <button className="action-btn delete-btn" onClick={() => handleDeleteSubject(subject.id)}>
                                                        <FiTrash2 /> 삭제
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowSubjectModal(false)}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Education;
