import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import '../styles/Home.css'

const Utilities: React.FC = () => {
  useEffect(() => {
    // Scroll to top when Utilities component loads
    window.scrollTo(0, 0)
  }, [])
  const utilitiesIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  )

  const tools = [
    {
      title: 'JSON 포맷터',
      description: 'JSON 데이터 정리 및 포맷팅',
      icon: '🔧',
      iconClass: 'tool',
      path: '/json-formatter'
    },
    {
      title: 'JSON 비교기',
      description: 'JSON 데이터 간의 차이점 분석',
      icon: '⚖️',
      iconClass: 'chart',
      path: '/json-compare'
    },
    {
      title: 'QR 생성기',
      description: '다양한 형식의 QR 코드 생성',
      icon: '📱',
      iconClass: 'note',
      path: '/qr-generator'
    }
  ]

  return (
    <Layout 
      pageTitle="유틸리티"
      pageSubtitle="업무 효율성을 높이는<br/>다양한 도구들을 활용해보세요"
      pageIcon={utilitiesIcon}
    >
      <div className="section-title">주요 도구</div>
      
      <div className="feature-grid">
        {tools.map((tool) => (
          <Link 
            key={tool.path}
            to={tool.path}
            className="feature-card"
          >
            <div className="feature-header">
              <div className={`feature-icon ${tool.iconClass}`}>{tool.icon}</div>
              <div className="feature-content">
                <div className="feature-title">{tool.title}</div>
                <div className="feature-description">{tool.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        
        <div className="grid grid-2 gap-md">
          <div className="card" style={{ textAlign: 'center', transition: 'all 0.3s ease', cursor: 'default' }}>
            <div className="stat-value">100%</div>
            <div className="stat-label">무료 이용</div>
          </div>
          <div className="card" style={{ textAlign: 'center', transition: 'all 0.3s ease', cursor: 'default' }}>
            <div className="stat-value">24/7</div>
            <div className="stat-label">언제든 사용</div>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'default' }}>
            <div className="stat-value">∞</div>
            <div className="stat-label">무제한 사용</div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Utilities