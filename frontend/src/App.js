import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FiHome, FiUsers, FiCheckSquare, FiDollarSign, FiTrendingDown, FiPieChart, FiCalendar, FiBookOpen } from 'react-icons/fi';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Finance from './pages/Finance';
import Schedule from './pages/Schedule';
import Education from './pages/Education';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h2>학원 관리</h2>
          </div>
          <ul className="nav-menu">
            <li>
              <Link to="/">
                <FiHome /> <span>대시보드</span>
              </Link>
            </li>
            <li>
              <Link to="/students">
                <FiUsers /> <span>학생 관리</span>
              </Link>
            </li>
            <li>
              <Link to="/attendance">
                <FiCheckSquare /> <span>출석 관리</span>
              </Link>
            </li>
            <li>
              <Link to="/payments">
                <FiDollarSign /> <span>결제 관리</span>
              </Link>
            </li>
            <li>
              <Link to="/expenses">
                <FiTrendingDown /> <span>지출 관리</span>
              </Link>
            </li>
            <li>
              <Link to="/finance">
                <FiPieChart /> <span>재무 현황</span>
              </Link>
            </li>
            <li>
              <Link to="/schedule">
                <FiCalendar /> <span>스케줄</span>
              </Link>
            </li>
            <li>
              <Link to="/education">
                <FiBookOpen /> <span>교육 기록</span>
              </Link>
            </li>
          </ul>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/education" element={<Education />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
