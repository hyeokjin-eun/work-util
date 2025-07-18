import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from './Navigation'
import DesktopNav from './DesktopNav'
import DesktopLayout from './DesktopLayout'
import useScreenSize from '../hooks/useScreenSize'

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
  const [showFixedHeader, setShowFixedHeader] = useState(false)
  const { isDesktop } = useScreenSize()

  useEffect(() => {
    const handleScroll = () => {
      const headerElement = document.querySelector('.header')
      if (headerElement) {
        const headerRect = headerElement.getBoundingClientRect()
        const titleElement = headerElement.querySelector('.app-title')
        
        if (titleElement) {
          const titleRect = titleElement.getBoundingClientRect()
          // 타이틀이 화면 상단에 가까워지면 고정 헤더 표시
          setShowFixedHeader(titleRect.bottom < 60)
        } else {
          // 타이틀이 없으면 기본 로직 사용
          setShowFixedHeader(headerRect.bottom < 0)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    // 초기 로딩 시에도 체크
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  // Desktop layout
  if (isDesktop) {
    return (
      <div className="desktop-layout">
        <DesktopLayout>
          {children}
        </DesktopLayout>
      </div>
    )
  }

  // Mobile layout
  return (
    <div className="app-container">
      <div className={`fixed-header ${showFixedHeader ? 'visible' : ''}`}>
        <div className="fixed-header-content">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
          <h2 className="page-title">{pageTitle}</h2>
        </div>
      </div>
      <div className="header">
        <div className="header-content">
          <div className="app-title">
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              ←
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