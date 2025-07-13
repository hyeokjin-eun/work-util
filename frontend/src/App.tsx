import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {isAuthenticated && (
        <header className="app-header">
          <Link to="/" className="app-logo">
            <h1>Work Util</h1>
          </Link>
          <Navigation />
          <UserMenu />
        </header>
      )}
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
        </Routes>
      </main>
    </>
  );
}

function Navigation() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/todos', label: '할일', icon: '✓' },
    { path: '/meeting-notes', label: '회의록', icon: '📝' },
    { path: '/json-formatter', label: 'JSON', icon: '{}' },
    { path: '/json-compare', label: '비교', icon: '⚖️' },
    { path: '/qr-generator', label: 'QR', icon: '⊞' },
    { path: '/wbs', label: 'WBS', icon: '📊' }
  ];

  return (
    <nav className="app-nav">
      {menuItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path} 
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Home() {
  return (
    <div className="home">
      <h2>업무 효율을 높이는 도구 모음</h2>
      <div className="tool-grid">
        <Link to="/todos" className="tool-card">
          <h3>할일 관리</h3>
          <p>일정과 할일을 체계적으로 관리</p>
        </Link>
        <Link to="/meeting-notes" className="tool-card">
          <h3>회의록 메모</h3>
          <p>회의 내용을 간편하게 기록하고 관리</p>
        </Link>
        <Link to="/json-formatter" className="tool-card">
          <h3>JSON 포맷터</h3>
          <p>JSON 데이터를 보기 좋게 정리</p>
        </Link>
        <Link to="/json-compare" className="tool-card">
          <h3>JSON 비교기</h3>
          <p>두 JSON 데이터의 차이점을 비교</p>
        </Link>
        <Link to="/qr-generator" className="tool-card">
          <h3>QR 생성기</h3>
          <p>텍스트나 URL을 QR 코드로 변환</p>
        </Link>
        <Link to="/wbs" className="tool-card">
          <h3>WBS 관리</h3>
          <p>업무를 체계적으로 구조화하고 관리</p>
        </Link>
      </div>
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="user-menu">
      <span className="user-name">{user?.username}님</span>
      <button onClick={handleLogout} className="logout-btn">
        로그아웃
      </button>
    </div>
  );
}

export default App;