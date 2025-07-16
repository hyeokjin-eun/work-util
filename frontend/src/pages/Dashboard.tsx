import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import '../styles/Dashboard.css'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [animateStats, setAnimateStats] = useState(false)

  useEffect(() => {
    // Scroll to top when Dashboard component loads
    window.scrollTo(0, 0)
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const animationTimer = setTimeout(() => {
      setAnimateStats(true)
    }, 500)

    return () => {
      clearInterval(timer)
      clearTimeout(animationTimer)
    }
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return '좋은 아침입니다'
    if (hour < 18) return '좋은 오후입니다'
    return '좋은 저녁입니다'
  }

  const dashboardIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M12 20V10"/>
      <path d="M18 20V4"/>
      <path d="M6 20v-4"/>
    </svg>
  )

  return (
    <Layout 
      pageTitle="대시보드"
      pageSubtitle="좋은 저녁입니다, test님!<br/>오늘도 생산적인 하루 보내세요"
      pageIcon={dashboardIcon}
    >
      <div className="dashboard-container">
        {/* Floating Background Elements */}
        <div className="floating-elements">
          <div className="floating-element floating-element-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div className="floating-element floating-element-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            </svg>
          </div>
          <div className="floating-element floating-element-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10"/>
            </svg>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <div className="welcome-time">
              {currentTime.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </div>
            <div className="welcome-date">
              {currentTime.toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
          </div>
          <div className="welcome-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="stats-overview">
          <div className={`modern-stat-card ${animateStats ? 'animate' : ''}`}>
            <div className="stat-icon stat-icon-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">5</div>
              <div className="stat-label">전체 할일</div>
            </div>
          </div>
          <div className={`modern-stat-card ${animateStats ? 'animate' : ''}`} style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon stat-icon-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">3</div>
              <div className="stat-label">완료된 할일</div>
            </div>
          </div>
          <div className={`modern-stat-card ${animateStats ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon stat-icon-warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="12 6v6l4 2"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">60%</div>
              <div className="stat-label">완료율</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="section-header">
            <h3 className="section-title">오늘의 진행률</h3>
            <div className="pulse-indicator"></div>
          </div>
          <div className="progress-card">
            <div className="progress-info">
              <span className="progress-label">할일 완료율</span>
              <span className="progress-percentage">60%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="progress-details">3/5 완료</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3 className="section-title">빠른 실행</h3>
          <div className="quick-actions-grid">
            <Link to="/todo" className="action-card action-card-primary">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className="action-content">
                <div className="action-title">새 할일 추가</div>
                <div className="action-subtitle">작업을 추가하세요</div>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            <Link to="/meeting-notes" className="action-card action-card-secondary">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
              </div>
              <div className="action-content">
                <div className="action-title">회의록 작성</div>
                <div className="action-subtitle">회의 내용을 기록하세요</div>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            <Link to="/json-formatter" className="action-card action-card-accent">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div className="action-content">
                <div className="action-title">JSON 포맷팅</div>
                <div className="action-subtitle">데이터를 정리하세요</div>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            <Link to="/qr-generator" className="action-card action-card-info">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div className="action-content">
                <div className="action-title">QR 코드 생성</div>
                <div className="action-subtitle">링크를 공유하세요</div>
              </div>
              <div className="action-arrow">→</div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="section-header">
            <h3 className="section-title">최근 활동</h3>
            <div className="activity-indicator">
              <div className="activity-dot"></div>
              <span>실시간</span>
            </div>
          </div>
          <div className="activity-card">
            <div className="activity-summary">
              <div className="activity-stats">
                <div className="activity-stat">
                  <div className="activity-stat-value">0</div>
                  <div className="activity-stat-label">회의록</div>
                </div>
                <div className="activity-stat">
                  <div className="activity-stat-value">0</div>
                  <div className="activity-stat-label">프로젝트</div>
                </div>
                <div className="activity-stat">
                  <div className="activity-stat-value">5</div>
                  <div className="activity-stat-label">도구 사용</div>
                </div>
              </div>
              <div className="activity-chart">
                <div className="chart-bar" style={{ height: '40%' }}></div>
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '30%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
                <div className="chart-bar" style={{ height: '50%' }}></div>
              </div>
            </div>
            <div className="activity-message">
              <div className="no-activity-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10"/>
                  <path d="M18 20V4"/>
                  <path d="M6 20v-4"/>
                </svg>
              </div>
              <div className="no-activity-text">
                <div className="no-activity-title">시작할 준비가 되었습니다!</div>
                <div className="no-activity-subtitle">첫 번째 작업을 추가해보세요</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard