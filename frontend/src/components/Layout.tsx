import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from './Navigation'

interface LayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
  pageTitle?: string
  pageSubtitle?: string
  pageIcon?: React.ReactNode
  headerChart?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavigation = true, 
  pageTitle = "SmartWork",
  pageSubtitle = "스마트한 업무 도구",
  pageIcon,
  headerChart
}) => {
  const navigate = useNavigate()
  return (
    <div className="app-container">
      <div className="header">
        <div className="header-content">
          <div className="app-title">
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1>{pageTitle}</h1>
          </div>
          {(pageIcon || headerChart) && (
            <div className="chart-container">
              {pageIcon || headerChart}
            </div>
          )}
          <div className="completion-text" dangerouslySetInnerHTML={{ __html: pageSubtitle }}>
          </div>
        </div>
      </div>
      
      <main className="main-content">
        {children}
      </main>
      
      {showNavigation && <Navigation />}
    </div>
  )
}

export default Layout