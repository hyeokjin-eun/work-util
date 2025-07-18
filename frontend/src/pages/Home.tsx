import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import Widget from '../components/Widget'
import TaskItem from '../components/TaskItem'
import { apiCall } from '../utils/api'
import useScreenSize from '../hooks/useScreenSize'
import '../styles/Dashboard.css'

interface DashboardStats {
  todos: {
    total: number
    completed: number
    pending: number
    completionRate: number
  }
  meetings: {
    total: number
    thisWeek: number
  }
  wbs: {
    totalProjects: number
    totalTasks: number
    completedTasks: number
    inProgressProjects: number
  }
}

const Home: React.FC = () => {
  const { user, token, isLoading } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [animateStats, setAnimateStats] = useState(false)
  const { isDesktop } = useScreenSize()
  const [stats, setStats] = useState<DashboardStats>({
    todos: { total: 0, completed: 0, pending: 0, completionRate: 0 },
    meetings: { total: 0, thisWeek: 0 },
    wbs: { totalProjects: 0, totalTasks: 0, completedTasks: 0, inProgressProjects: 0 }
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    // Scroll to top when Home component loads
    window.scrollTo(0, 0)
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const animationTimer = setTimeout(() => {
      setAnimateStats(true)
    }, 500)

    return () => {
      clearInterval(timer)
      clearTimeout(animationTimer)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && token) {
      loadDashboardStats()
    }
  }, [isLoading, token])

  const loadDashboardStats = async () => {
    try {
      setStatsLoading(true)
      
      // 병렬로 모든 데이터 로드
      const [todosResponse, meetingsResponse, wbsProjectsResponse] = await Promise.all([
        apiCall('/api/todos', { method: 'GET', token }),
        apiCall('/api/meetings', { method: 'GET', token }),
        apiCall('/api/wbs/projects', { method: 'GET', token })
      ])

      // 할일 통계 계산
      let todoStats = { total: 0, completed: 0, pending: 0, completionRate: 0 }
      if (todosResponse.ok) {
        const todos = await todosResponse.json()
        todoStats.total = todos.length
        todoStats.completed = todos.filter((todo: any) => todo.completed).length
        todoStats.pending = todoStats.total - todoStats.completed
        todoStats.completionRate = todoStats.total > 0 ? Math.round((todoStats.completed / todoStats.total) * 100) : 0
      }

      // 회의록 통계 계산
      let meetingStats = { total: 0, thisWeek: 0 }
      if (meetingsResponse.ok) {
        const meetings = await meetingsResponse.json()
        meetingStats.total = meetings.length
        
        // 이번 주 회의록 계산
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        meetingStats.thisWeek = meetings.filter((meeting: any) => 
          new Date(meeting.created_at) >= oneWeekAgo
        ).length
      }

      // WBS 통계 계산
      let wbsStats = { totalProjects: 0, totalTasks: 0, completedTasks: 0, inProgressProjects: 0 }
      if (wbsProjectsResponse.ok) {
        const projects = await wbsProjectsResponse.json()
        wbsStats.totalProjects = projects.length
        wbsStats.inProgressProjects = projects.filter((project: any) => 
          project.status === 'in_progress'
        ).length

        // 각 프로젝트의 작업들 로드
        const taskPromises = projects.map((project: any) =>
          apiCall(`/api/wbs/projects/${project.id}/tasks`, { method: 'GET', token })
        )
        
        const taskResponses = await Promise.all(taskPromises)
        for (const taskResponse of taskResponses) {
          if (taskResponse.ok) {
            const tasks = await taskResponse.json()
            wbsStats.totalTasks += tasks.length
            wbsStats.completedTasks += tasks.filter((task: any) => task.status === 'completed').length
          }
        }
      }

      setStats({
        todos: todoStats,
        meetings: meetingStats,
        wbs: wbsStats
      })
    } catch (error) {
      console.error('대시보드 통계 로드 실패:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return '좋은 아침입니다'
    if (hour < 18) return '좋은 오후입니다'
    return '좋은 저녁입니다'
  }

  const homeIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  )

  if (isDesktop) {
    return (
      <Layout 
        pageTitle="홈"
        pageSubtitle={`${getGreeting()}, ${user?.username || 'User'}님!<br/>오늘도 생산적인 하루 보내세요`}
        pageIcon={homeIcon}
      >
        <div className="widget-grid">
          <Widget 
            title="총 프로젝트"
            value={statsLoading ? '...' : stats.wbs.totalProjects}
            label="활성 프로젝트"
            trend={{
              value: "+12% 이번 달",
              direction: "positive"
            }}
          />
          <Widget 
            title="완료율"
            value={statsLoading ? '...' : `${stats.todos.completionRate}%`}
            label="전체 작업"
            progress={stats.todos.completionRate}
          />
          <Widget 
            title="팀 생산성"
            value={statsLoading ? '...' : stats.todos.completed}
            label="완료된 작업"
            trend={{
              value: "+8% 지난 주 대비",
              direction: "positive"
            }}
          />
          <Widget 
            title="진행 중"
            value={statsLoading ? '...' : stats.todos.pending}
            label="대기 중인 작업"
            trend={{
              value: "-2% 지난 주 대비",
              direction: "negative"
            }}
          />
        </div>
      </Layout>
    )
  }

  return (
    <Layout 
      pageTitle="홈"
      pageSubtitle={`${getGreeting()}, ${user?.username || 'User'}님!<br/>오늘도 생산적인 하루 보내세요`}
      pageIcon={homeIcon}
    >
      <div className="dashboard-container">
        {/* Floating Background Elements */}
        <div className="floating-elements">
          <div className="floating-element floating-element-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div className="floating-element floating-element-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            </svg>
          </div>
          <div className="floating-element floating-element-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10"/>
            </svg>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <div className="welcome-time">
              {currentTime.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </div>
            <div className="welcome-date">
              {currentTime.toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
          </div>
          <div className="welcome-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className={`stats-overview ${isDesktop ? 'desktop-grid' : ''}`}>
          <div className={`modern-stat-card ${animateStats ? 'animate' : ''}`}>
            <div className="stat-icon stat-icon-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{statsLoading ? '...' : stats.todos.total}</div>
              <div className="stat-label">전체 할일</div>
            </div>
          </div>
          <div className={`modern-stat-card ${animateStats ? 'animate' : ''}`} style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon stat-icon-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{statsLoading ? '...' : stats.todos.completed}</div>
              <div className="stat-label">완료된 할일</div>
            </div>
          </div>
          <div className={`modern-stat-card ${animateStats ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon stat-icon-warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="12 6v6l4 2"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{statsLoading ? '...' : `${stats.todos.completionRate}%`}</div>
              <div className="stat-label">완료율</div>
            </div>
          </div>
          <div className={`modern-stat-card ${animateStats ? 'animate' : ''}`} style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon stat-icon-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h18v18H3z"/>
                <path d="M12 8v8m-4-4h8M7 3v18m10-18v18"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{statsLoading ? '...' : stats.wbs.totalProjects}</div>
              <div className="stat-label">WBS 프로젝트</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="section-header">
            <h3 className="section-title">전체 진행률</h3>
            <div className="pulse-indicator"></div>
          </div>
          <div className="progress-card">
            <div className="progress-info">
              <span className="progress-label">할일 완료율</span>
              <span className="progress-percentage">{statsLoading ? '...' : `${stats.todos.completionRate}%`}</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats.todos.completionRate}%` }}></div>
              </div>
            </div>
            <div className="progress-details">
              {statsLoading ? '로딩 중...' : `${stats.todos.completed}/${stats.todos.total} 완료`}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3 className="section-title">빠른 실행</h3>
          <div className="quick-actions-grid">
            <Link to="/todo" className="action-card action-card-primary">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className="action-content">
                <div className="action-title">새 할일 추가</div>
                <div className="action-subtitle">작업을 추가하세요</div>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            <Link to="/meeting-notes" className="action-card action-card-secondary">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
              </div>
              <div className="action-content">
                <div className="action-title">회의록 작성</div>
                <div className="action-subtitle">회의 내용을 기록하세요</div>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            <Link to="/json-formatter" className="action-card action-card-accent">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div className="action-content">
                <div className="action-title">JSON 포맷팅</div>
                <div className="action-subtitle">데이터를 정리하세요</div>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            <Link to="/wbs" className="action-card action-card-info">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h18v18H3z"/>
                  <path d="M12 8v8m-4-4h8M7 3v18m10-18v18"/>
                </svg>
              </div>
              <div className="action-content">
                <div className="action-title">WBS 관리</div>
                <div className="action-subtitle">프로젝트를 구조화하세요</div>
              </div>
              <div className="action-arrow">→</div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="section-header">
            <h3 className="section-title">프로젝트 현황</h3>
            <div className="activity-indicator">
              <div className="activity-dot"></div>
              <span>실시간</span>
            </div>
          </div>
          <div className="activity-card">
            <div className="activity-summary">
              <div className="activity-stats">
                <div className="activity-stat">
                  <div className="activity-stat-value">{statsLoading ? '...' : stats.meetings.total}</div>
                  <div className="activity-stat-label">전체 회의록</div>
                </div>
                <div className="activity-stat">
                  <div className="activity-stat-value">{statsLoading ? '...' : stats.meetings.thisWeek}</div>
                  <div className="activity-stat-label">이번주 회의</div>
                </div>
                <div className="activity-stat">
                  <div className="activity-stat-value">{statsLoading ? '...' : stats.wbs.totalTasks}</div>
                  <div className="activity-stat-label">총 작업</div>
                </div>
                <div className="activity-stat">
                  <div className="activity-stat-value">{statsLoading ? '...' : stats.wbs.inProgressProjects}</div>
                  <div className="activity-stat-label">진행중 프로젝트</div>
                </div>
              </div>
              <div className="activity-chart">
                <div className="chart-bar" style={{ height: `${Math.max(20, (stats.todos.total / 10) * 100)}%` }}></div>
                <div className="chart-bar" style={{ height: `${Math.max(20, (stats.todos.completed / 10) * 100)}%` }}></div>
                <div className="chart-bar" style={{ height: `${Math.max(20, (stats.meetings.total / 5) * 100)}%` }}></div>
                <div className="chart-bar" style={{ height: `${Math.max(20, (stats.wbs.totalProjects / 5) * 100)}%` }}></div>
                <div className="chart-bar" style={{ height: `${Math.max(20, (stats.wbs.totalTasks / 20) * 100)}%` }}></div>
              </div>
            </div>
            {stats.todos.total === 0 && stats.meetings.total === 0 && stats.wbs.totalProjects === 0 ? (
              <div className="activity-message">
                <div className="no-activity-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20V10"/>
                    <path d="M18 20V4"/>
                    <path d="M6 20v-4"/>
                  </svg>
                </div>
                <div className="no-activity-text">
                  <div className="no-activity-title">시작할 준비가 되었습니다!</div>
                  <div className="no-activity-subtitle">첫 번째 작업을 추가해보세요</div>
                </div>
              </div>
            ) : (
              <div className="activity-message">
                <div className="no-activity-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <div className="no-activity-text">
                  <div className="no-activity-title">좋은 진행상황입니다!</div>
                  <div className="no-activity-subtitle">계속해서 생산적인 작업을 이어가세요</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home