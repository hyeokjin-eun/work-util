import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import { apiCall } from '../utils/api'
import '../styles/WBSList.css'

interface WBSProject {
  id: number
  title: string
  description: string
  start_date: string
  end_date: string
  status: string
  progress: number
  user_id: number
  created_at: string
  updated_at: string
}

const WBSList: React.FC = () => {
  const { token, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [projects, setProjects] = useState<WBSProject[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const wbsListIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M3 3h18v18H3z"/>
      <path d="M12 8v8m-4-4h8M7 3v18m10-18v18"/>
    </svg>
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    
    if (location.state?.message) {
      setMessage(location.state.message)
      // 상태 초기화
      navigate(location.pathname, { replace: true })
    }
    
    if (!isLoading && token) {
      loadWBSProjects()
    }
  }, [isLoading, token, location.state])

  const loadWBSProjects = async () => {
    try {
      setLoading(true)
      
      const response = await apiCall('/api/wbs/projects', {
        method: 'GET',
        token
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('WBS 프로젝트 목록 로드 실패:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'planning': '계획',
      'in_progress': '진행중',
      'completed': '완료',
      'on_hold': '보류'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'planning': '#6b7280',
      'in_progress': '#3b82f6',
      'completed': '#10b981',
      'on_hold': '#f59e0b'
    }
    return colorMap[status] || '#6b7280'
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const formatProgress = (progress: number) => {
    return Math.round(progress * 100) / 100
  }

  const handleProjectClick = (projectId: number) => {
    navigate(`/wbs/detail/${projectId}`)
  }

  const handleAddProject = () => {
    navigate('/wbs/add')
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>WBS 프로젝트 목록을 불러오는 중...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      pageTitle="WBS 관리"
      pageSubtitle="프로젝트 작업 구조를<br/>체계적으로 관리하세요"
      pageIcon={wbsListIcon}
    >
      <div className="wbs-list-container">
        {/* 성공 메시지 */}
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {/* 새 프로젝트 추가 버튼 */}
        <div className="wbs-list-actions">
          <button 
            className="add-project-button"
            onClick={handleAddProject}
          >
            <span className="add-icon">+</span>
            새 WBS 프로젝트
          </button>
        </div>

        {/* 프로젝트 목록 */}
        <div className="wbs-projects-grid">
          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>등록된 WBS 프로젝트가 없습니다</h3>
              <p>첫 번째 프로젝트를 만들어 작업 구조를 관리해보세요</p>
              <button 
                className="empty-add-button"
                onClick={handleAddProject}
              >
                WBS 프로젝트 추가하기
              </button>
            </div>
          ) : (
            projects.map((project) => (
              <div 
                key={project.id} 
                className="wbs-project-card"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <span 
                    className="project-status"
                    style={{ 
                      background: getStatusColor(project.status),
                      color: 'white'
                    }}
                  >
                    {getStatusText(project.status)}
                  </span>
                </div>
                
                <div className="project-description">
                  {project.description || '프로젝트 설명이 없습니다.'}
                </div>
                
                <div className="project-progress">
                  <div className="progress-label">
                    <span>진행률</span>
                    <span className="progress-value">{formatProgress(project.progress)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${formatProgress(project.progress)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="project-dates">
                  <div className="date-item">
                    <span className="date-label">시작일</span>
                    <span className="date-value">{formatDate(project.start_date)}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">종료일</span>
                    <span className="date-value">{formatDate(project.end_date)}</span>
                  </div>
                </div>
                
                <div className="project-meta">
                  <span className="project-updated">
                    {new Date(project.updated_at).toLocaleDateString('ko-KR')} 수정
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default WBSList