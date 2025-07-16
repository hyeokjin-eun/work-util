import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import './styles/globals.css';
import './styles/Home.css';
import { AuthProvider, useAuth } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './pages/TodoList';
import MeetingNotes from './pages/MeetingNotes';
import JsonFormatter from './pages/JsonFormatter';
import JsonCompare from './pages/JsonCompare';
import QrGenerator from './pages/QrGenerator';
import WbsManager from './pages/WbsManager';
import MyPage from './pages/MyPage';
import Utilities from './pages/Utilities';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const hideNavPaths = ['/login', '/register'];
  const showNav = isAuthenticated && !hideNavPaths.includes(location.pathname);
  const isAuthPage = hideNavPaths.includes(location.pathname);
  
  // If it's an auth page, render without the app wrapper
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }
  
  return (
    <div className="app">
      {showNav && <TopHeader />}
      <main className={`app-main ${showNav ? 'with-nav' : 'no-nav'}`}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/todos" element={
            <ProtectedRoute>
              <TodoList />
            </ProtectedRoute>
          } />
          <Route path="/meeting-notes" element={
            <ProtectedRoute>
              <MeetingNotes />
            </ProtectedRoute>
          } />
          <Route path="/json-formatter" element={
            <ProtectedRoute>
              <JsonFormatter />
            </ProtectedRoute>
          } />
          <Route path="/json-compare" element={
            <ProtectedRoute>
              <JsonCompare />
            </ProtectedRoute>
          } />
          <Route path="/qr-generator" element={
            <ProtectedRoute>
              <QrGenerator />
            </ProtectedRoute>
          } />
          <Route path="/wbs" element={
            <ProtectedRoute>
              <WbsManager />
            </ProtectedRoute>
          } />
          <Route path="/utilities" element={
            <ProtectedRoute>
              <Utilities />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } />
          <Route path="/mypage" element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {showNav && <BottomNavigation />}
    </div>
  );
}

function TopHeader() {
  const { user, logout } = useAuth();
  
  return (
    <header className="header">
      <div className="logo">SmartWork</div>
      <div className="user-info">
        <span style={{fontSize: '14px', color: '#64748b'}}>{user?.username}</span>
        <div className="user-avatar">
          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}

function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        <div 
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <div className="nav-icon">🏠</div>
          <span className="nav-label">홈</span>
        </div>
        <div 
          className={`nav-item ${location.pathname === '/utilities' ? 'active' : ''}`}
          onClick={() => navigate('/utilities')}
        >
          <div className="nav-icon">🔧</div>
          <span className="nav-label">유틸리티</span>
        </div>
        <div 
          className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <div className="nav-icon">📊</div>
          <span className="nav-label">대시보드</span>
        </div>
        <div 
          className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}
          onClick={() => navigate('/calendar')}
        >
          <div className="nav-icon">📅</div>
          <span className="nav-label">캘린더</span>
        </div>
        <div 
          className={`nav-item ${location.pathname === '/mypage' ? 'active' : ''}`}
          onClick={() => navigate('/mypage')}
        >
          <div className="nav-icon">👤</div>
          <span className="nav-label">마이</span>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="chart-icon">
            <div className="chart-bar"></div>
            <div className="chart-bar"></div>
            <div className="chart-bar"></div>
          </div>
          <h1>업무 효율을 높이는<br />스마트한 도구 모음</h1>
          <p>Work Util과 함께 더 생산적인 하루를 시작하세요</p>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">주요 기능</h2>
        <div className="feature-grid">
          <div className="feature-card" onClick={() => navigate('/todos')}>
            <div className="feature-icon icon-todo">
              <span style={{ color: 'white' }}>✓</span>
            </div>
            <h3 className="feature-title">할일 관리</h3>
            <p className="feature-desc">우선순위와 마감일을 설정하여 체계적으로 업무 관리</p>
          </div>
          
          <div className="feature-card" onClick={() => navigate('/meeting-notes')}>
            <div className="feature-icon icon-memo">📝</div>
            <h3 className="feature-title">회의록 메모</h3>
            <p className="feature-desc">회의 내용을 구조화하여 간편하게 기록하고 공유</p>
          </div>
          
          <div className="feature-card" onClick={() => navigate('/wbs')}>
            <div className="feature-icon icon-wbs">📊</div>
            <h3 className="feature-title">WBS 관리</h3>
            <p className="feature-desc">프로젝트를 체계적으로 구조화하고 진행상황 추적</p>
          </div>
          
          <div className="feature-card" onClick={() => navigate('/utilities')}>
            <div className="feature-icon icon-tools">🔧</div>
            <h3 className="feature-title">유틸리티</h3>
            <p className="feature-desc">QR 생성기, JSON 포맷터, JSON 비교기 등 유용한 도구들</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;