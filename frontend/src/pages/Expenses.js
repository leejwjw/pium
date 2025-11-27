import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import { exportToExcel, formatDate } from '../utils/helpers';
import { FiPlus, FiEdit, FiTrash2, FiX, FiDownload } from 'react-icons/fi';
import './Common.css';

const CATEGORIES = ['인건비', '재료비', '임대료', '공과금', '기타'];
const EXPENSE_TYPES = ['고정비', '변동비'];

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [formData, setFormData] = useState({
        expenseType: '고정비',
        category: '인건비',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        description: ''
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await expenseAPI.getAll();
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (expense = null) => {
        if (expense) {
            setCurrentExpense(expense);
            setFormData({
                expenseType: expense.expenseType || '고정비',
                category: expense.category || '인건비',
                amount: expense.amount || '',
                expenseDate: expense.expenseDate || new Date().toISOString().split('T')[0],
                description: expense.description || ''
            });
        } else {
            setCurrentExpense(null);
            setFormData({
                expenseType: '고정비',
                category: '인건비',
                amount: '',
                expenseDate: new Date().toISOString().split('T')[0],
                description: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentExpense(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentExpense) {
                await expenseAPI.update(currentExpense.id, formData);
            } else {
                await expenseAPI.create(formData);
            }
            fetchExpenses();
            closeModal();
        } catch (error) {
            console.error('Error saving expense:', error);
            alert('지출 정보 저장 중 오류가 발생했습니다.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await expenseAPI.delete(id);
            fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleExport = () => {
        const exportData = filteredExpenses.map(e => ({
            날짜: formatDate(e.expenseDate),
            품목: e.category,
            유형: e.expenseType,
            금액: e.amount.toLocaleString() + '원',
            내용: e.description
        }));

        // 합계 행 추가
        exportData.push({
            날짜: '',
            품목: '',
            유형: '총 합계',
            금액: totalAmount.toLocaleString() + '원',
            내용: `${filteredExpenses.length}건`
        });

        exportToExcel(exportData, `지출내역_${selectedMonth}.xlsx`);
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchCategory = selectedCategory === 'ALL' || expense.category === selectedCategory;
        const matchMonth = selectedMonth ? expense.expenseDate.startsWith(selectedMonth) : true;
        return matchCategory && matchMonth;
    });

    const totalAmount = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const categoryStats = CATEGORIES.map(cat => ({
        category: cat,
        amount: filteredExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + (e.amount || 0), 0)
    }));

    if (loading) return <div className="loading">로딩중...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>지출 관리</h1>
                <p>학원 운영 지출 내역</p>
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
                    <div className="filter-group">
                        <label>품목:</label>
                        <select
                            className="form-control"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="ALL">전체</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="actions-group">
                        <button className="btn btn-success" onClick={handleExport}>
                            <FiDownload /> Excel 내보내기
                        </button>
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            <FiPlus /> 지출 등록
                        </button>
                    </div>
                </div>

                <div className="summary-cards">
                    <div className="summary-card">
                        <h3>총 지출</h3>
                        <p className="amount">{totalAmount.toLocaleString()}원</p>
                    </div>
                    {categoryStats.map(stat => (
                        stat.amount > 0 && (
                            <div key={stat.category} className="summary-card small">
                                <h4>{stat.category}</h4>
                                <p className="amount">{stat.amount.toLocaleString()}원</p>
                            </div>
                        )
                    ))}
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>품목</th>
                                <th>유형</th>
                                <th>금액</th>
                                <th>내용</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-state">지출 내역이 없습니다</td>
                                </tr>
                            ) : (
                                filteredExpenses.map(expense => (
                                    <tr key={expense.id}>
                                        <td>{formatDate(expense.expenseDate)}</td>
                                        <td><span className="badge category-badge">{expense.category}</span></td>
                                        <td>{expense.expenseType}</td>
                                        <td className="amount-cell">{expense.amount?.toLocaleString()}원</td>
                                        <td>{expense.description || '-'}</td>
                                        <td>
                                            <div className="actions">
                                                <button className="action-btn edit-btn" onClick={() => openModal(expense)}>
                                                    <FiEdit /> 수정
                                                </button>
                                                <button className="action-btn delete-btn" onClick={() => handleDelete(expense.id)}>
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

            {/* 지출 등록/수정 모달 */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{currentExpense ? '지출 수정' : '지출 등록'}</h2>
                            <button className="close-btn" onClick={closeModal}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>품목 *</label>
                                        <select name="category" className="form-control" value={formData.category} onChange={handleInputChange} required>
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>유형 *</label>
                                        <select name="expenseType" className="form-control" value={formData.expenseType} onChange={handleInputChange} required>
                                            {EXPENSE_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>날짜 *</label>
                                        <input type="date" name="expenseDate" className="form-control" value={formData.expenseDate} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>금액 *</label>
                                        <input type="number" name="amount" className="form-control" value={formData.amount} onChange={handleInputChange} required placeholder="0" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>내용</label>
                                    <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleInputChange} placeholder="지출 내용 설명"></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>취소</button>
                                <button type="submit" className="btn btn-primary">{currentExpense ? '수정' : '등록'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Expenses;
