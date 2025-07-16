import React, { useEffect } from 'react'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'

const MyPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when MyPage component loads
    window.scrollTo(0, 0)
  }, [])
  const { user, logout } = useAuth()

  const userIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )

  return (
    <Layout 
      pageTitle="마이페이지"
      pageSubtitle={`안녕하세요, ${user?.username}님!<br/>프로필과 설정을 관리하세요`}
      pageIcon={userIcon}
    >
      {/* User Profile */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'var(--primary-blue)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 15px',
          color: 'white',
          fontSize: '32px',
          fontWeight: '600'
        }}>
          {user?.username ? user.username[0].toUpperCase() : 'U'}
        </div>
        <div style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
          {user?.username || 'User'}
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {user?.email || 'user@example.com'}
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">15</div>
          <div className="stat-label">완료한 작업</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">7</div>
          <div className="stat-label">진행중인 작업</div>
        </div>
      </div>

      <div className="stat-card" style={{ marginBottom: '20px' }}>
        <div className="stat-value">68%</div>
        <div className="stat-label">생산성 점수</div>
      </div>

      {/* Activity Summary */}
      <div className="section-title">활동 요약</div>
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <div style={{ fontSize: '14px', color: '#333' }}>이번 주 완료한 할일</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--success)' }}>8개</div>
          </div>
          <div className="flex-between">
            <div style={{ fontSize: '14px', color: '#333' }}>작성한 회의록</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--warning)' }}>3개</div>
          </div>
          <div className="flex-between">
            <div style={{ fontSize: '14px', color: '#333' }}>사용한 유틸리티</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary-blue)' }}>12회</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="section-title">설정</div>
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>알림 설정</div>
            <div style={{ fontSize: '12px', color: '#666' }}>&gt;</div>
          </div>
          <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>테마 설정</div>
            <div style={{ fontSize: '12px', color: '#666' }}>&gt;</div>
          </div>
          <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>데이터 내보내기</div>
            <div style={{ fontSize: '12px', color: '#666' }}>&gt;</div>
          </div>
          <div className="flex-between" style={{ padding: '10px 0' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>도움말</div>
            <div style={{ fontSize: '12px', color: '#666' }}>&gt;</div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={logout}
        style={{
          width: '100%',
          padding: '16px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        로그아웃
      </button>
    </Layout>
  )
}

export default MyPage