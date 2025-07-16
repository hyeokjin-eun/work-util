import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import '../styles/WbsManager.css'

interface WBSItem {
  id: string
  code: string
  title: string
  level: number
  status: 'not-started' | 'in-progress' | 'completed'
  assignee: string
  startDate: string
  endDate: string
  progress: number
}

const WbsManager: React.FC = () => {
  useEffect(() => {
    // Scroll to top when WbsManager component loads
    window.scrollTo(0, 0)
  }, [])

  const [wbsItems] = useState<WBSItem[]>([
    {
      id: '1',
      code: '1.0',
      title: '프로젝트 계획',
      level: 1,
      status: 'in-progress',
      assignee: 'PM팀',
      startDate: '2025.07.01',
      endDate: '2025.07.15',
      progress: 80
    },
    {
      id: '2',
      code: '1.1',
      title: '요구사항 분석',
      level: 2,
      status: 'completed',
      assignee: '분석팀',
      startDate: '2025.07.01',
      endDate: '2025.07.05',
      progress: 100
    },
    {
      id: '3',
      code: '1.2',
      title: '시스템 설계',
      level: 2,
      status: 'in-progress',
      assignee: '설계팀',
      startDate: '2025.07.06',
      endDate: '2025.07.15',
      progress: 60
    },
    {
      id: '4',
      code: '2.0',
      title: '개발 단계',
      level: 1,
      status: 'in-progress',
      assignee: '개발팀',
      startDate: '2025.07.16',
      endDate: '2025.11.30',
      progress: 20
    },
    {
      id: '5',
      code: '2.1',
      title: '프론트엔드 개발',
      level: 2,
      status: 'not-started',
      assignee: 'FE팀',
      startDate: '2025.07.16',
      endDate: '2025.10.15',
      progress: 0
    },
    {
      id: '6',
      code: '2.1.1',
      title: 'UI/UX 구현',
      level: 3,
      status: 'not-started',
      assignee: 'UI팀',
      startDate: '2025.07.16',
      endDate: '2025.09.15',
      progress: 0
    },
    {
      id: '7',
      code: '2.2',
      title: '백엔드 개발',
      level: 2,
      status: 'not-started',
      assignee: 'BE팀',
      startDate: '2025.07.16',
      endDate: '2025.10.31',
      progress: 0
    }
  ])

  const wbsIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
    </svg>
  )

  const handleAddWBSItem = () => {
    alert('WBS 항목 추가 기능이 실행됩니다.')
  }

  const handleEditProject = () => {
    alert('프로젝트 편집 기능이 실행됩니다.')
  }

  const handleExportWBS = () => {
    alert('WBS 내보내기 기능이 실행됩니다.')
  }

  const handleImportWBS = () => {
    alert('WBS 가져오기 기능이 실행됩니다.')
  }

  const handleWBSItemClick = (item: WBSItem) => {
    alert(`${item.code}: ${item.title} 상세 정보를 확인합니다.`)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not-started': return '시작 전'
      case 'in-progress': return '진행중'
      case 'completed': return '완료'
      default: return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'not-started': return 'not-started'
      case 'in-progress': return 'in-progress'
      case 'completed': return 'completed'
      default: return 'not-started'
    }
  }

  const totalTasks = wbsItems.length
  const completedTasks = wbsItems.filter(item => item.status === 'completed').length
  const inProgressTasks = wbsItems.filter(item => item.status === 'in-progress').length
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <Layout 
      pageTitle="WBS 관리"
      pageSubtitle="프로젝트를 체계적으로 구조화하고<br/>진행상황을 추적하세요"
      pageIcon={wbsIcon}
    >
      <div className="wbs-container">
        {/* Project Header */}
        <div className="project-header">
          <div className="project-title">
            SmartWork 개발 프로젝트
            <div className="project-status in-progress">진행중</div>
          </div>
          
          <div className="project-meta">
            <div className="meta-item">
              <div className="meta-label">시작일</div>
              <div className="meta-value">2025.07.01</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">완료 예정일</div>
              <div className="meta-value">2025.12.31</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">담당자</div>
              <div className="meta-value">개발팀</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">우선순위</div>
              <div className="meta-value">높음</div>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
          </div>
          <div className="progress-text">전체 진행률: {overallProgress}% ({completedTasks}/{totalTasks} 완료)</div>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="controls-grid">
            <button className="control-btn" onClick={handleAddWBSItem}>
              ➕ 항목 추가
            </button>
            <button className="control-btn secondary" onClick={handleEditProject}>
              ✏️ 프로젝트 편집
            </button>
            <button className="control-btn success" onClick={handleExportWBS}>
              📤 내보내기
            </button>
            <button className="control-btn secondary" onClick={handleImportWBS}>
              📥 가져오기
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="stats-section">
          <div className="section-title">프로젝트 통계</div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{totalTasks}</div>
              <div className="stat-label">총 작업</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{completedTasks}</div>
              <div className="stat-label">완료됨</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{inProgressTasks}</div>
              <div className="stat-label">진행중</div>
            </div>
          </div>
        </div>

        {/* WBS Structure Section */}
        <div className="wbs-section">
          <div className="section-title">WBS 구조</div>
          
          <div className="wbs-tree">
            {wbsItems.map((item) => (
              <div 
                key={item.id} 
                className={`wbs-item level-${item.level}`}
                onClick={() => handleWBSItemClick(item)}
              >
                <div className="wbs-header">
                  <div className="wbs-code">{item.code}</div>
                  <div className={`wbs-status ${getStatusClass(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </div>
                </div>
                <div className="wbs-title">{item.title}</div>
                <div className="wbs-details">
                  <div className="wbs-detail">
                    <span>👤</span>
                    <span>{item.assignee}</span>
                  </div>
                  <div className="wbs-detail">
                    <span>📅</span>
                    <span>{item.startDate}-{item.endDate}</span>
                  </div>
                  <div className="wbs-detail">
                    <span>⏱️</span>
                    <span>{item.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default WbsManager