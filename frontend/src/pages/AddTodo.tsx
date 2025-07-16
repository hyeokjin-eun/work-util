import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import DatePicker from '../components/DatePicker'
import '../styles/AddTodo.css'

interface TodoFormData {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  category: string
  tags: string[]
}

const AddTodo: React.FC = () => {
  const { } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: '',
    tags: []
  })

  const [newTag, setNewTag] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [showCategorySection, setShowCategorySection] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const priorityOptions = [
    { value: 'high', label: '높음 (긴급)', color: '#ef4444', icon: '🔥' },
    { value: 'medium', label: '보통', color: '#f59e0b', icon: '⚡' },
    { value: 'low', label: '낮음', color: '#10b981', icon: '🌱' }
  ]

  const categoryOptions = [
    { value: 'work', label: '업무', icon: '💼' },
    { value: 'personal', label: '개인', icon: '👤' },
    { value: 'study', label: '학습', icon: '📚' },
    { value: 'health', label: '건강', icon: '🏃' },
    { value: 'finance', label: '금융', icon: '💰' },
    { value: 'other', label: '기타', icon: '📝' }
  ]

  const addTodoIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M12 5v14m7-7H5"/>
    </svg>
  )

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

    if (formData.dueDate) {
      const today = new Date()
      const dueDate = new Date(formData.dueDate)
      today.setHours(0, 0, 0, 0)
      dueDate.setHours(0, 0, 0, 0)
      
      if (dueDate < today) {
        newErrors.dueDate = '마감일은 오늘 이후 날짜여야 합니다'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // API 호출
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }
      
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: 'pending',
          category: formData.category,
          due_date: formData.dueDate || null,
          tags: formData.tags
        })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // 토큰이 만료되었거나 유효하지 않음
          localStorage.removeItem('access_token')
          navigate('/login')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.detail || '할일 추가에 실패했습니다.')
      }
      
      const result = await response.json()
      
      // 성공 메시지와 함께 할일 목록으로 이동
      navigate('/todo', { 
        state: { 
          message: result.message || '새 할일이 성공적으로 추가되었습니다!',
          newTodoId: result.todo?.id 
        }
      })
    } catch (error) {
      console.error('할일 추가 중 오류 발생:', error)
      setErrors({ submit: error instanceof Error ? error.message : '할일 추가 중 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsSubmitting(false)
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

  return (
    <Layout
      pageTitle="새 할일 추가"
      pageSubtitle="목표를 설정하고<br/>체계적으로 관리해보세요"
      pageIcon={addTodoIcon}
    >
      <div className="add-todo-container">
        <form onSubmit={handleSubmit} className="add-todo-form">
          {/* 제목 입력 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label required">
                제목
                <span className="char-count">
                  {formData.title.length}/100
                </span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="할일을 입력하세요"
                className={`form-input ${errors.title ? 'error' : ''}`}
                maxLength={100}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
          </div>

          {/* 설명 입력 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                설명
                <span className="char-count">
                  {formData.description.length}/500
                </span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="상세 설명을 입력하세요"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                rows={4}
                maxLength={500}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          {/* 우선순위 및 카테고리 */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">우선순위</label>
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
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
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
              </div>
            </div>
          </div>

          {/* 마감일 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">마감일</label>
              <DatePicker
                value={formData.dueDate}
                onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                min={getTodayDate()}
                placeholder="날짜를 선택하세요"
                className={errors.dueDate ? 'error' : ''}
              />
              {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
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
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
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
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/todo')}
              className="cancel-button"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? '추가 중...' : '할일 추가'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default AddTodo