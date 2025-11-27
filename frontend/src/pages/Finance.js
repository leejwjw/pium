import React, { useState, useEffect } from 'react';
import { paymentAPI, expenseAPI, studentAPI } from '../services/api';
import { exportToExcel } from '../utils/helpers';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiDownload } from 'react-icons/fi';
import './Common.css';

function Finance() {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [payments, setPayments] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    const fetchData = async () => {
        try {
            const [paymentsRes, expensesRes, studentsRes] = await Promise.all([
                paymentAPI.getByYearMonth(selectedMonth),
                expenseAPI.getAll(),
                studentAPI.getAll()
            ]);
            setPayments(paymentsRes.data);
            setExpenses(expensesRes.data.filter(e => e.expenseDate.startsWith(selectedMonth)));
            setStudents(studentsRes.data);
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? student.name : `ID: ${studentId}`;
    };

    const handleExportPayments = () => {
        // 결제 내역 섹션
        const paymentData = payments.map(p => ({
            구분: '수입',
            날짜: new Date(p.paymentDate).toLocaleDateString('ko-KR'),
            항목: getStudentName(p.studentId),
            내용: `결제월: ${p.yearMonth}`,
            금액: p.amount
        }));

        // 지출 내역 섹션
        const expenseData = expenses.map(e => ({
            구분: '지출',
            날짜: new Date(e.expenseDate).toLocaleDateString('ko-KR'),
            항목: e.category,
            내용: e.description || '-',
            금액: -e.amount // 지출은 음수로 표시
        }));

        // 모든 데이터 합치기
        const allData = [...paymentData, ...expenseData];

        // 날짜순 정렬
        allData.sort((a, b) => new Date(a.날짜) - new Date(b.날짜));

        // 금액 포맷팅
        const exportData = allData.map(item => ({
            구분: item.구분,
            날짜: item.날짜,
            항목: item.항목,
            내용: item.내용,
            금액: item.금액.toLocaleString() + '원'
        }));

        // 구분선
        exportData.push({
            구분: '─────────',
            날짜: '─────────',
            항목: '─────────',
            내용: '─────────',
            금액: '─────────'
        });

        // 합계 행 추가
        exportData.push({
            구분: '',
            날짜: '',
            항목: '총 수입',
            내용: `${payments.length}건`,
            금액: totalIncome.toLocaleString() + '원'
        });
        exportData.push({
            구분: '',
            날짜: '',
            항목: '총 지출',
            내용: `${expenses.length}건`,
            금액: totalExpense.toLocaleString() + '원'
        });
        exportData.push({
            구분: '',
            날짜: '',
            항목: '순이익',
            내용: netProfit >= 0 ? '흑자' : '적자',
            금액: netProfit.toLocaleString() + '원'
        });

        exportToExcel(exportData, `재무현황_${selectedMonth}.xlsx`);
    };

    const totalIncome = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = totalIncome - totalExpense;

    const expensesByCategory = expenses.reduce((acc, expense) => {
        const cat = expense.category || '기타';
        if (!acc[cat]) acc[cat] = 0;
        acc[cat] += expense.amount || 0;
        return acc;
    }, {});

    if (loading) return <div className="loading">로딩중...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>재무 현황</h1>
                <p>월별 수입/지출 요약</p>
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
                    <button className="btn btn-success" onClick={handleExportPayments}>
                        <FiDownload /> 재무현황 엑셀 내보내기
                    </button>
                </div>

                <div className="summary-cards">
                    <div className="summary-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <h3><FiTrendingUp /> 총 수입</h3>
                        <p className="amount">{totalIncome.toLocaleString()}원</p>
                        <small>{payments.length}건</small>
                    </div>
                    <div className="summary-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <h3><FiTrendingDown /> 총 지출</h3>
                        <p className="amount">{totalExpense.toLocaleString()}원</p>
                        <small>{expenses.length}건</small>
                    </div>
                    <div className="summary-card" style={{
                        background: netProfit >= 0
                            ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                            : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                    }}>
                        <h3><FiDollarSign /> 순이익</h3>
                        <p className="amount" style={{ color: netProfit >= 0 ? 'inherit' : '#fff' }}>
                            {netProfit.toLocaleString()}원
                        </p>
                        <small>{netProfit >= 0 ? '흑자' : '적자'}</small>
                    </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ marginBottom: '20px' }}>품목별 지출 현황</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>품목</th>
                                    <th>금액</th>
                                    <th>비율</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(expensesByCategory).length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="empty-state">지출 내역이 없습니다</td>
                                    </tr>
                                ) : (
                                    Object.entries(expensesByCategory)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([category, amount]) => (
                                            <tr key={category}>
                                                <td><span className="badge category-badge">{category}</span></td>
                                                <td className="amount-cell">{amount.toLocaleString()}원</td>
                                                <td>{totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0}%</td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ marginBottom: '20px' }}>결제 내역 ({selectedMonth})</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>날짜</th>
                                    <th>학생명</th>
                                    <th>결제월</th>
                                    <th>금액</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-state">결제 내역이 없습니다</td>
                                    </tr>
                                ) : (
                                    payments.map(payment => (
                                        <tr key={payment.id}>
                                            <td>{new Date(payment.paymentDate).toLocaleDateString('ko-KR')}</td>
                                            <td><strong>{getStudentName(payment.studentId)}</strong></td>
                                            <td>{payment.yearMonth}</td>
                                            <td className="amount-cell">{payment.amount.toLocaleString()}원</td>
                                            <td><span className="badge status-active">{payment.status}</span></td>
                                        </tr>
                                    ))
                                )}
                                {payments.length > 0 && (
                                    <tr style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
                                        <td colSpan="2">합계</td>
                                        <td>{payments.length}건</td>
                                        <td className="amount-cell">{totalIncome.toLocaleString()}원</td>
                                        <td></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Finance;
