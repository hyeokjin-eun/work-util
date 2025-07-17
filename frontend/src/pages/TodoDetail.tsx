import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import DatePicker from '../components/DatePicker'
import { apiCall } from '../utils/api'
import '../styles/TodoDetail.css'

interface TodoFormData {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed'
  dueDate: string
  category: string
  tags: string[]
}

const TodoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { token, isLoading } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    category: '',
    tags: []
  })

  const [newTag, setNewTag] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [showCategorySection, setShowCategorySection] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const priorityOptions = [
    { value: 'high', label: '높음 (긴급)', color: '#ef4444', icon: '🔥' },
    { value: 'medium', label: '보통', color: '#f59e0b', icon: '⚡' },
    { value: 'low', label: '낮음', color: '#10b981', icon: '🌱' }
  ]

  const statusOptions = [
    { value: 'pending', label: '대기중', color: '#6b7280', icon: '⏳' },
    { value: 'in_progress', label: '진행중', color: '#3b82f6', icon: '🚀' },
    { value: 'completed', label: '완료', color: '#10b981', icon: '✅' }
  ]

  const categoryOptions = [
    { value: 'work', label: '업무', icon: '💼' },
    { value: 'personal', label: '개인', icon: '👤' },
    { value: 'study', label: '학습', icon: '📚' },
    { value: 'health', label: '건강', icon: '🏃' },
    { value: 'finance', label: '금융', icon: '💰' },
    { value: 'other', label: '기타', icon: '📝' }
  ]

  const todoDetailIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    
    if (!isLoading && id && !isDeleting) {
      loadTodoDetail()
    }
  }, [isLoading, id, isDeleting])

  const loadTodoDetail = async () => {
    try {
      if (!id) {
        navigate('/todo')
        return
      }
      
      if (!token) {
        console.log('토큰이 없습니다. 인증 확인 중...')
        return
      }

      const response = await apiCall(`/api/todos/${id}`, {
        method: 'GET',
        token
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const todoData = await response.json()

      setFormData({
        title: todoData.title || '',
        description: todoData.description || '',
        priority: todoData.priority || 'medium',
        status: todoData.status || 'pending',
        dueDate: todoData.due_date || '',
        category: todoData.category || '',
        tags: todoData.tags ? (Array.isArray(todoData.tags) ? todoData.tags : todoData.tags.split(',').filter(Boolean)) : []
      })
      
    } catch (error) {
      console.error('할일 상세 정보 로드 실패:', error)
      // 에러 발생 시에도 페이지에 머물러서 에러 상태를 표시
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        category: '',
        tags: []
      })
    } finally {
      setPageLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    }

    if (formData.title.length > 100) {
      newErrors.title = '제목은 100자를 초과할 수 없습니다'
    }

    if (formData.description.length > 500) {
      newErrors.description = '설명은 500자를 초과할 수 없습니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      if (!token || !id) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const requestData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        category: formData.category,
        due_date: formData.dueDate || null,
        tags: formData.tags
      }
      
      console.log('수정 요청 데이터:', requestData)
      
      const response = await apiCall(`/api/todos/${id}`, {
        method: 'PUT',
        token,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '수정 중 오류가 발생했습니다.' }))
        console.error('API 에러 응답:', errorData)
        const errorMessage = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : Array.isArray(errorData.detail) 
            ? errorData.detail.map((err: any) => err.msg || err).join(', ')
            : errorData.message || JSON.stringify(errorData) || '할일 수정 중 오류가 발생했습니다.'
        throw new Error(errorMessage)
      }

      // 수정 완료 후 데이터 다시 로드하고 편집 모드 유지
      await loadTodoDetail()
    } catch (error) {
      console.error('할일 수정 중 오류 발생:', error)
      setErrors({ submit: error instanceof Error ? error.message : '할일 수정 중 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('이 할일을 삭제하시겠습니까?')) return

    try {
      if (!token || !id) {
        throw new Error('인증 토큰이 없습니다.')
      }

      setIsDeleting(true)

      const response = await apiCall(`/api/todos/${id}`, {
        method: 'DELETE',
        token
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '삭제 중 오류가 발생했습니다.' }))
        throw new Error(errorData.detail || errorData.message || '할일 삭제 중 오류가 발생했습니다.')
      }

      // Immediately navigate without any delays
      console.log('할일 삭제 완료, 목록 페이지로 이동...')
      navigate('/todo', { 
        replace: true,
        state: { 
          message: '할일이 성공적으로 삭제되었습니다.',
        }
      })
      
    } catch (error) {
      console.error('할일 삭제 중 오류 발생:', error)
      alert('할일 삭제 중 오류가 발생했습니다. 다시 시도해주세요.')
      setIsDeleting(false)
    }
  }

  const handleTagAdd = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
      setShowTagInput(false)
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTagAdd()
    }
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (pageLoading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>할일 정보를 불러오는 중...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      pageTitle={isEditing ? "할일 수정" : "할일 상세"}
      pageSubtitle={isEditing ? "할일 정보를 수정해보세요" : "할일 정보를 확인하고<br/>수정하거나 삭제할 수 있습니다"}
      pageIcon={todoDetailIcon}
    >
      <div className="todo-detail-container">

        <form className="todo-detail-form">
          {/* 제목 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label required">
                제목
                {isEditing && (
                  <span className="char-count">
                    {formData.title.length}/100
                  </span>
                )}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                    if (errors.title) {
                      setErrors(prev => ({ ...prev, title: '' }))
                    }
                  }}
                  placeholder="할일을 입력하세요"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  maxLength={100}
                />
              ) : (
                <div className="view-field title-field">{formData.title}</div>
              )}
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
          </div>

          {/* 설명 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                설명
                {isEditing && (
                  <span className="char-count">
                    {formData.description.length}/500
                  </span>
                )}
              </label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, description: e.target.value }))
                    if (errors.description) {
                      setErrors(prev => ({ ...prev, description: '' }))
                    }
                  }}
                  placeholder="상세 설명을 입력하세요"
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  rows={4}
                  maxLength={500}
                />
              ) : (
                <div className="view-field description-field">
                  {formData.description || '설명이 없습니다.'}
                </div>
              )}
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          {/* 우선순위 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">우선순위</label>
              {isEditing ? (
                <div className="priority-options">
                  {priorityOptions.map(option => (
                    <label key={option.value} className="priority-option">
                      <input
                        type="radio"
                        name="priority"
                        value={option.value}
                        checked={formData.priority === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      />
                      <span 
                        className="priority-card"
                        style={{ 
                          borderColor: option.color,
                          '--priority-color': option.color
                        } as React.CSSProperties & { '--priority-color': string }}
                      >
                        <span className="priority-icon">{option.icon}</span>
                        <span className="priority-label">{option.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="view-field priority-field">
                  <span style={{ color: priorityOptions.find(opt => opt.value === formData.priority)?.color }}>
                    {priorityOptions.find(opt => opt.value === formData.priority)?.icon} {priorityOptions.find(opt => opt.value === formData.priority)?.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 상태 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">상태</label>
              {isEditing ? (
                <div className="status-options">
                  {statusOptions.map(option => (
                    <label key={option.value} className="status-option">
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={formData.status === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      />
                      <span 
                        className="status-card"
                        style={{ 
                          borderColor: option.color,
                          '--status-color': option.color
                        } as React.CSSProperties & { '--status-color': string }}
                      >
                        <span className="status-icon">{option.icon}</span>
                        <span className="status-label">{option.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="view-field status-field">
                  <span style={{ color: statusOptions.find(opt => opt.value === formData.status)?.color }}>
                    {statusOptions.find(opt => opt.value === formData.status)?.icon} {statusOptions.find(opt => opt.value === formData.status)?.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 마감일 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">마감일</label>
              {isEditing ? (
                <DatePicker
                  value={formData.dueDate}
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, dueDate: date }))
                    if (errors.dueDate) {
                      setErrors(prev => ({ ...prev, dueDate: '' }))
                    }
                  }}
                  placeholder="날짜를 선택하세요"
                  className={errors.dueDate ? 'error' : ''}
                />
              ) : (
                <div className="view-field date-field">
                  {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('ko-KR') : '마감일이 설정되지 않았습니다.'}
                </div>
              )}
              {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
            </div>
          </div>

          {/* 카테고리 */}
          <div className="form-section">
            <div className="form-group">
              {isEditing ? (
                <div className="collapsible-section">
                  <button
                    type="button"
                    className="collapsible-header"
                    onClick={() => setShowCategorySection(!showCategorySection)}
                  >
                    <span className="collapsible-title">
                      카테고리 {formData.category && `(${categoryOptions.find(opt => opt.value === formData.category)?.label})`}
                    </span>
                    <span className={`collapsible-icon ${showCategorySection ? 'open' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {showCategorySection && (
                    <div className="collapsible-content">
                      <div className="category-grid">
                        {categoryOptions.map(option => (
                          <label key={option.value} className="category-option">
                            <input
                              type="radio"
                              name="category"
                              value={option.value}
                              checked={formData.category === option.value}
                              onChange={(e) => {
                                setFormData(prev => ({ ...prev, category: e.target.value }))
                                setShowCategorySection(false)
                              }}
                            />
                            <span className="category-card">
                              <span className="category-icon">{option.icon}</span>
                              <span className="category-label">{option.label}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <label className="form-label">카테고리</label>
                  <div className="view-field category-field">
                    {formData.category ? (
                      <>
                        {categoryOptions.find(opt => opt.value === formData.category)?.icon} {categoryOptions.find(opt => opt.value === formData.category)?.label}
                      </>
                    ) : (
                      '카테고리가 설정되지 않았습니다.'
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 태그 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">태그</label>
              <div className="tags-container">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="tag-remove"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                
                {isEditing && (
                  <>
                    {showTagInput ? (
                      <div className="tag-input-container">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="태그 입력"
                          className="tag-input"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleTagAdd}
                          className="tag-add-confirm"
                        >
                          추가
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowTagInput(false)
                            setNewTag('')
                          }}
                          className="tag-add-cancel"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowTagInput(true)}
                        className="tag-add-button"
                      >
                        + 태그 추가
                      </button>
                    )}
                  </>
                )}
                
                {formData.tags.length === 0 && !isEditing && (
                  <span className="no-tags">태그가 없습니다.</span>
                )}
              </div>
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
          {!isEditing ? (
            <>
              <div className="form-actions">
                <button 
                  className="submit-button"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ 수정
                </button>
              </div>
              <div className="form-actions" style={{ marginTop: '16px', paddingTop: '0', borderTop: 'none' }}>
                <button 
                  className="submit-button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{ 
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
                    width: '100%'
                  }}
                >
                  {isDeleting ? '삭제 중...' : '🗑️ 삭제'}
                </button>
              </div>
              <div className="form-actions" style={{ marginTop: '16px', paddingTop: '0', borderTop: 'none' }}>
                <button 
                  className="cancel-button"
                  onClick={() => navigate('/todo')}
                  style={{ width: '100%' }}
                >
                  목록으로
                </button>
              </div>
            </>
          ) : (
            <div className="form-actions">
              <button 
                className="cancel-button"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button 
                className="submit-button"
                onClick={handleSave}
                disabled={isSubmitting || !formData.title.trim()}
              >
                {isSubmitting ? '저장 중...' : '💾 저장'}
              </button>
            </div>
          )}
        </form>
      </div>
    </Layout>
  )
}

export default TodoDetail