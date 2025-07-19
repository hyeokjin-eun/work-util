import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import CustomSelect from '../components/CustomSelect'
import DatePicker from '../components/DatePicker'
import { apiCall, apiCallWithJson } from '../utils/api'
import '../styles/TodoList.css'

interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed'
  dueDate?: string
  createdAt: string
  category?: string
  tags?: string[]
}

type FilterType = 'all' | 'pending' | 'in_progress' | 'completed'
type SortType = 'priority' | 'dueDate' | 'createdAt' | 'alphabetical'

const TodoList: React.FC = () => {
  const { token, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    // Scroll to top when TodoList component loads
    window.scrollTo(0, 0)
    
    // 새 할일 추가 후 성공 메시지 표시
    if (location.state?.message) {
      // 성공 메시지를 표시하는 로직을 추가할 수 있습니다
      console.log(location.state.message)
    }
    
    // 인증 로딩이 완료된 후에만 할일 목록 로드
    if (!isLoading) {
      loadTodos()
    }
  }, [location.state, isLoading])

  const loadTodos = async () => {
    try {
      setLoading(true)
      if (!token) {
        console.log('토큰이 없습니다. 로그인 페이지로 이동합니다.')
        navigate('/login')
        return
      }
      
      console.log('할일 목록 로드 시도 중...')
      const todosData = await apiCallWithJson<any[]>('/api/todos', {
        token
      })
      console.log('할일 목록 로드 성공:', todosData)
      
      // API 응답 데이터의 필드명을 프론트엔드 형식으로 변환
      const mappedTodos = todosData.map((todo: any) => ({
        ...todo,
        dueDate: todo.due_date,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at
      }))
      
      setTodos(mappedTodos)
    } catch (error) {
      console.error('할일 목록 로드 실패:', error)
      // 에러가 발생해도 로그인 페이지로 이동하지 않고 빈 배열로 설정
      setTodos([])
    } finally {
      setLoading(false)
    }
  }

  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('priority')

  const filterOptions = [
    { 
      value: 'all', 
      label: '전체 항목', 
      icon: '📋',
      description: '모든 할일 보기',
      color: '#6b7280'
    },
    { 
      value: 'pending', 
      label: '대기중인 할일', 
      icon: '⏳',
      description: '아직 시작하지 않은 할일',
      color: '#6b7280'
    },
    { 
      value: 'in_progress', 
      label: '진행중인 할일', 
      icon: '🚀',
      description: '현재 작업중인 할일',
      color: '#3b82f6'
    },
    { 
      value: 'completed', 
      label: '완료된 할일', 
      icon: '✅',
      description: '완료한 할일',
      color: '#10b981'
    }
  ]

  const sortOptions = [
    { 
      value: 'priority', 
      label: '우선순위 높은 순', 
      icon: '🎯',
      description: '중요한 일부터'
    },
    { 
      value: 'dueDate', 
      label: '마감일 빠른 순', 
      icon: '📅',
      description: '급한 일부터'
    },
    { 
      value: 'createdAt', 
      label: '최신 등록 순', 
      icon: '🕐',
      description: '최근 추가된 순'
    },
    { 
      value: 'alphabetical', 
      label: '가나다 순', 
      icon: '🔤',
      description: '제목 알파벳 순'
    }
  ]

  const statusOptions = [
    { 
      value: 'pending', 
      label: '대기', 
      icon: '⏳',
      color: '#6b7280'
    },
    { 
      value: 'in_progress', 
      label: '진행중', 
      icon: '🚀',
      color: '#3b82f6'
    },
    { 
      value: 'completed', 
      label: '완료', 
      icon: '✅',
      color: '#10b981'
    }
  ]

  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: ''
  })

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  }

  const statusColors = {
    pending: '#6b7280',
    in_progress: '#3b82f6',
    completed: '#10b981'
  }

  const statusLabels = {
    pending: '대기',
    in_progress: '진행중',
    completed: '완료'
  }

  const todoIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  )

  const getCompletionRate = () => {
    const completed = todos.filter(todo => todo.completed).length
    return todos.length > 0 ? Math.round((completed / todos.length) * 100) : 0
  }

  const filteredAndSortedTodos = todos
    .filter(todo => {
      if (filter === 'all') return true
      return todo.status === filter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) return

    setIsSubmitting(true)
    
    try {
      if (!token) {
        navigate('/login')
        return
      }

      await apiCallWithJson('/api/todos', {
        method: 'POST',
        token,
        body: JSON.stringify({
          title: newTodo.title,
          description: newTodo.description,
          priority: newTodo.priority,
          status: 'pending',
          category: '',
          due_date: newTodo.dueDate || null,
          tags: []
        })
      })

      // 할일 목록 다시 로드
      await loadTodos()
      
      // 폼 초기화 및 모달 닫기
      setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' })
      setShowAddModal(false)
    } catch (error) {
      console.error('할일 추가 중 오류 발생:', error)
      alert('할일 추가 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, status: todo.completed ? 'pending' : 'completed' }
        : todo
    ))
  }

  const updateTodoStatus = async (id: number, status: Todo['status']) => {
    try {
      if (!token) {
        navigate('/login')
        return
      }
      
      await apiCallWithJson(`/api/todos/${id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ status })
      })
      
      // 성공 시 로컬 상태 업데이트
      setTodos(todos.map(todo => 
        todo.id === id 
          ? { ...todo, status, completed: status === 'completed' }
          : todo
      ))
    } catch (error) {
      console.error('할일 상태 업데이트 실패:', error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      if (!token) {
        navigate('/login')
        return
      }
      
      await apiCallWithJson(`/api/todos/${id}`, {
        method: 'DELETE',
        token
      })
      
      // 성공 시 로컬 상태 업데이트
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('할일 삭제 실패:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getCategoryInfo = (category: string) => {
    const categoryMap: { [key: string]: { label: string; icon: string; color: string } } = {
      'work': { label: '업무', icon: '💼', color: '#3b82f6' },
      'personal': { label: '개인', icon: '👤', color: '#10b981' },
      'study': { label: '학습', icon: '📚', color: '#8b5cf6' },
      'health': { label: '건강', icon: '🏃', color: '#f59e0b' },
      'finance': { label: '금융', icon: '💰', color: '#ef4444' },
      'other': { label: '기타', icon: '📝', color: '#6b7280' }
    }
    return categoryMap[category] || { label: category, icon: '📝', color: '#6b7280' }
  }

  const priorityOptions = [
    { value: 'high', label: '높음 (긴급)', color: '#ef4444', icon: '🔥' },
    { value: 'medium', label: '보통', color: '#f59e0b', icon: '⚡' },
    { value: 'low', label: '낮음', color: '#10b981', icon: '🌱' }
  ]

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <Layout
      pageTitle="할일 관리"
      pageSubtitle="우선순위와 마감일을<br/>설정하여 체계적으로 업무를 관리하세요"
      pageIcon={todoIcon}
    >
      <div className="todo-container">
        <div className="add-task-buttons">
          <button 
            className="add-task-btn primary"
            onClick={() => navigate('/todo/add')}
          >
            ✨ 새 할일 추가
          </button>
          <button 
            className="add-task-btn secondary"
            onClick={() => setShowAddModal(true)}
          >
            ⚡ 빠른 추가
          </button>
        </div>

        <div className="filter-section">
          <div className="filter-title">필터 및 정렬</div>
          
          <div className="filter-group">
            <label className="filter-label">상태별 필터</label>
            <CustomSelect
              options={filterOptions}
              value={filter}
              onChange={(value) => setFilter(value as FilterType)}
              placeholder="상태를 선택하세요"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">정렬</label>
            <CustomSelect
              options={sortOptions}
              value={sortBy}
              onChange={(value) => setSortBy(value as SortType)}
              placeholder="정렬 방식을 선택하세요"
            />
          </div>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <div className="tasks-title">할일 목록</div>
            <div className="task-count">{filteredAndSortedTodos.length}</div>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          ) : filteredAndSortedTodos.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3>할일이 없습니다</h3>
              <p>새로운 할일을 추가해보세요!</p>
            </div>
          ) : (
            <div className="todo-list">
              {filteredAndSortedTodos.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-checkbox">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span className="checkmark"></span>
                  </div>
                  
                  <div className="todo-content">
                    <div className="todo-header">
                      <h3 
                        className="todo-title clickable"
                        onClick={() => navigate(`/todo/${todo.id}`)}
                      >
                        {todo.title}
                      </h3>
                      <div className="todo-badges">
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: priorityColors[todo.priority] }}
                        >
                          {todo.priority}
                        </span>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: statusColors[todo.status] }}
                        >
                          {statusLabels[todo.status]}
                        </span>
                      </div>
                    </div>
                    
                    {todo.description && (
                      <p className="todo-description">{todo.description}</p>
                    )}
                    
                    {/* 카테고리와 태그 표시 */}
                    {(todo.category || (todo.tags && todo.tags.length > 0)) && (
                      <div className="todo-category-tags">
                        {todo.category && (
                          <div className="category-container">
                            <span 
                              className="category-badge"
                              style={{ backgroundColor: getCategoryInfo(todo.category).color }}
                            >
                              {getCategoryInfo(todo.category).icon} {getCategoryInfo(todo.category).label}
                            </span>
                          </div>
                        )}
                        {todo.tags && todo.tags.length > 0 && (
                          <div className="tags-container">
                            {todo.tags.map((tag, index) => (
                              <span key={index} className="tag-badge">
                                🏷️ {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="todo-meta">
                      {todo.dueDate && (
                        <span className={`due-date ${getDaysUntilDue(todo.dueDate) < 0 ? 'overdue' : getDaysUntilDue(todo.dueDate) <= 1 ? 'urgent' : ''}`}>
                          📅 {formatDate(todo.dueDate)}
                          {getDaysUntilDue(todo.dueDate) < 0 && ' (지연)'}
                          {getDaysUntilDue(todo.dueDate) === 0 && ' (오늘)'}
                          {getDaysUntilDue(todo.dueDate) === 1 && ' (내일)'}
                        </span>
                      )}
                      <span className="created-date">
                        생성: {formatDate(todo.createdAt)}
                      </span>
                    </div>
                    
                    <div className="todo-actions">
                    <button 
                      className="detail-btn"
                      onClick={() => navigate(`/todo/${todo.id}`)}
                      title="상세 보기"
                    >
                      📝
                    </button>
                    <CustomSelect
                      options={statusOptions}
                      value={todo.status}
                      onChange={(value) => updateTodoStatus(todo.id, value as Todo['status'])}
                      className="status-custom-select"
                    />
                      <button 
                        className="delete-btn"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>새 할일 추가</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>제목 *</label>
                  <input
                    type="text"
                    placeholder="할일을 입력하세요"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>설명</label>
                  <textarea
                    placeholder="상세 설명을 입력하세요"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>우선순위</label>
                  <div className="priority-options">
                    {priorityOptions.map(option => (
                      <label key={option.value} className="priority-option">
                        <input
                          type="radio"
                          name="priority"
                          value={option.value}
                          checked={newTodo.priority === option.value}
                          onChange={(e) => setNewTodo({...newTodo, priority: e.target.value as typeof newTodo.priority})}
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
                
                <div className="form-group">
                  <label>마감일</label>
                  <DatePicker
                    value={newTodo.dueDate}
                    onChange={(date) => setNewTodo({...newTodo, dueDate: date})}
                    min={getTodayDate()}
                    placeholder="날짜를 선택하세요"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button 
                  className="submit-btn"
                  onClick={handleAddTodo}
                  disabled={isSubmitting || !newTodo.title.trim()}
                >
                  {isSubmitting ? '추가 중...' : '추가'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TodoList