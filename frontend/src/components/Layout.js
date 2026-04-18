import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/members', label: 'Members', icon: '👥' },
  { to: '/trainers', label: 'Trainers', icon: '💪' },
  { to: '/plans', label: 'Plans', icon: '📋' },
  { to: '/attendance', label: 'Attendance', icon: '✅' },
];

const pageTitles = {
  '/': 'Dashboard',
  '/members': 'Members',
  '/trainers': 'Trainers',
  '/plans': 'Membership Plans',
  '/attendance': 'Attendance',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const path = window.location.pathname;
  const title = pageTitles[path] || 'FitPro GMS';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>🏋️ FitPro</h2>
          <span>Gym Management System</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <h1>{title}</h1>
          <span className="topbar-date">📅 {today}</span>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
