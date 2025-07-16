import React, { useEffect, useState } from 'react';

const Intro: React.FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    // 점 애니메이션
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') {
          return '';
        } else {
          return prev + '.';
        }
      });
    }, 500);

    // 3초 후 자동으로 로그인 페이지로 이동
    const autoRedirect = setTimeout(() => {
      document.body.classList.add('fade-out');
      setTimeout(() => {
        // 여기서 로그인 페이지로 이동
        alert('로그인 페이지로 이동합니다!');
        // window.location.href = '/login';
      }, 800);
    }, 3000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(autoRedirect);
    };
  }, []);

  // 스킵 버튼 클릭 시 즉시 이동
  const skipIntro = () => {
    document.body.classList.add('fade-out');
    setTimeout(() => {
      alert('로그인 페이지로 이동합니다!');
      // window.location.href = '/login';
    }, 800);
  };

  return (
    <div style={{
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .background-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          z-index: 1;
        }

        .background-animation::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          animation: floatBackground 20s linear infinite;
        }

        @keyframes floatBackground {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-30px) rotate(360deg); }
        }

        .floating-icons {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .floating-icon {
          position: absolute;
          opacity: 0.3;
          animation: float 6s ease-in-out infinite;
        }

        .floating-icon:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-icon:nth-child(2) {
          top: 30%;
          right: 15%;
          animation-delay: -2s;
        }

        .floating-icon:nth-child(3) {
          bottom: 30%;
          left: 15%;
          animation-delay: -4s;
        }

        .floating-icon:nth-child(4) {
          bottom: 20%;
          right: 10%;
          animation-delay: -1s;
        }

        .floating-icon:nth-child(5) {
          top: 15%;
          left: 50%;
          animation-delay: -3s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .logo-container {
          animation: logoEntrance 2s ease-out;
          animation-fill-mode: both;
        }

        @keyframes logoEntrance {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(30px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .logo-icon {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          animation: iconPulse 2s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
        }

        .app-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          animation: titleSlide 2s ease-out 0.3s;
          animation-fill-mode: both;
        }

        @keyframes titleSlide {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .app-subtitle {
          font-size: 18px;
          font-weight: 400;
          opacity: 0.9;
          margin-bottom: 40px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          animation: subtitleSlide 2s ease-out 0.6s;
          animation-fill-mode: both;
        }

        @keyframes subtitleSlide {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .loading-container {
          animation: loadingEntrance 2s ease-out 0.9s;
          animation-fill-mode: both;
        }

        @keyframes loadingEntrance {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loading-text {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 20px;
          opacity: 0.8;
        }

        .loading-bar {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
        }

        .loading-progress {
          height: 100%;
          background: linear-gradient(90deg, #ffffff, #e0e7ff);
          border-radius: 2px;
          animation: loadingProgress 3s ease-in-out;
          animation-fill-mode: both;
        }

        @keyframes loadingProgress {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }

        .fade-out {
          animation: fadeOut 0.8s ease-in-out forwards;
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .skip-button {
          position: absolute;
          top: 40px;
          right: 40px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          z-index: 20;
        }

        .skip-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
      `}</style>
      
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

      <div className="intro-container" style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
            </svg>
          </div>
        </div>
        
        <div className="app-title">SmartWork</div>
        <div className="app-subtitle">업무 효율을 높이는 스마트한 도구</div>
        
        <div className="loading-container">
          <div className="loading-text">시작하는 중<span>{dots}</span></div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;