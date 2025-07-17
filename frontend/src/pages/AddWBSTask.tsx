import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import DatePicker from '../components/DatePicker'
import CustomSelect from '../components/CustomSelect'
import { apiCall } from '../utils/api'
import '../styles/AddWBSTask.css'

interface WBSTaskFormData {
  title: string
  description: string
  start_date: string
  end_date: string
  status: string
  priority: string
  assignee: string
  estimated_hours: number
  parent_id: number | null
}

interface WBSTask {
  id: number
  title: string
  level: number
  parent_id: number | null
}

const AddWBSTask: React.FC = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [formData, setFormData] = useState<WBSTaskFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'not_started',
    priority: 'medium',
    assignee: '',
    estimated_hours: 0,
    parent_id: null
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingTasks, setExistingTasks] = useState<WBSTask[]>([])
  const [projectTitle, setProjectTitle] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const addTaskIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="12" y1="9" x2="12" y2="15"/>
    </svg>
  )

  // 프로젝트 정보 및 기존 작업 로드
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        if (!token || !projectId) return
        
        // 프로젝트 정보 로드
        const projectResponse = await apiCall(`/api/wbs/projects/${projectId}`, {
          method: 'GET',
          token
        })
        
        if (projectResponse.ok) {
          const projectData = await projectResponse.json()
          setProjectTitle(projectData.title)
        }
        
        // 기존 작업 로드
        const tasksResponse = await apiCall(`/api/wbs/projects/${projectId}/tasks`, {
          method: 'GET',
          token
        })
        
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json()
          setExistingTasks(tasksData)
        }
      } catch (error) {
        console.error('프로젝트 데이터 로드 중 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjectData()
  }, [projectId, token])

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.title.trim()) {
      newErrors.title = '작업 제목을 입력해주세요'
    }

    if (formData.title.length > 200) {
      newErrors.title = '제목은 200자를 초과할 수 없습니다'
    }

    if (!formData.start_date) {
      newErrors.start_date = '시작일을 선택해주세요'
    }

    if (!formData.end_date) {
      newErrors.end_date = '종료일을 선택해주세요'
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      
      if (startDate > endDate) {
        newErrors.end_date = '종료일은 시작일보다 늦어야 합니다'
      }
    }

    if (formData.description.length > 2000) {
      newErrors.description = '설명은 2000자를 초과할 수 없습니다'
    }

    if (formData.estimated_hours < 0) {
      newErrors.estimated_hours = '예상 소요 시간은 0 이상이어야 합니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (!token || !projectId) {
        throw new Error('인증 토큰이 없습니다.')
      }
      
      // 상위 작업 레벨 계산
      let taskLevel = 1
      if (formData.parent_id) {
        const parentTask = existingTasks.find(task => task.id === formData.parent_id)
        if (parentTask) {
          taskLevel = parentTask.level + 1
        }
      }
      
      const requestData = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        status: formData.status,
        priority: formData.priority,
        assignee: formData.assignee,
        duration: formData.estimated_hours || 1,
        progress: 0.0,
        level: taskLevel,
        order_index: 0,
        parent_id: formData.parent_id
      }
      
      console.log('WBS 작업 생성 요청:', requestData)
      
      const response = await apiCall(`/api/wbs/projects/${projectId}/tasks`, {
        method: 'POST',
        token,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
      
      console.log('API 응답 상태:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'WBS 작업 생성에 실패했습니다.' }))
        console.error('API 에러 응답:', errorData)
        throw new Error(errorData.detail || 'WBS 작업 생성에 실패했습니다.')
      }
      
      const result = await response.json()
      console.log('생성된 작업:', result)
      
      navigate(`/wbs/detail/${projectId}`, { 
        state: { 
          message: '새 WBS 작업이 성공적으로 생성되었습니다!',
          newTaskId: result.id
        }
      })
    } catch (error) {
      console.error('WBS 작업 생성 중 오류 발생:', error)
      if (error instanceof Error && error.message.includes('인증이 만료되었습니다')) {
        navigate('/login')
        return
      }
      setErrors({ submit: error instanceof Error ? error.message : 'WBS 작업 생성 중 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusOptions = [
    { value: 'not_started', label: '미시작', icon: '⏸️', description: '아직 시작하지 않은 작업' },
    { value: 'in_progress', label: '진행중', icon: '⚡', description: '현재 진행 중인 작업' },
    { value: 'completed', label: '완료', icon: '✅', description: '완료된 작업' },
    { value: 'blocked', label: '차단', icon: '🚫', description: '차단된 작업' }
  ]

  const priorityOptions = [
    { value: 'low', label: '낮음', icon: '🔵', description: '낮은 우선순위' },
    { value: 'medium', label: '보통', icon: '🟡', description: '보통 우선순위' },
    { value: 'high', label: '높음', icon: '🔴', description: '높은 우선순위' }
  ]

  const parentTaskOptions = [
    { value: '', label: '상위 작업 없음', icon: '🏠', description: '최상위 작업' },
    ...existingTasks.map(task => ({
      value: task.id.toString(),
      label: `${'  '.repeat(task.level - 1)}${task.title}`,
      icon: '📋',
      description: `레벨 ${task.level} 작업`
    }))
  ]

  if (isLoading) {
    return (
      <Layout
        pageTitle="WBS 작업 추가"
        pageSubtitle="프로젝트 정보를 불러오는 중..."
        pageIcon={addTaskIcon}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>프로젝트 정보를 불러오는 중...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      pageTitle="WBS 작업 추가"
      pageSubtitle={`${projectTitle}에 새로운 작업을 추가하세요`}
      pageIcon={addTaskIcon}
    >
      <div className="add-wbs-task-container">
        <form onSubmit={handleSubmit} className="add-wbs-task-form">
          {/* 작업 제목 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label required">
                작업 제목
                <span className="char-count">
                  {formData.title.length}/200
                </span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: '' }))
                  }
                }}
                placeholder="작업 제목을 입력하세요"
                className={`form-input ${errors.title ? 'error' : ''}`}
                maxLength={200}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
          </div>

          {/* 작업 설명 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                작업 설명
                <span className="char-count">
                  {formData.description.length}/2000
                </span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }))
                  if (errors.description) {
                    setErrors(prev => ({ ...prev, description: '' }))
                  }
                }}
                placeholder="작업에 대한 상세한 설명을 입력하세요"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                rows={4}
                maxLength={2000}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          {/* 시작일 및 종료일 */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">시작일</label>
                <DatePicker
                  value={formData.start_date}
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, start_date: date }))
                    if (errors.start_date) {
                      setErrors(prev => ({ ...prev, start_date: '' }))
                    }
                  }}
                  placeholder="시작일을 선택하세요"
                  className={errors.start_date ? 'error' : ''}
                />
                {errors.start_date && <span className="error-message">{errors.start_date}</span>}
              </div>
              <div className="form-group">
                <label className="form-label required">종료일</label>
                <DatePicker
                  value={formData.end_date}
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, end_date: date }))
                    if (errors.end_date) {
                      setErrors(prev => ({ ...prev, end_date: '' }))
                    }
                  }}
                  placeholder="종료일을 선택하세요"
                  className={errors.end_date ? 'error' : ''}
                  min={formData.start_date}
                />
                {errors.end_date && <span className="error-message">{errors.end_date}</span>}
              </div>
            </div>
          </div>

          {/* 상태 및 우선순위 */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">작업 상태</label>
                <CustomSelect
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => setFormData(prev => ({ ...prev, status: value as string }))}
                  placeholder="작업 상태를 선택하세요"
                />
              </div>
              <div className="form-group">
                <label className="form-label">우선순위</label>
                <CustomSelect
                  options={priorityOptions}
                  value={formData.priority}
                  onChange={(value) => setFormData(prev => ({ ...prev, priority: value as string }))}
                  placeholder="우선순위를 선택하세요"
                />
              </div>
            </div>
          </div>

          {/* 담당자 및 예상 소요 시간 */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">담당자</label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, assignee: e.target.value }))
                  }}
                  placeholder="담당자를 입력하세요"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">예상 소요 시간 (시간)</label>
                <input
                  type="number"
                  value={formData.estimated_hours}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, estimated_hours: Number(e.target.value) }))
                    if (errors.estimated_hours) {
                      setErrors(prev => ({ ...prev, estimated_hours: '' }))
                    }
                  }}
                  placeholder="예상 소요 시간을 입력하세요"
                  className={`form-input ${errors.estimated_hours ? 'error' : ''}`}
                  min="0"
                  step="0.5"
                />
                {errors.estimated_hours && <span className="error-message">{errors.estimated_hours}</span>}
              </div>
            </div>
          </div>

          {/* 상위 작업 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">상위 작업</label>
              <CustomSelect
                options={parentTaskOptions}
                value={formData.parent_id?.toString() || ''}
                onChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  parent_id: value === '' ? null : Number(value)
                }))}
                placeholder="상위 작업을 선택하세요"
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {errors.submit && (
            <div className="form-section">
              <div className="error-message global-error">
                {errors.submit}
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/wbs/detail/${projectId}`)}
              className="cancel-button"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !formData.title.trim() || !formData.start_date || !formData.end_date}
            >
              {isSubmitting ? '생성 중...' : '📋 WBS 작업 생성'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default AddWBSTask