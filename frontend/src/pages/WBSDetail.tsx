import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import DatePicker from '../components/DatePicker'
import { apiCall } from '../utils/api'
import '../styles/WBSDetail.css'

interface WBSTask {
  id: number
  title: string
  description: string
  start_date: string
  end_date: string
  duration: number
  progress: number
  status: string
  priority: string
  assignee: string
  parent_id: number | null
  level: number
  order_index: number
  project_id: number
  created_at: string
  updated_at: string
}

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
  tasks: WBSTask[]
}

interface TaskFormData {
  title: string
  description: string
  start_date: string
  end_date: string
  duration: number
  progress: number
  status: string
  priority: string
  assignee: string
  parent_id: number | null
  level: number
  order_index: number
}

const WBSDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { token, isLoading } = useAuth()
  const navigate = useNavigate()
  
  const [project, setProject] = useState<WBSProject | null>(null)
  const [tasks, setTasks] = useState<WBSTask[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<WBSTask | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    duration: 1,
    progress: 0,
    status: 'not_started',
    priority: 'medium',
    assignee: '',
    parent_id: null,
    level: 1,
    order_index: 0
  })
  
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const wbsDetailIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M3 3h18v18H3z"/>
      <path d="M12 8v8m-4-4h8M7 3v18m10-18v18"/>
      <circle cx="12" cy="16" r="1"/>
    </svg>
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    
    if (!isLoading && id && !isDeleting) {
      loadWBSProject()
    }
  }, [isLoading, id, isDeleting])

  const loadWBSProject = async () => {
    try {
      if (!id) {
        navigate('/wbs')
        return
      }
      
      if (!token) {
        console.log('토큰이 없습니다. 인증 확인 중...')
        return
      }

      const response = await apiCall(`/api/wbs/projects/${id}`, {
        method: 'GET',
        token
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const projectData = await response.json()
      setProject(projectData)
      
      // 작업 목록 로드
      const tasksResponse = await apiCall(`/api/wbs/projects/${id}/tasks`, {
        method: 'GET',
        token
      })
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json()
        setTasks(tasksData)
      }
      
    } catch (error) {
      console.error('WBS 프로젝트 상세 정보 로드 실패:', error)
      navigate('/wbs')
    } finally {
      setPageLoading(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!confirm('이 WBS 프로젝트를 삭제하시겠습니까?')) return

    try {
      if (!token || !id) {
        throw new Error('인증 토큰이 없습니다.')
      }

      setIsDeleting(true)

      const response = await apiCall(`/api/wbs/projects/${id}`, {
        method: 'DELETE',
        token
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '삭제 중 오류가 발생했습니다.' }))
        throw new Error(errorData.detail || errorData.message || 'WBS 프로젝트 삭제 중 오류가 발생했습니다.')
      }

      navigate('/wbs', { 
        replace: true,
        state: { 
          message: 'WBS 프로젝트가 성공적으로 삭제되었습니다.',
        }
      })
      
    } catch (error) {
      console.error('WBS 프로젝트 삭제 중 오류 발생:', error)
      alert('WBS 프로젝트 삭제 중 오류가 발생했습니다. 다시 시도해주세요.')
      setIsDeleting(false)
    }
  }

  const handleAddTask = () => {
    navigate(`/wbs/projects/${id}/tasks/add`)
  }

  const handleEditTask = (task: WBSTask) => {
    setEditingTask(task)
    setTaskFormData({
      title: task.title,
      description: task.description,
      start_date: task.start_date ? task.start_date.split('T')[0] : '',
      end_date: task.end_date ? task.end_date.split('T')[0] : '',
      duration: task.duration || 1,
      progress: task.progress,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee || '',
      parent_id: task.parent_id,
      level: task.level,
      order_index: task.order_index
    })
    setShowTaskForm(true)
  }

  const handleSaveTask = async () => {
    if (!validateTaskForm()) return

    setIsSubmitting(true)

    try {
      if (!token || !id) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const taskData = {
        title: taskFormData.title,
        description: taskFormData.description,
        start_date: taskFormData.start_date ? new Date(taskFormData.start_date).toISOString() : null,
        end_date: taskFormData.end_date ? new Date(taskFormData.end_date).toISOString() : null,
        duration: taskFormData.duration,
        progress: taskFormData.progress,
        status: taskFormData.status,
        priority: taskFormData.priority,
        assignee: taskFormData.assignee,
        parent_id: taskFormData.parent_id,
        level: taskFormData.level,
        order_index: taskFormData.order_index
      }

      const url = editingTask 
        ? `/api/wbs/projects/${id}/tasks/${editingTask.id}`
        : `/api/wbs/projects/${id}/tasks`
      
      const method = editingTask ? 'PUT' : 'POST'

      const response = await apiCall(url, {
        method,
        token,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '작업 저장 중 오류가 발생했습니다.' }))
        throw new Error(errorData.detail || errorData.message || '작업 저장 중 오류가 발생했습니다.')
      }

      await loadWBSProject()
      setShowTaskForm(false)
      setEditingTask(null)
      
    } catch (error) {
      console.error('작업 저장 중 오류 발생:', error)
      setErrors({ submit: error instanceof Error ? error.message : '작업 저장 중 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('이 작업을 삭제하시겠습니까?')) return

    try {
      if (!token || !id) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const response = await apiCall(`/api/wbs/projects/${id}/tasks/${taskId}`, {
        method: 'DELETE',
        token
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '삭제 중 오류가 발생했습니다.' }))
        throw new Error(errorData.detail || errorData.message || '작업 삭제 중 오류가 발생했습니다.')
      }

      await loadWBSProject()
      
    } catch (error) {
      console.error('작업 삭제 중 오류 발생:', error)
      alert('작업 삭제 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const validateTaskForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (!taskFormData.title.trim()) {
      newErrors.title = '작업 제목을 입력해주세요'
    }

    if (taskFormData.title.length > 200) {
      newErrors.title = '제목은 200자를 초과할 수 없습니다'
    }

    if (taskFormData.start_date && taskFormData.end_date) {
      const startDate = new Date(taskFormData.start_date)
      const endDate = new Date(taskFormData.end_date)
      
      if (startDate > endDate) {
        newErrors.end_date = '종료일은 시작일보다 늦어야 합니다'
      }
    }

    if (taskFormData.duration < 1) {
      newErrors.duration = '소요일수는 1일 이상이어야 합니다'
    }

    if (taskFormData.progress < 0 || taskFormData.progress > 100) {
      newErrors.progress = '진행률은 0~100 사이여야 합니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'not_started': '시작전',
      'in_progress': '진행중',
      'completed': '완료',
      'blocked': '차단됨'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'not_started': '#6b7280',
      'in_progress': '#3b82f6',
      'completed': '#10b981',
      'blocked': '#ef4444'
    }
    return colorMap[status] || '#6b7280'
  }

  const getPriorityText = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      'low': '낮음',
      'medium': '보통',
      'high': '높음'
    }
    return priorityMap[priority] || priority
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const renderTaskTree = (parentId: number | null = null, level: number = 1) => {
    const childTasks = tasks.filter(task => task.parent_id === parentId)
    
    return childTasks.map(task => (
      <div key={task.id} className="task-item-container">
        <div className={`task-item level-${task.level}`}>
          <div className="task-header">
            <div className="task-title-section">
              <span className="task-level-indicator">{'  '.repeat(task.level - 1)}{task.level > 1 ? '└ ' : ''}</span>
              <h4 className="task-title">{task.title}</h4>
              <span 
                className="task-status"
                style={{ 
                  background: getStatusColor(task.status),
                  color: 'white'
                }}
              >
                {getStatusText(task.status)}
              </span>
            </div>
            <div className="task-actions">
              <button 
                className="task-edit-btn"
                onClick={() => handleEditTask(task)}
              >
                수정
              </button>
              <button 
                className="task-delete-btn"
                onClick={() => handleDeleteTask(task.id)}
              >
                삭제
              </button>
            </div>
          </div>
          
          <div className="task-details">
            <div className="task-meta">
              <span className="task-assignee">담당자: {task.assignee || '-'}</span>
              <span className="task-priority">우선순위: {getPriorityText(task.priority)}</span>
              <span className="task-duration">소요일수: {task.duration || 0}일</span>
            </div>
            
            <div className="task-progress">
              <span className="progress-label">진행률: {task.progress}%</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="task-dates">
              <span>시작: {formatDate(task.start_date)}</span>
              <span>종료: {formatDate(task.end_date)}</span>
            </div>
            
            {task.description && (
              <div className="task-description">
                {task.description}
              </div>
            )}
          </div>
        </div>
        
        {/* 자식 작업들 재귀적으로 렌더링 */}
        {renderTaskTree(task.id, task.level + 1)}
      </div>
    ))
  }

  if (pageLoading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>WBS 프로젝트 정보를 불러오는 중...</p>
        </div>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <div className="error-container">
          <p>WBS 프로젝트를 찾을 수 없습니다.</p>
          <button onClick={() => navigate('/wbs')} className="back-button">
            목록으로 돌아가기
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      pageTitle={project.title}
      pageSubtitle="WBS 프로젝트 상세 정보 및<br/>작업 구조 관리"
      pageIcon={wbsDetailIcon}
    >
      <div className="wbs-detail-container">
        {/* 프로젝트 정보 */}
        <div className="project-info-section">
          <div className="project-info-card">
            <div className="project-info-header">
              <h3>프로젝트 정보</h3>
              <div className="project-actions">
                <button 
                  className="edit-project-btn"
                  onClick={() => navigate(`/wbs/edit/${id}`)}
                >
                  📝 프로젝트 수정
                </button>
                <button 
                  className="delete-project-btn"
                  onClick={handleDeleteProject}
                  disabled={isDeleting}
                >
                  {isDeleting ? '삭제 중...' : '🗑️ 프로젝트 삭제'}
                </button>
              </div>
            </div>
            
            <div className="project-details">
              <div className="project-meta">
                <div className="meta-item">
                  <span className="meta-label">설명</span>
                  <span className="meta-value">{project.description || '설명이 없습니다.'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">기간</span>
                  <span className="meta-value">
                    {formatDate(project.start_date)} ~ {formatDate(project.end_date)}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">상태</span>
                  <span 
                    className="project-status-badge"
                    style={{ 
                      background: getStatusColor(project.status),
                      color: 'white'
                    }}
                  >
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>
              
              <div className="project-progress">
                <div className="progress-header">
                  <span>전체 진행률</span>
                  <span className="progress-value">{project.progress}%</span>
                </div>
                <div className="progress-bar large">
                  <div 
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 작업 목록 */}
        <div className="tasks-section">
          <div className="tasks-header">
            <h3>작업 구조 (WBS)</h3>
            <button 
              className="add-task-btn"
              onClick={handleAddTask}
            >
              + 작업 추가
            </button>
          </div>
          
          <div className="tasks-tree">
            {tasks.length === 0 ? (
              <div className="empty-tasks">
                <div className="empty-icon">📋</div>
                <h4>등록된 작업이 없습니다</h4>
                <p>첫 번째 작업을 추가하여 WBS를 구성해보세요</p>
                <button 
                  className="empty-add-btn"
                  onClick={handleAddTask}
                >
                  작업 추가하기
                </button>
              </div>
            ) : (
              renderTaskTree()
            )}
          </div>
        </div>

        {/* 작업 추가/수정 폼 */}
        {showTaskForm && (
          <div className="task-form-overlay">
            <div className="task-form-modal">
              <div className="task-form-header">
                <h3>{editingTask ? '작업 수정' : '새 작업 추가'}</h3>
                <button 
                  className="task-form-close"
                  onClick={() => setShowTaskForm(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="task-form-content">
                <div className="form-group">
                  <label className="form-label required">작업 제목</label>
                  <input
                    type="text"
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="작업 제목을 입력하세요"
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    maxLength={200}
                  />
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">작업 설명</label>
                  <textarea
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="작업에 대한 상세한 설명을 입력하세요"
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">시작일</label>
                    <input
                      type="date"
                      value={taskFormData.start_date}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">종료일</label>
                    <input
                      type="date"
                      value={taskFormData.end_date}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className={`form-input ${errors.end_date ? 'error' : ''}`}
                    />
                    {errors.end_date && <span className="error-message">{errors.end_date}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">소요일수</label>
                    <input
                      type="number"
                      value={taskFormData.duration}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                      className={`form-input ${errors.duration ? 'error' : ''}`}
                      min="1"
                    />
                    {errors.duration && <span className="error-message">{errors.duration}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">진행률 (%)</label>
                    <input
                      type="number"
                      value={taskFormData.progress}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                      className={`form-input ${errors.progress ? 'error' : ''}`}
                      min="0"
                      max="100"
                    />
                    {errors.progress && <span className="error-message">{errors.progress}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">상태</label>
                    <select
                      value={taskFormData.status}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="form-select"
                    >
                      <option value="not_started">시작전</option>
                      <option value="in_progress">진행중</option>
                      <option value="completed">완료</option>
                      <option value="blocked">차단됨</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">우선순위</label>
                    <select
                      value={taskFormData.priority}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="form-select"
                    >
                      <option value="low">낮음</option>
                      <option value="medium">보통</option>
                      <option value="high">높음</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">담당자</label>
                  <input
                    type="text"
                    value={taskFormData.assignee}
                    onChange={(e) => setTaskFormData(prev => ({ ...prev, assignee: e.target.value }))}
                    placeholder="담당자 이름을 입력하세요"
                    className="form-input"
                  />
                </div>
                
                {errors.submit && (
                  <div className="error-message global-error">
                    {errors.submit}
                  </div>
                )}
              </div>
              
              <div className="task-form-actions">
                <button 
                  className="cancel-button"
                  onClick={() => setShowTaskForm(false)}
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button 
                  className="submit-button"
                  onClick={handleSaveTask}
                  disabled={isSubmitting || !taskFormData.title.trim()}
                >
                  {isSubmitting ? '저장 중...' : editingTask ? '수정' : '추가'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default WBSDetail