import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import { apiCall } from '../utils/api'
import '../styles/WbsManager.css'

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

const WbsManager: React.FC = () => {
  const { token, isLoading } = useAuth()
  const navigate = useNavigate()
  
  const [projects, setProjects] = useState<WBSProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    if (!isLoading && token) {
      loadWBSProjects()
    }
  }, [isLoading, token])

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

  const wbsIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M3 3h18v18H3z"/>
      <path d="M12 8v8m-4-4h8M7 3v18m10-18v18"/>
    </svg>
  )

  const handleCreateProject = () => {
    navigate('/wbs/add')
  }

  const handleViewAllProjects = () => {
    navigate('/wbs')
  }

  const handleProjectClick = (projectId: number) => {
    navigate(`/wbs/${projectId}`)
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

  const totalProjects = projects.length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const inProgressProjects = projects.filter(p => p.status === 'in_progress').length
  const averageProgress = totalProjects > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects) : 0

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>WBS 프로젝트 정보를 불러오는 중...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout 
      pageTitle="WBS 관리"
      pageSubtitle="프로젝트를 체계적으로 구조화하고<br/>진행상황을 추적하세요"
      pageIcon={wbsIcon}
    >
      <div className="wbs-container">
        {/* Controls Section */}
        <div className="controls-section">
          <div className="controls-grid">
            <button className="control-btn" onClick={handleCreateProject}>
              📊 새 프로젝트 생성
            </button>
            <button className="control-btn secondary" onClick={handleViewAllProjects}>
              📋 전체 프로젝트 보기
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="stats-section">
          <div className="section-title">프로젝트 통계</div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{totalProjects}</div>
              <div className="stat-label">총 프로젝트</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{completedProjects}</div>
              <div className="stat-label">완료됨</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{inProgressProjects}</div>
              <div className="stat-label">진행중</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{averageProgress}%</div>
              <div className="stat-label">평균 진행률</div>
            </div>
          </div>
        </div>

        {/* Recent Projects Section */}
        <div className="projects-section">
          <div className="section-title">최근 프로젝트</div>
          
          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>등록된 WBS 프로젝트가 없습니다</h3>
              <p>첫 번째 프로젝트를 생성하여 작업 구조를 관리해보세요</p>
              <button 
                className="empty-add-button"
                onClick={handleCreateProject}
              >
                WBS 프로젝트 생성하기
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.slice(0, 6).map((project) => (
                <div 
                  key={project.id} 
                  className="project-card"
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
                      <span className="progress-value">{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${project.progress}%` }}
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
                </div>
              ))}
            </div>
          )}
          
          {projects.length > 6 && (
            <div className="view-all-container">
              <button 
                className="view-all-button"
                onClick={handleViewAllProjects}
              >
                전체 프로젝트 보기 ({projects.length}개)
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default WbsManager