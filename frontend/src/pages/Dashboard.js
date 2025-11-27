import React, { useState, useEffect } from 'react';
import { studentAPI, financeAPI } from '../services/api';
import { getCurrentYearMonth, formatCurrency } from '../utils/helpers';
import { FiUsers, FiDollarSign, FiTrendingDown, FiPieChart } from 'react-icons/fi';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalIncome: 0,
        totalExpense: 0,
        netProfit: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const yearMonth = getCurrentYearMonth();
            const [studentsRes, financeRes] = await Promise.all([
                studentAPI.getAll(),
                financeAPI.getSummary(yearMonth),
            ]);

            setStats({
                totalStudents: studentsRes.data.length,
                totalIncome: financeRes.data.totalIncome || 0,
                totalExpense: financeRes.data.totalExpense || 0,
                netProfit: financeRes.data.netProfit || 0,
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">로딩중...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>대시보드</h1>
                <p>학원 운영 현황판</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e3f2fd' }}>
                        <FiUsers style={{ color: '#1976d2' }} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">총 학생 수</p>
                        <h3 className="stat-value">{stats.totalStudents}명</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                        <FiDollarSign style={{ color: '#388e3c' }} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">이번 달 수입</p>
                        <h3 className="stat-value">{formatCurrency(stats.totalIncome)}</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#ffebee' }}>
                        <FiTrendingDown style={{ color: '#d32f2f' }} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">이번 달 지출</p>
                        <h3 className="stat-value">{formatCurrency(stats.totalExpense)}</h3>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f3e5f5' }}>
                        <FiPieChart style={{ color: '#7b1fa2' }} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">순이익</p>
                        <h3 className="stat-value">{formatCurrency(stats.netProfit)}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
