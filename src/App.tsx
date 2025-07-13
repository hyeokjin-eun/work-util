import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TodoList from './pages/TodoList';
import MeetingNotes from './pages/MeetingNotes';
import JsonFormatter from './pages/JsonFormatter';
import JsonCompare from './pages/JsonCompare';
import QrGenerator from './pages/QrGenerator';
import WbsManager from './pages/WbsManager';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Work Util - 업무 도구 모음</h1>
          <nav className="app-nav">
            <Link to="/todos">할일 관리</Link>
            <Link to="/meeting-notes">회의록</Link>
            <Link to="/json-formatter">JSON 포맷터</Link>
            <Link to="/json-compare">JSON 비교</Link>
            <Link to="/qr-generator">QR 생성기</Link>
            <Link to="/wbs">WBS 관리</Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/meeting-notes" element={<MeetingNotes />} />
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/json-compare" element={<JsonCompare />} />
            <Route path="/qr-generator" element={<QrGenerator />} />
            <Route path="/wbs" element={<WbsManager />} />
          </Routes>
        </main>
      </div>
    </Router>
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

export default App;