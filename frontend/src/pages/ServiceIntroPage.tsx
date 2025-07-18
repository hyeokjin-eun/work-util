import React from 'react';
import '../styles/ServiceIntroPage.css';

const ServiceIntroPage: React.FC = () => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/smartwork.dmg';
    link.download = 'smartwork.dmg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="service-intro-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-logo-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
              </svg>
            </div>
            <h1 className="hero-title">
              <span className="gradient-text">SmartWork</span>
            </h1>
            <p className="hero-subtitle">
              생산성 향상을 위한 통합 업무 관리 시스템
            </p>
            <p className="hero-description">
              업무 효율성을 높이는 통합 유틸리티 도구 모음입니다.<br/>
              할일 관리부터 데이터 처리까지 일상적인 업무에 필요한 모든 도구를 하나의 플랫폼에서 제공합니다.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn-primary"
                onClick={() => window.location.href = '/intro'}
              >
                웹 로그인하여 시작하기
              </button>
              <button className="btn-secondary" onClick={handleDownload}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                macOS 앱 다운로드
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="app-preview">
              <div className="app-window">
                <div className="window-header">
                  <div className="window-controls">
                    <div className="control control-close"></div>
                    <div className="control control-minimize"></div>
                    <div className="control control-maximize"></div>
                  </div>
                  <div className="window-title">SmartWork</div>
                </div>
                <div className="window-content">
                  <div className="preview-sidebar">
                    <div className="sidebar-item active">대시보드</div>
                    <div className="sidebar-item">할일 관리</div>
                    <div className="sidebar-item">회의록</div>
                    <div className="sidebar-item">WBS 관리</div>
                    <div className="sidebar-item">JSON 도구</div>
                    <div className="sidebar-item">QR 생성기</div>
                  </div>
                  <div className="preview-main">
                    <div className="widget-preview">
                      <div className="widget-item">
                        <div className="widget-value">24</div>
                        <div className="widget-label">총 프로젝트</div>
                      </div>
                      <div className="widget-item">
                        <div className="widget-value">92%</div>
                        <div className="widget-label">완료율</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">주요 기능</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon todo-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h3>할일 관리</h3>
              <p>우선순위, 마감일, 상태별로 체계적인 할일 관리</p>
              <div className="feature-details">
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>3단계 우선순위 관리 (높음/보통/낮음)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>마감일 알림 및 달력 연동</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>카테고리별 할일 분류 시스템</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>태그 기반 검색 및 필터링</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>완료율 통계 및 생산성 분석</span>
                </div>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon meeting-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3>회의록 메모</h3>
              <p>구조화된 회의록으로 효율적인 회의 관리</p>
              <div className="feature-details">
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>참석자 및 안건 체계적 관리</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>액션 아이템 자동 추출</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>회의록 템플릿 및 포맷팅</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>검색 가능한 회의록 아카이브</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>PDF 내보내기 및 공유</span>
                </div>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon wbs-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h18v18H3z"/>
                  <path d="M12 8v8m-4-4h8M7 3v18m10-18v18"/>
                </svg>
              </div>
              <h3>WBS 관리</h3>
              <p>프로젝트 구조화 및 진행률 시각화</p>
              <div className="feature-details">
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>5레벨 계층 구조 작업 분해</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>칸반 보드 스타일 관리</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>프로젝트 템플릿 (소프트웨어/마케팅)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>실시간 진행률 추적</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>마일스톤 및 KPI 관리</span>
                </div>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon dashboard-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10"/>
                  <path d="M18 20V4"/>
                  <path d="M6 20v-4"/>
                </svg>
              </div>
              <h3>통합 대시보드</h3>
              <p>모든 활동을 한눈에 보는 실시간 대시보드</p>
              <div className="feature-details">
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>실시간 할일 완료율 차트</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>프로젝트 진행률 시각화</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>생산성 점수 및 활동 통계</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>빠른 액션 메뉴</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>맞춤형 위젯 구성</span>
                </div>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon calendar-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3>통합 캘린더</h3>
              <p>모든 일정을 하나로 통합한 스마트 캘린더</p>
              <div className="feature-details">
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>할일 마감일 자동 연동</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>회의 일정 통합 표시</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>프로젝트 마일스톤 표시</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>이벤트 타입별 색상 구분</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>월별/주별 뷰 전환</span>
                </div>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon tools-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h3>개발자 도구</h3>
              <p>개발 작업을 위한 필수 유틸리티</p>
              <div className="feature-details">
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>JSON 포맷터 (예쁜 정렬)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>JSON 비교기 (차이점 시각화)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>QR 코드 생성기 (다양한 템플릿)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>커스터마이징 옵션 (색상/크기)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-bullet">✓</span>
                  <span>PNG/JPEG 다운로드</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>지금 바로 시작하세요</h2>
          <p>SmartWork로 업무 효율성을 높이고 생산성을 극대화하세요.</p>
          <div className="cta-buttons">
            <button 
              className="btn-primary"
              onClick={() => window.location.href = '/intro'}
            >
              웹 로그인하여 시작하기
            </button>
            <button className="btn-secondary" onClick={handleDownload}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              macOS 앱 다운로드
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <h3>SmartWork</h3>
              <p>생산성 향상을 위한 통합 업무 관리 시스템</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>제품</h4>
                <a href="#features">기능</a>
                <a href="#download">다운로드</a>
                <a href="/intro">로그인</a>
              </div>
              <div className="footer-column">
                <h4>지원</h4>
                <a href="#help">도움말</a>
                <a href="#contact">문의</a>
                <a href="#docs">문서</a>
              </div>
              <div className="footer-column">
                <h4>회사</h4>
                <a href="#about">회사소개</a>
                <a href="#blog">블로그</a>
                <a href="#careers">채용</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 SmartWork. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceIntroPage;