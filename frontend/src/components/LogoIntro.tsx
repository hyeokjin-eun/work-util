import React, { useEffect, useState } from 'react'
import '../styles/LogoIntro.css'

interface LogoIntroProps {
  onComplete: () => void
}

const LogoIntro: React.FC<LogoIntroProps> = ({ onComplete }) => {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setTimeout(onComplete, 800)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      const dotsElement = document.querySelector('.dots')
      if (dotsElement) {
        const currentDots = dotsElement.textContent || ''
        if (currentDots === '...') {
          dotsElement.textContent = ''
        } else {
          dotsElement.textContent += '.'
        }
      }
    }, 500)

    return () => clearInterval(dotsInterval)
  }, [])

  const skipIntro = () => {
    setIsAnimating(false)
    setTimeout(onComplete, 800)
  }

  return (
    <div className={`logo-intro ${!isAnimating ? 'fade-out' : ''}`}>
      <div className="background-animation"></div>
      
      <div className="floating-icons">
        <div className="floating-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
          </svg>
        </div>
        <div className="floating-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
        <div className="floating-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20V10"/>
            <path d="M18 20V4"/>
            <path d="M6 20v-4"/>
          </svg>
        </div>
        <div className="floating-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
          </svg>
        </div>
        <div className="floating-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>

      <button className="skip-button" onClick={skipIntro}>건너뛰기</button>

      <div className="intro-container">
        <div className="loading-container">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
              </svg>
            </div>
          </div>
          
          <div className="app-title">SmartWork</div>
          <div className="app-subtitle">업무 효율을 높이는 스마트한 도구</div>
          
          <div className="loading-text">시작하는 중<span className="dots"></span></div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoIntro