import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import Widget from '../components/Widget'
import TaskItem from '../components/TaskItem'
import { apiCall } from '../utils/api'
import useScreenSize from '../hooks/useScreenSize'
import { useQuickActions } from '../hooks/useQuickActions'
import { useHomeScreenLayout, HomeScreenSection } from '../hooks/useHomeScreenLayout'
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
  const { layout, loading: layoutLoading } = useHomeScreenLayout()
  const [stats, setStats] = useState<DashboardStats>({
    todos: { total: 0, completed: 0, pending: 0, completionRate: 0 },
    meetings: { total: 0, thisWeek: 0 },
    wbs: { totalProjects: 0, totalTasks: 0, completedTasks: 0, inProgressProjects: 0 }
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const { quickActions, loading: quickActionsLoading, getEnabledActions, saveQuickActions } = useQuickActions()

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
    if (!isLoading && token && !layoutLoading) {
      loadDashboardStats()
    }
  }, [isLoading, token, layoutLoading, layout])

  const loadDashboardStats = async () => {
    try {
      setStatsLoading(true)
      
      // 레이아웃이 없으면 기본 데이터만 로드
      if (!layout || !layout.sections) {
        setStats({
          todos: { total: 0, completed: 0, pending: 0, completionRate: 0 },
          meetings: { total: 0, thisWeek: 0 },
          wbs: { totalProjects: 0, totalTasks: 0, completedTasks: 0, inProgressProjects: 0 }
        })
        return
      }
      
      // 활성화된 섹션 확인
      const enabledSections = layout.sections.filter(section => section.enabled)
      const needsTodos = enabledSections.some(section => 
        section.type === 'stats' || section.type === 'progress' || section.type === 'activity'
      )
      const needsMeetings = enabledSections.some(section => 
        section.type === 'stats' || section.type === 'activity'
      )
      const needsWbs = enabledSections.some(section => 
        section.type === 'stats' || section.type === 'activity'
      )
      
      // 필요한 데이터만 로드
      const apiCalls = []
      if (needsTodos) {
        apiCalls.push(apiCall('/api/todos', { method: 'GET', token }))
      } else {
        apiCalls.push(Promise.resolve({ ok: false }))
      }
      
      if (needsMeetings) {
        apiCalls.push(apiCall('/api/meetings', { method: 'GET', token }))
      } else {
        apiCalls.push(Promise.resolve({ ok: false }))
      }
      
      if (needsWbs) {
        apiCalls.push(apiCall('/api/wbs/projects', { method: 'GET', token }))
      } else {
        apiCalls.push(Promise.resolve({ ok: false }))
      }
      
      const [todosResponse, meetingsResponse, wbsProjectsResponse] = await Promise.all(apiCalls)

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

  const getActionColorClass = (color: string) => {
    const colorMap = {
      primary: 'action-card-primary',
      secondary: 'action-card-secondary',
      accent: 'action-card-accent',
      info: 'action-card-info',
      warning: 'action-card-warning',
      success: 'action-card-success'
    }
    return colorMap[color as keyof typeof colorMap] || 'action-card-primary'
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
        {layoutLoading ? (
          <div className="loading-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="loading-spinner" style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #3b82f6', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite', 
              margin: '0 auto 20px' 
            }}></div>
            <p style={{ color: '#666', fontSize: '16px' }}>사용자 설정을 불러오는 중...</p>
          </div>
        ) : (
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
        )}
      </Layout>
    )
  }

  return (
    <Layout 
      pageTitle="홈"
      pageSubtitle={`${getGreeting()}, ${user?.username || 'User'}님!<br/>오늘도 생산적인 하루 보내세요`}
      pageIcon={homeIcon}
    >
      <div 
        className="dashboard-container"
        style={{
          backgroundColor: '#f8fafc',
          '--accent-color': '#3b82f6',
          '--text-color': '#1f2937',
          '--card-background': '#ffffff',
          '--border-color': '#e5e7eb',
          transition: 'all 0.3s ease'
        } as React.CSSProperties}
      >
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

        {/* Render sections dynamically based on user preferences */}
        {layoutLoading ? (
          <div className="loading-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="loading-spinner" style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #3b82f6', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite', 
              margin: '0 auto 20px' 
            }}></div>
            <p style={{ color: '#666', fontSize: '16px' }}>사용자 설정을 불러오는 중...</p>
          </div>
        ) : layout.sections
          .filter(section => section.enabled)
          .sort((a, b) => a.order - b.order)
          .map((section) => {
            switch (section.type) {
              case 'welcome':
                return (
                  <div key={section.id} className="welcome-banner">
                    <div className="welcome-content">
                      {section.settings.showTime && (
                        <div className="welcome-time">
                          {currentTime.toLocaleTimeString('ko-KR', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </div>
                      )}
                      {section.settings.showDate && (
                        <div className="welcome-date">
                          {currentTime.toLocaleDateString('ko-KR', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            weekday: 'long'
                          })}
                        </div>
                      )}
                    </div>
                    <div className="welcome-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  </div>
                )

              case 'stats':
                return (
                  <div key={section.id} className={`stats-overview ${isDesktop ? 'desktop-grid' : ''} ${section.settings.layout === 'list' ? 'list-layout' : ''} ${''}`}>
                    {section.settings.showTodos && (
                      <div className={`modern-stat-card ${animateStats && true ? 'animate' : ''}`}>
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
                    )}
                    <div className={`modern-stat-card ${animateStats && true ? 'animate' : ''}`} style={{ animationDelay: true ? '0.1s' : '0s' }}>
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
                    {section.settings.showCompletion && (
                      <div className={`modern-stat-card ${animateStats && true ? 'animate' : ''}`} style={{ animationDelay: true ? '0.2s' : '0s' }}>
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
                    )}
                    {section.settings.showProjects && (
                      <div className={`modern-stat-card ${animateStats && true ? 'animate' : ''}`} style={{ animationDelay: true ? '0.3s' : '0s' }}>
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
                    )}
                  </div>
                )

              case 'progress':
                return (
                  <div key={section.id} className="progress-section">
                    <div className="section-header">
                      <h3 className="section-title">전체 진행률</h3>
                      <div className="pulse-indicator"></div>
                    </div>
                    <div className="progress-card">
                      <div className="progress-info">
                        <span className="progress-label">할일 완료율</span>
                        {section.settings.showPercentage && (
                          <span className="progress-percentage">{statsLoading ? '...' : `${stats.todos.completionRate}%`}</span>
                        )}
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${stats.todos.completionRate}%`, backgroundColor: '#3b82f6' }}></div>
                        </div>
                      </div>
                      {section.settings.showDetails && (
                        <div className="progress-details">
                          {statsLoading ? '로딩 중...' : `${stats.todos.completed}/${stats.todos.total} 완료`}
                        </div>
                      )}
                    </div>
                  </div>
                )

              case 'quickActions':
                return (
                  <div key={section.id} className="quick-actions-section">
                    <div className="quick-actions-header">
                      <h3 className="section-title">빠른 실행</h3>
                    </div>
                    
                    <div className={`quick-actions-grid ${section.settings.layout === 'list' ? 'list-layout' : ''} ${''}`}>
                      {quickActionsLoading ? (
                        // Loading placeholders
                        Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="action-card loading">
                            <div className="action-icon loading-placeholder"></div>
                            <div className="action-content">
                              <div className="action-title loading-placeholder"></div>
                              <div className="action-subtitle loading-placeholder"></div>
                            </div>
                            <div className="action-arrow loading-placeholder"></div>
                          </div>
                        ))
                      ) : (
                        getEnabledActions().slice(0, section.settings.maxItems || 8).map((action) => (
                          <Link 
                            key={action.id} 
                            to={action.path} 
                            className={`action-card ${getActionColorClass(action.color)}`}
                            style={{
                              transition: true ? 'all 0.2s ease' : 'none'
                            }}
                          >
                            {section.settings.showIcons && (
                              <div className="action-icon">
                                {action.icon}
                              </div>
                            )}
                            <div className="action-content">
                              <div className="action-title">{action.title}</div>
                              {section.settings.showDescriptions && (
                                <div className="action-subtitle">{action.subtitle}</div>
                              )}
                            </div>
                            <div className="action-arrow">→</div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )

              case 'activity':
                return (
                  <div key={section.id} className="activity-section">
                    <div className="section-header">
                      <h3 className="section-title">프로젝트 현황</h3>
                      <div className="activity-indicator">
                        <div className="activity-dot"></div>
                        <span>실시간</span>
                      </div>
                    </div>
                    <div className="activity-card">
                      <div className="activity-summary">
                        {section.settings.showStats && (
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
                        )}
                        {section.settings.showChart && (
                          <div className="activity-chart">
                            <div className="chart-bar" style={{ height: `${Math.max(20, (stats.todos.total / 10) * 100)}%`, backgroundColor: '#3b82f6' }}></div>
                            <div className="chart-bar" style={{ height: `${Math.max(20, (stats.todos.completed / 10) * 100)}%`, backgroundColor: '#3b82f6' }}></div>
                            <div className="chart-bar" style={{ height: `${Math.max(20, (stats.meetings.total / 5) * 100)}%`, backgroundColor: '#3b82f6' }}></div>
                            <div className="chart-bar" style={{ height: `${Math.max(20, (stats.wbs.totalProjects / 5) * 100)}%`, backgroundColor: '#3b82f6' }}></div>
                            <div className="chart-bar" style={{ height: `${Math.max(20, (stats.wbs.totalTasks / 20) * 100)}%`, backgroundColor: '#3b82f6' }}></div>
                          </div>
                        )}
                      </div>
                      {section.settings.showRecentActivity && (
                        stats.todos.total === 0 && stats.meetings.total === 0 && stats.wbs.totalProjects === 0 ? (
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
                        )
                      )}
                    </div>
                  </div>
                )

              default:
                return null
            }
          })}
      </div>
      
    </Layout>
  )
}

export default Home