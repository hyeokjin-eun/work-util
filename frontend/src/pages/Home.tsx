import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import '../styles/Home.css'

const Home: React.FC = () => {
  const { } = useAuth()

  useEffect(() => {
    // Scroll to top when Home component loads
    window.scrollTo(0, 0)
  }, [])

  const homeIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  )

  return (
    <Layout 
      pageTitle="홈"
      pageSubtitle="업무 효율을 높이는 스마트한 도구 모음과 함께<br/>더 생산적인 하루를 시작하세요"
      pageIcon={homeIcon}
    >
      <div className="home-container">
        {/* Main Features */}
        <div className="section-title">주요 기능</div>
        
        <div className="feature-grid">
          <Link to="/todo" className="feature-card">
            <div className="feature-header">
              <div className="feature-icon task">✓</div>
              <div>
                <div className="feature-title">할일 관리</div>
                <div className="feature-description">우선순위와 마감일을 설정하여 체계적으로 업무 관리</div>
              </div>
            </div>
          </Link>

          <Link to="/meeting-notes" className="feature-card">
            <div className="feature-header">
              <div className="feature-icon note">📝</div>
              <div>
                <div className="feature-title">메모 작성</div>
                <div className="feature-description">빠르고 간편한 메모 작성 및 관리 도구</div>
              </div>
            </div>
          </Link>

          <Link to="/wbs-manager" className="feature-card">
            <div className="feature-header">
              <div className="feature-icon chart">📊</div>
              <div>
                <div className="feature-title">WBS 관리</div>
                <div className="feature-description">프로젝트를 체계적으로 구조화하고 진행상황 추적</div>
              </div>
            </div>
          </Link>

          <Link to="/utilities" className="feature-card">
            <div className="feature-header">
              <div className="feature-icon tool">🔧</div>
              <div>
                <div className="feature-title">유틸리티</div>
                <div className="feature-description">QR 생성기, JSON 포맷터, JSON 비교기 등 유용한 도구들</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default Home