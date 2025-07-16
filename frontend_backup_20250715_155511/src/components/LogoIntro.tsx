import React, { useEffect, useState } from 'react';
import './LogoIntro.css';

interface LogoIntroProps {
  onComplete: () => void;
}

const LogoIntro: React.FC<LogoIntroProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto complete after animation duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 3000); // Show for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="logo-intro-overlay">
      <div className="logo-intro-container">
        <div className="logo-intro-content">
          <img 
            src="/work_util_logo.png" 
            alt="Work Util" 
            className="logo-intro-image"
          />
          <div className="logo-intro-text">
            <h1 className="logo-intro-title">Work Util</h1>
            <p className="logo-intro-subtitle">업무 효율을 높이는 스마트한 도구 모음</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoIntro;