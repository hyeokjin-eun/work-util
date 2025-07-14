import React, { useState } from 'react';
import './IntroModal.css';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IntroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: IntroSlide[] = [
    {
      id: 1,
      title: "Work Util에 오신 것을 환영합니다! 🎉",
      subtitle: "업무 효율을 높이는 스마트한 도구 모음",
      description: "일상적인 업무에서 자주 사용되는 6가지 유틸리티를 하나의 플랫폼에서 제공합니다.",
      icon: "🚀",
      color: "var(--gradient-primary)",
      features: [
        "✨ 깔끔하고 직관적인 UI",
        "📱 모바일 최적화 디자인", 
        "🔒 안전한 데이터 관리",
        "⚡ 빠르고 효율적인 도구들"
      ]
    },
    {
      id: 2,
      title: "할일 관리",
      subtitle: "체계적인 업무 관리 시스템",
      description: "우선순위와 마감일을 설정하여 효율적으로 할일을 관리하세요.",
      icon: "✅",
      color: "var(--todo-color)",
      features: [
        "🎯 우선순위별 할일 분류",
        "📅 마감일 및 스케줄 관리",
        "📊 진행 상황 시각화",
        "🏷️ 상태별 필터링 기능"
      ]
    },
    {
      id: 3,
      title: "회의록 & JSON 도구",
      subtitle: "문서화와 데이터 처리 도구",
      description: "회의 내용을 체계적으로 기록하고 JSON 데이터를 쉽게 처리하세요.",
      icon: "📝",
      color: "var(--meeting-color)",
      features: [
        "📋 구조화된 회의록 작성",
        "🎨 JSON 포맷팅 및 검증",
        "🔍 JSON 파일 비교 분석",
        "📊 데이터 통계 및 시각화"
      ]
    },
    {
      id: 4,
      title: "QR 생성기 & WBS 관리",
      subtitle: "프로젝트 관리와 편의 도구",
      description: "QR 코드 생성과 프로젝트 구조화로 업무 생산성을 높이세요.",
      icon: "📊",
      color: "var(--qr-color)",
      features: [
        "📱 다양한 형식의 QR 코드 생성",
        "🏗️ 프로젝트 구조 관리 (WBS)",
        "📈 진행률 추적 및 분석",
        "🎯 목표 설정 및 달성 관리"
      ]
    },
    {
      id: 5,
      title: "지금 바로 시작하세요!",
      subtitle: "생산적인 업무를 위한 모든 준비가 완료되었습니다",
      description: "Work Util의 모든 기능을 활용하여 더 효율적인 업무 환경을 만들어보세요.",
      icon: "🎯",
      color: "var(--gradient-primary)",
      features: [
        "🔥 즉시 사용 가능한 모든 도구",
        "💡 직관적인 사용자 인터페이스",
        "🔄 실시간 동기화 및 저장",
        "🎨 개인화된 업무 환경 구성"
      ]
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const skipIntro = () => {
    onClose();
  };

  if (!isOpen) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <div className="intro-modal-overlay">
      <div className="intro-modal">
        <div className="intro-header">
          <button className="skip-btn" onClick={skipIntro}>
            건너뛰기
          </button>
          <div className="progress-indicator">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentSlide ? 'active' : ''} ${index < currentSlide ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="intro-content">
          <div className="intro-slide" style={{ background: currentSlideData.color }}>
            <div className="slide-icon">
              {currentSlideData.icon}
            </div>
            <h1 className="slide-title">{currentSlideData.title}</h1>
            <p className="slide-subtitle">{currentSlideData.subtitle}</p>
            <p className="slide-description">{currentSlideData.description}</p>
          </div>

          <div className="intro-features">
            <h3>주요 기능</h3>
            <div className="features-list">
              {currentSlideData.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="intro-navigation">
          <button 
            className="nav-btn secondary" 
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            이전
          </button>
          
          <span className="slide-counter">
            {currentSlide + 1} / {slides.length}
          </span>
          
          <button 
            className="nav-btn primary" 
            onClick={nextSlide}
          >
            {currentSlide === slides.length - 1 ? '시작하기' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;