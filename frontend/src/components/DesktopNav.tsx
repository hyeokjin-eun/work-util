import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DesktopNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPath: string;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ searchQuery, onSearchChange, currentPath }) => {
  const navigate = useNavigate();

  const navSections = [
    {
      title: '워크스페이스',
      items: [
        {
          path: '/home',
          icon: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
          label: '홈'
        },
        {
          path: '/calendar',
          icon: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
          label: '캘린더'
        },
        {
          path: '/mypage',
          icon: <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
          label: '마이페이지'
        }
      ]
    },
    {
      title: '프로젝트',
      items: [
        {
          path: '/todo',
          icon: <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/></svg>,
          label: '할일 관리',
          badge: '12',
          badgeColor: 'blue'
        },
        {
          path: '/meeting-notes',
          icon: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,
          label: '회의록',
          badge: '5',
          badgeColor: 'green'
        },
        {
          path: '/wbs',
          icon: <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg>,
          label: 'WBS 관리'
        }
      ]
    },
    {
      title: '도구',
      items: [
        {
          path: '/functions',
          icon: <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
          label: '주요 기능'
        },
        {
          path: '/utilities',
          icon: <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
          label: '유틸리티'
        },
        {
          path: '/json-formatter',
          icon: <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
          label: 'JSON 포맷터'
        },
        {
          path: '/json-compare',
          icon: <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
          label: 'JSON 비교기'
        },
        {
          path: '/qr-generator',
          icon: <svg viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/><path d="M9 9h6v6H9z"/></svg>,
          label: 'QR 생성기'
        }
      ]
    }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/home' && (currentPath === '/' || currentPath === '/home')) {
      return true;
    }
    return currentPath === path;
  };

  const getBadgeClass = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'nav-badge blue';
      case 'green':
        return 'nav-badge green';
      default:
        return 'nav-badge';
    }
  };

  return (
    <nav className="main-sidebar">
      <div className="sidebar-header">
        <div className="app-logo">
          <div className="logo-icon">SW</div>
          <div className="app-title">SmartWork</div>
        </div>
        <input 
          type="text" 
          className="search-bar" 
          placeholder="검색... (⌘K)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="sidebar-nav">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="nav-section">
            <div className="nav-section-title">{section.title}</div>
            {section.items.map((item, itemIndex) => (
              <a 
                key={itemIndex}
                href="#" 
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.path);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={getBadgeClass(item.badgeColor)}>
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default DesktopNav;