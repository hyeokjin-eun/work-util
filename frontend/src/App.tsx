import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import './styles/globals.css';
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
import IntroModal from './components/IntroModal';
import { useIntro } from './hooks/useIntro';

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
  const { showIntro, completeIntro } = useIntro();
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
        </Routes>
      </main>
      {showNav && <BottomNavigation />}
      
      {/* Show intro modal only when authenticated and on first visit */}
      {isAuthenticated && showIntro && (
        <IntroModal isOpen={showIntro} onClose={completeIntro} />
      )}
    </div>
  );
}

function TopHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/': 'Work Util',
      '/todos': '할일 관리',
      '/meeting-notes': '회의록 메모',
      '/json-formatter': 'JSON 포맷터',
      '/json-compare': 'JSON 비교기',
      '/qr-generator': 'QR 생성기',
      '/wbs': 'WBS 관리'
    };
    return titles[location.pathname] || 'Work Util';
  };

  return (
    <header className="top-header">
      <div className="header-content">
        <h1 className="page-title">{getPageTitle()}</h1>
        <div className="user-menu">
          <span className="user-name">{user?.username}</span>
          <button onClick={logout} className="logout-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { path: '/', label: '홈', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { path: '/todos', label: '할일', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { path: '/meeting-notes', label: '회의록', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { path: '/json-formatter', label: 'JSON', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16 18l2-2-2-2M8 6L6 8l2 2" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 4l-4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { path: '/qr-generator', label: 'QR', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
        <rect x="15" y="15" width="5" height="5" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )}
  ];

  return (
    <nav className="bottom-nav">
      {menuItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { forceShowIntro } = useIntro();
  
  const heroSlides = [
    {
      title: "업무 효율을 높이는\n스마트한 도구 모음",
      subtitle: "Work Util과 함께 더 생산적인 하루를 시작하세요",
      image: "📊"
    },
    {
      title: "모든 업무를\n한 곳에서 관리",
      subtitle: "할일, 회의록, 데이터 처리까지 올인원 솔루션",
      image: "💼"
    },
    {
      title: "간편하고 빠른\n업무 도구",
      subtitle: "복잡한 기능 없이 필요한 것만 제공합니다",
      image: "⚡"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-carousel">
          <div className="hero-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {heroSlides.map((slide, index) => (
              <div key={index} className="hero-slide">
                <div className="hero-icon">{slide.image}</div>
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
              </div>
            ))}
          </div>
          <button className="carousel-btn prev" onClick={prevSlide}>‹</button>
          <button className="carousel-btn next" onClick={nextSlide}>›</button>
          <div className="carousel-dots">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h3>주요 기능</h3>
        <div className="feature-grid">
          <Link to="/todos" className="feature-card" data-feature="todo">
            <div className="feature-icon">✓</div>
            <h4>할일 관리</h4>
            <p>우선순위와 마감일을 설정하여 체계적으로 업무 관리</p>
          </Link>
          <Link to="/meeting-notes" className="feature-card" data-feature="meeting">
            <div className="feature-icon">📝</div>
            <h4>회의록 메모</h4>
            <p>회의 내용을 구조화하여 간편하게 기록하고 공유</p>
          </Link>
          <Link to="/json-formatter" className="feature-card" data-feature="json">
            <div className="feature-icon">{'{}'}</div>
            <h4>JSON 포맷터</h4>
            <p>복잡한 JSON 데이터를 보기 좋게 정리하고 분석</p>
          </Link>
          <Link to="/json-compare" className="feature-card" data-feature="compare">
            <div className="feature-icon">⚖️</div>
            <h4>JSON 비교기</h4>
            <p>두 JSON 파일의 차이점을 시각적으로 비교</p>
          </Link>
          <Link to="/qr-generator" className="feature-card" data-feature="qr">
            <div className="feature-icon">⊞</div>
            <h4>QR 생성기</h4>
            <p>URL, 텍스트, WiFi 정보를 QR 코드로 변환</p>
          </Link>
          <Link to="/wbs" className="feature-card" data-feature="wbs">
            <div className="feature-icon">📊</div>
            <h4>WBS 관리</h4>
            <p>프로젝트를 체계적으로 구조화하고 진행상황 추적</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;