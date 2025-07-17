import React, { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import { apiCall } from '../utils/api'

interface UserStats {
  todos: {
    total: number
    completed: number
    pending: number
    completionRate: number
  }
  meetings: {
    total: number
    thisMonth: number
    recent: number
  }
  wbs: {
    totalProjects: number
    totalTasks: number
    completedTasks: number
    inProgressProjects: number
  }
  joinedDate: string
  productivityScore: number
}

const MyPage: React.FC = () => {
  const { user, logout, token } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    todos: { total: 0, completed: 0, pending: 0, completionRate: 0 },
    meetings: { total: 0, thisMonth: 0, recent: 0 },
    wbs: { totalProjects: 0, totalTasks: 0, completedTasks: 0, inProgressProjects: 0 },
    joinedDate: '',
    productivityScore: 0
  })
  const [loading, setLoading] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    // Scroll to top when MyPage component loads
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (token) {
      loadUserStats()
    }
  }, [token])

  const loadUserStats = async () => {
    try {
      setLoading(true)
      
      // 병렬로 모든 데이터 로드
      const [todosResponse, meetingsResponse, wbsProjectsResponse, userResponse] = await Promise.all([
        apiCall('/api/todos', { method: 'GET', token }),
        apiCall('/api/meetings', { method: 'GET', token }),
        apiCall('/api/wbs/projects', { method: 'GET', token }),
        apiCall('/api/auth/me', { method: 'GET', token })
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
      let meetingStats = { total: 0, thisMonth: 0, recent: 0 }
      if (meetingsResponse.ok) {
        const meetings = await meetingsResponse.json()
        meetingStats.total = meetings.length
        
        // 이번 달 회의록 계산
        const thisMonth = new Date()
        thisMonth.setDate(1)
        meetingStats.thisMonth = meetings.filter((meeting: any) => 
          new Date(meeting.created_at) >= thisMonth
        ).length
        
        // 최근 7일 회의록 계산
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        meetingStats.recent = meetings.filter((meeting: any) => 
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

      // 사용자 가입일 및 생산성 점수 계산
      let joinedDate = ''
      if (userResponse.ok) {
        const userData = await userResponse.json()
        joinedDate = new Date(userData.created_at).toLocaleDateString('ko-KR')
      }

      // 생산성 점수 계산 (할일 완료율 + 활동 점수)
      const activityScore = Math.min(100, (todoStats.total + meetingStats.total + wbsStats.totalProjects) * 2)
      const productivityScore = Math.round((todoStats.completionRate + activityScore) / 2)

      setStats({
        todos: todoStats,
        meetings: meetingStats,
        wbs: wbsStats,
        joinedDate,
        productivityScore
      })
    } catch (error) {
      console.error('사용자 통계 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('비밀번호는 최소 6자리 이상이어야 합니다.')
      return
    }

    try {
      const response = await apiCall('/api/auth/change-password', {
        method: 'PUT',
        token,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      if (response.ok) {
        setPasswordSuccess('비밀번호가 성공적으로 변경되었습니다.')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => {
          setShowPasswordModal(false)
          setPasswordSuccess('')
        }, 2000)
      } else {
        const errorData = await response.json()
        setPasswordError(errorData.detail || '비밀번호 변경에 실패했습니다.')
      }
    } catch (error) {
      setPasswordError('비밀번호 변경 중 오류가 발생했습니다.')
    }
  }

  const userIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )

  return (
    <Layout 
      pageTitle="마이페이지"
      pageSubtitle={`안녕하세요, ${user?.username}님!<br/>프로필과 설정을 관리하세요`}
      pageIcon={userIcon}
    >
      {/* User Profile */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'var(--primary-blue)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 15px',
          color: 'white',
          fontSize: '32px',
          fontWeight: '600'
        }}>
          {user?.username ? user.username[0].toUpperCase() : 'U'}
        </div>
        <div style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
          {user?.username || 'User'}
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {user?.email || 'user@example.com'}
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          가입일: {loading ? '...' : stats.joinedDate}
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{loading ? '...' : stats.todos.completed}</div>
          <div className="stat-label">완료한 할일</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{loading ? '...' : stats.todos.pending}</div>
          <div className="stat-label">진행중인 할일</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{loading ? '...' : stats.wbs.totalProjects}</div>
          <div className="stat-label">WBS 프로젝트</div>
        </div>
      </div>

      <div className="stat-card" style={{ marginBottom: '20px' }}>
        <div className="stat-value">{loading ? '...' : `${stats.productivityScore}%`}</div>
        <div className="stat-label">생산성 점수</div>
      </div>

      {/* Activity Summary */}
      <div className="section-title">활동 요약</div>
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <div style={{ fontSize: '14px', color: '#333' }}>전체 할일</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--success)' }}>{loading ? '...' : `${stats.todos.total}개`}</div>
          </div>
          <div className="flex-between">
            <div style={{ fontSize: '14px', color: '#333' }}>작성한 회의록</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--warning)' }}>{loading ? '...' : `${stats.meetings.total}개`}</div>
          </div>
          <div className="flex-between">
            <div style={{ fontSize: '14px', color: '#333' }}>이번 달 회의록</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary-blue)' }}>{loading ? '...' : `${stats.meetings.thisMonth}개`}</div>
          </div>
          <div className="flex-between">
            <div style={{ fontSize: '14px', color: '#333' }}>WBS 작업</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary-blue)' }}>{loading ? '...' : `${stats.wbs.totalTasks}개`}</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="section-title">설정</div>
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div 
            className="flex-between" 
            style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
            onClick={() => setShowPasswordModal(true)}
          >
            <div style={{ fontSize: '14px', color: '#333' }}>비밀번호 변경</div>
            <div style={{ fontSize: '12px', color: '#666' }}>&gt;</div>
          </div>
          <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>알림 설정</div>
            <div style={{ fontSize: '12px', color: '#666' }}>&gt;</div>
          </div>
          <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>테마 설정</div>
            <div style={{ fontSize: '12px', color: '#666' }}>&gt;</div>
          </div>
          <div className="flex-between" style={{ padding: '10px 0' }}>
            <div style={{ fontSize: '14px', color: '#333' }}>도움말</div>
            <div style={{ fontSize: '12px', color: '#666' }}>&gt;</div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={logout}
        style={{
          width: '100%',
          padding: '16px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        로그아웃
      </button>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>비밀번호 변경</h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  setPasswordError('')
                  setPasswordSuccess('')
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>현재 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>새 비밀번호</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>새 비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              
              {passwordError && (
                <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
                  {passwordError}
                </div>
              )}
              
              {passwordSuccess && (
                <div style={{ color: '#10b981', fontSize: '14px', marginBottom: '16px' }}>
                  {passwordSuccess}
                </div>
              )}
              
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--primary-blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                변경하기
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default MyPage