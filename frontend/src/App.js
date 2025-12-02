import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiCheckSquare, FiDollarSign, FiTrendingDown, FiPieChart, FiCalendar, FiBookOpen, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Finance from './pages/Finance';
import Schedule from './pages/Schedule';
import Education from './pages/Education';
import authService from './services/authService';
import './App.css';

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🎓 학원 관리</h2>
          {user && <p className="user-name">{user.name}</p>}
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''} onClick={onClose}>
              <FiHome /> <span>대시보드</span>
            </Link>
          </li>
          <li>
            <Link to="/students" className={isActive('/students') ? 'active' : ''} onClick={onClose}>
              <FiUsers /> <span>학생 관리</span>
            </Link>
          </li>
          <li>
            <Link to="/attendance" className={isActive('/attendance') ? 'active' : ''} onClick={onClose}>
              <FiCheckSquare /> <span>출석 관리</span>
            </Link>
          </li>
          <li>
            <Link to="/payments" className={isActive('/payments') ? 'active' : ''} onClick={onClose}>
              <FiDollarSign /> <span>결제 관리</span>
            </Link>
          </li>
          <li>
            <Link to="/expenses" className={isActive('/expenses') ? 'active' : ''} onClick={onClose}>
              <FiTrendingDown /> <span>지출 관리</span>
            </Link>
          </li>
          <li>
            <Link to="/finance" className={isActive('/finance') ? 'active' : ''} onClick={onClose}>
              <FiPieChart /> <span>재무 현황</span>
            </Link>
          </li>
          <li>
            <Link to="/schedule" className={isActive('/schedule') ? 'active' : ''} onClick={onClose}>
              <FiCalendar /> <span>스케줄</span>
            </Link>
          </li>
          <li>
            <Link to="/education" className={isActive('/education') ? 'active' : ''} onClick={onClose}>
              <FiBookOpen /> <span>교육 기록</span>
            </Link>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut /> <span>로그아웃</span>
          </button>
        </div>
      </nav>
    </>
  );
}

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = authService.getUser();

  return (
    <div className="app">
      <header className="mobile-header">
        <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <FiX /> : <FiMenu />}
        </button>
        {user && <span className="mobile-title">{user.name}</span>}
        <div style={{ width: 40 }}></div> {/* Spacer for centering */}
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
