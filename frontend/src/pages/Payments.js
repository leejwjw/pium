import React, { useState, useEffect } from 'react';
import { paymentAPI, studentAPI } from '../services/api';
import { FiPlus, FiX, FiDollarSign } from 'react-icons/fi';
import './Common.css';

function Payments() {
    const [students, setStudents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [activeTab, setActiveTab] = useState('ALL'); // ALL, PAID, UNPAID
    const [formData, setFormData] = useState({
        studentId: '',
        paymentDate: new Date().toISOString().split('T')[0],
        amount: 90000,
        yearMonth: new Date().toISOString().slice(0, 7),
        status: 'PAID'
    });

    useEffect(() => {
        fetchStudents();
        fetchPayments();
    }, [selectedMonth]);

    const fetchStudents = async () => {
        try {
            const response = await studentAPI.getActive();
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchPayments = async () => {
        try {
            const response = await paymentAPI.getByYearMonth(selectedMonth);
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStudentPaymentStatus = (studentId) => {
        return payments.find(p => p.studentId === studentId && p.yearMonth === selectedMonth && p.status === 'PAID');
    };

    const openModal = (student = null) => {
        if (student) {
            setFormData({
                studentId: student.id,
                paymentDate: new Date().toISOString().split('T')[0],
                amount: student.sessionsPerWeek === 2 ? 90000 : 250000,
                yearMonth: selectedMonth,
                status: 'PAID'
            });
        } else {
            setFormData({
                studentId: '',
                paymentDate: new Date().toISOString().split('T')[0],
                amount: 90000,
                yearMonth: selectedMonth,
                status: 'PAID'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await paymentAPI.create(formData);
            fetchPayments();
            closeModal();
        } catch (error) {
            console.error('Error creating payment:', error);
            alert('결제 등록 중 오류가 발생했습니다.');
        }
    };

    const studentsWithPaymentStatus = students.map(student => ({
        ...student,
        payment: getStudentPaymentStatus(student.id)
    }));

    const filteredStudents = studentsWithPaymentStatus.filter(student => {
        if (activeTab === 'PAID') return student.payment;
        if (activeTab === 'UNPAID') return !student.payment;
        return true;
    });

    const paidCount = studentsWithPaymentStatus.filter(s => s.payment).length;
    const unpaidCount = studentsWithPaymentStatus.filter(s => !s.payment).length;
    const totalRevenue = payments.filter(p => p.yearMonth === selectedMonth).reduce((sum, p) => sum + (p.amount || 0), 0);

    if (loading) return <div className="loading">로딩중...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>결제 관리</h1>
                <p>학생 결제 내역 관리</p>
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
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        <FiPlus /> 결제 등록
                    </button>
                </div>

                <div className="summary-cards">
                    <div className="summary-card">
                        <h3>총 수입</h3>
                        <p className="amount">{totalRevenue.toLocaleString()}원</p>
                    </div>
                    <div className="summary-card small">
                        <h4>결제 완료</h4>
                        <p className="count">{paidCount}명</p>
                    </div>
                    <div className="summary-card small">
                        <h4>미결제</h4>
                        <p className="count danger">{unpaidCount}명</p>
                    </div>
                </div>

                <div className="tabs">
                    <button className={`tab ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>
                        전체 ({students.length})
                    </button>
                    <button className={`tab ${activeTab === 'PAID' ? 'active' : ''}`} onClick={() => setActiveTab('PAID')}>
                        결제 완료 ({paidCount})
                    </button>
                    <button className={`tab ${activeTab === 'UNPAID' ? 'active' : ''}`} onClick={() => setActiveTab('UNPAID')}>
                        미결제 ({unpaidCount})
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>학교</th>
                                <th>주당 수업</th>
                                <th>결제 상태</th>
                                <th>결제일</th>
                                <th>금액</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-state">학생이 없습니다</td>
                                </tr>
                            ) : (
                                filteredStudents.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>{student.school || '-'}</td>
                                        <td>주{student.sessionsPerWeek}회</td>
                                        <td>
                                            {student.payment ? (
                                                <span className="badge status-active">결제 완료</span>
                                            ) : (
                                                <span className="badge status-withdrawn">미결제</span>
                                            )}
                                        </td>
                                        <td>{student.payment ? new Date(student.payment.paymentDate).toLocaleDateString() : '-'}</td>
                                        <td className="amount-cell">{student.payment ? student.payment.amount.toLocaleString() + '원' : '-'}</td>
                                        <td>
                                            {!student.payment && (
                                                <button className="action-btn primary-btn" onClick={() => openModal(student)}>
                                                    <FiDollarSign /> 결제 등록
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 결제 등록 모달 */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>결제 등록</h2>
                            <button className="close-btn" onClick={closeModal}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>학생 선택 *</label>
                                    <select name="studentId" className="form-control" value={formData.studentId} onChange={handleInputChange} required>
                                        <option value="">학생을 선택하세요</option>
                                        {students.map(student => (
                                            <option key={student.id} value={student.id}>
                                                {student.name} ({student.school})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>결제일 *</label>
                                        <input type="date" name="paymentDate" className="form-control" value={formData.paymentDate} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>금액 *</label>
                                        <input type="number" name="amount" className="form-control" value={formData.amount} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>해당 월 *</label>
                                    <input type="month" name="yearMonth" className="form-control" value={formData.yearMonth} onChange={handleInputChange} required />
                                    <small className="form-hint">다음달 선결제의 경우 다음달을 선택하세요</small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>취소</button>
                                <button type="submit" className="btn btn-primary">등록</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Payments;
