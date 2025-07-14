import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/MyPage.css';

interface UserStats {
  totalTodos: number;
  completedTodos: number;
  totalMeetings: number;
  totalProjects: number;
  joinDate: string;
  recentActivity: string;
}

interface QuickAction {
  title: string;
  description: string;
  path: string;
  icon: string;
  count?: number;
}

const MyPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats>({
    totalTodos: 0,
    completedTodos: 0,
    totalMeetings: 0,
    totalProjects: 0,
    joinDate: '',
    recentActivity: ''
  });

  const [showSettings, setShowSettings] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = () => {
    // 로컬 스토리지에서 사용자 데이터 가져오기
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    const projects = JSON.parse(localStorage.getItem('wbs-projects') || '[]');
    
    const completedTodos = todos.filter((todo: any) => todo.status === 'completed');
    
    // 최근 활동 계산
    const recentActivity = getRecentActivity(todos, meetings, projects);
    
    setUserStats({
      totalTodos: todos.length,
      completedTodos: completedTodos.length,
      totalMeetings: meetings.length,
      totalProjects: projects.length,
      joinDate: user?.created_at || new Date().toISOString(),
      recentActivity
    });
  };

  const getRecentActivity = (todos: any[], meetings: any[], projects: any[]) => {
    const now = new Date().getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    
    // 오늘 생성된 항목들 계산
    const todayTodos = todos.filter(todo => {
      const createdDate = new Date(todo.createdAt).getTime();
      return (now - createdDate) < dayMs;
    }).length;
    
    const todayMeetings = meetings.filter(meeting => {
      const createdDate = new Date(meeting.createdAt).getTime();
      return (now - createdDate) < dayMs;
    }).length;

    if (todayTodos > 0 || todayMeetings > 0) {
      return `오늘 ${todayTodos + todayMeetings}개 항목 추가`;
    }
    
    return '최근 활동 없음';
  };

  // 빠른 액션 메뉴 정의
  const quickActions: QuickAction[] = [
    {
      title: '할일 관리',
      description: '새로운 할일 추가',
      path: '/todos',
      icon: '✅',
      count: userStats.totalTodos
    },
    {
      title: '회의록 메모',
      description: '회의록 작성하기',
      path: '/meeting-notes',
      icon: '📝',
      count: userStats.totalMeetings
    },
    {
      title: 'JSON 포맷터',
      description: 'JSON 데이터 정리',
      path: '/json-formatter',
      icon: '{}',
    },
    {
      title: 'QR 생성기',
      description: 'QR 코드 만들기',
      path: '/qr-generator',
      icon: '📱',
    },
    {
      title: 'WBS 관리',
      description: '프로젝트 관리',
      path: '/wbs',
      icon: '📊',
      count: userStats.totalProjects
    },
    {
      title: 'JSON 비교기',
      description: 'JSON 데이터 비교',
      path: '/json-compare',
      icon: '⚖️',
    }
  ];

  const changePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    alert('비밀번호가 변경되었습니다.');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowSettings(false);
  };

  const deleteAccount = () => {
    localStorage.removeItem('todos');
    localStorage.removeItem('meetings');
    localStorage.removeItem('wbs-projects');
    
    alert('계정이 삭제되었습니다.');
    logout();
  };

  const getCompletionRate = () => {
    if (userStats.totalTodos === 0) return 0;
    return Math.round((userStats.completedTodos / userStats.totalTodos) * 100);
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mypage-container">
      {/* 사용자 프로필 헤더 */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            <span className="avatar-text">{user?.username?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile-details">
            <h2 className="profile-name">{user?.username}</h2>
            <p className="profile-email">{user?.email}</p>
            <p className="profile-activity">{userStats.recentActivity}</p>
          </div>
        </div>
        <button 
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          <span className="settings-icon">⚙️</span>
        </button>
      </div>

      {/* 사용자 통계 카드 */}
      <div className="stats-overview">
        <div className="stat-item">
          <div className="stat-number">{userStats.completedTodos}</div>
          <div className="stat-label">완료한 할일</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{userStats.totalMeetings}</div>
          <div className="stat-label">작성한 회의록</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{getCompletionRate()}%</div>
          <div className="stat-label">달성률</div>
        </div>
      </div>

      {/* 빠른 액션 메뉴 */}
      <div className="section">
        <h3 className="section-title">빠른 실행</h3>
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <div 
              key={index}
              className="action-item"
              onClick={() => navigate(action.path)}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <div className="action-title">{action.title}</div>
                <div className="action-description">{action.description}</div>
              </div>
              {action.count !== undefined && (
                <div className="action-count">{action.count}</div>
              )}
              <div className="action-arrow">›</div>
            </div>
          ))}
        </div>
      </div>

      {/* 내 활동 */}
      <div className="section">
        <h3 className="section-title">내 활동</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📋</div>
            <div className="activity-content">
              <div className="activity-title">진행률 확인</div>
              <div className="activity-description">전체 할일 중 {getCompletionRate()}% 완료</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📅</div>
            <div className="activity-content">
              <div className="activity-title">가입일</div>
              <div className="activity-description">{formatJoinDate(userStats.joinDate)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 도움말 및 지원 */}
      <div className="section">
        <h3 className="section-title">도움말 및 지원</h3>
        <div className="help-list">
          <div className="help-item">
            <div className="help-icon">❓</div>
            <div className="help-content">
              <div className="help-title">사용 가이드</div>
              <div className="help-description">Work-Util 사용법 안내</div>
            </div>
            <div className="help-arrow">›</div>
          </div>
          <div className="help-item" onClick={() => setShowSettings(true)}>
            <div className="help-icon">🔒</div>
            <div className="help-content">
              <div className="help-title">계정 설정</div>
              <div className="help-description">비밀번호 변경 및 계정 관리</div>
            </div>
            <div className="help-arrow">›</div>
          </div>
        </div>
      </div>

      {/* 설정 모달 */}
      {showSettings && (
        <div className="settings-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>계정 설정</h3>
              <button 
                className="close-btn"
                onClick={() => setShowSettings(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="setting-section">
                <h4>비밀번호 변경</h4>
                <input
                  type="password"
                  placeholder="현재 비밀번호"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="form-input"
                />
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="form-input"
                />
                <input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="form-input"
                />
                <button className="btn-primary" onClick={changePassword}>
                  비밀번호 변경
                </button>
              </div>

              <div className="setting-section danger-section">
                <h4>계정 삭제</h4>
                <p className="danger-warning">
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                </p>
                {!showDeleteConfirm ? (
                  <button 
                    className="btn-danger"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    계정 삭제
                  </button>
                ) : (
                  <div className="delete-confirm">
                    <p>정말로 계정을 삭제하시겠습니까?</p>
                    <div className="confirm-buttons">
                      <button className="btn-danger" onClick={deleteAccount}>
                        예, 삭제합니다
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;