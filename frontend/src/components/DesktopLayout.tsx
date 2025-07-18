import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import useScreenSize from '../hooks/useScreenSize';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePanel, setActivePanel] = useState('overview');
  const [panelWidths, setPanelWidths] = useState([50, 50]);
  const { isDesktop } = useScreenSize();
  const location = useLocation();

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            const searchBar = document.querySelector('.search-bar') as HTMLInputElement;
            if (searchBar) searchBar.focus();
            break;
          case 'n':
            e.preventDefault();
            console.log('새 프로젝트 생성');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 컨텍스트 메뉴 처리
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const menu = document.getElementById('contextMenu');
      if (menu) {
        menu.style.display = 'block';
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
      }
    };

    const handleClick = () => {
      const menu = document.getElementById('contextMenu');
      if (menu) {
        menu.style.display = 'none';
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // 페이지 제목 매핑
  const getPageTitle = (pathname: string) => {
    const pathMap: { [key: string]: string } = {
      '/': '대시보드',
      '/dashboard': '대시보드',
      '/home': '홈',
      '/todo': '할일 관리',
      '/todolist': '할일 관리',
      '/calendar': '캘린더',
      '/meeting-notes': '회의록',
      '/utilities': '유틸리티',
      '/json-formatter': 'JSON 포맷터',
      '/json-compare': 'JSON 비교기',
      '/qr-generator': 'QR 생성기',
      '/wbs-manager': 'WBS 관리',
      '/wbs': 'WBS 관리',
      '/mypage': '마이페이지'
    };
    return pathMap[pathname] || '대시보드';
  };

  // 브레드크럼 생성
  const getBreadcrumb = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return '홈 > 대시보드';
    
    const pathMap: { [key: string]: string } = {
      'dashboard': '대시보드',
      'home': '홈',
      'todo': '할일 관리',
      'todolist': '할일 관리',
      'calendar': '캘린더',
      'meeting-notes': '회의록',
      'utilities': '유틸리티',
      'json-formatter': 'JSON 포맷터',
      'json-compare': 'JSON 비교기',
      'qr-generator': 'QR 생성기',
      'wbs-manager': 'WBS 관리',
      'wbs': 'WBS 관리',
      'mypage': '마이페이지'
    };
    
    const breadcrumbs = ['홈'];
    segments.forEach(segment => {
      if (pathMap[segment]) {
        breadcrumbs.push(pathMap[segment]);
      }
    });
    
    return breadcrumbs.join(' > ');
  };

  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <DesktopNav 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentPath={location.pathname}
      />
      
      <main className="main-content">
        <div className="content-body">
          <div className="main-content-area">
            {children}
          </div>
        </div>
      </main>
      
      <header className="desktop-header">
        <div className="header-content">
          <div className="content-title">
            <h1>{getPageTitle(location.pathname)}</h1>
            <div className="breadcrumb">{getBreadcrumb(location.pathname)}</div>
          </div>
          <div className="content-actions">
            <div className="view-toggle">
              <button className="active">카드</button>
              <button>리스트</button>
              <button>표</button>
            </div>
            <button className="action-btn">
              <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              내보내기
            </button>
            <button className="action-btn primary">
              <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                <path d="M12 5v14m-7-7h14"/>
              </svg>
              새 프로젝트
              <span className="kbd">⌘N</span>
            </button>
          </div>
        </div>
      </header>

      {/* 컨텍스트 메뉴 */}
      <div className="context-menu" id="contextMenu">
        <div className="context-menu-item">편집</div>
        <div className="context-menu-item">복사</div>
        <div className="context-menu-item">붙여넣기</div>
        <div className="context-menu-divider"></div>
        <div className="context-menu-item">삭제</div>
      </div>
    </div>
  );
};

export default DesktopLayout;