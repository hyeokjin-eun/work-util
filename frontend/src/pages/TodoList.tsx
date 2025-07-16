import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
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
}

type FilterType = 'all' | 'pending' | 'in_progress' | 'completed'
type SortType = 'priority' | 'dueDate' | 'createdAt' | 'alphabetical'

const TodoList: React.FC = () => {
  const { } = useAuth()
  
  useEffect(() => {
    // Scroll to top when TodoList component loads
    window.scrollTo(0, 0)
  }, [])

  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      title: '프로젝트 계획서 작성',
      description: '새로운 프로젝트의 전체 계획서를 작성하고 일정을 수립합니다.',
      completed: false,
      priority: 'high',
      status: 'in_progress',
      dueDate: '2025-07-20',
      createdAt: '2025-07-15'
    },
    {
      id: 2,
      title: '팀 회의 준비',
      description: '주간 팀 회의를 위한 자료 준비 및 안건 정리',
      completed: false,
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-07-18',
      createdAt: '2025-07-16'
    },
    {
      id: 3,
      title: 'API 문서 정리',
      description: '개발된 API의 문서화 및 예제 코드 작성',
      completed: true,
      priority: 'low',
      status: 'completed',
      dueDate: '2025-07-17',
      createdAt: '2025-07-14'
    }
  ])

  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('priority')
  const [showAddModal, setShowAddModal] = useState(false)
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

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return

    const todo: Todo = {
      id: Date.now(),
      title: newTodo.title,
      description: newTodo.description,
      completed: false,
      priority: newTodo.priority,
      status: 'pending',
      dueDate: newTodo.dueDate || undefined,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setTodos([...todos, todo])
    setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' })
    setShowAddModal(false)
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, status: todo.completed ? 'pending' : 'completed' }
        : todo
    ))
  }

  const updateTodoStatus = (id: number, status: Todo['status']) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, status, completed: status === 'completed' }
        : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
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

  return (
    <Layout
      pageTitle="할일 관리"
      pageSubtitle="우선순위와 마감일을<br/>설정하여 체계적으로 업무를 관리하세요"
      pageIcon={todoIcon}
    >
      <div className="todo-container">
        <button 
          className="add-task-btn"
          onClick={() => setShowAddModal(true)}
        >
          ✨ 새 할일 추가
        </button>

        <div className="filter-section">
          <div className="filter-title">필터 및 정렬</div>
          
          <div className="filter-group">
            <label className="filter-label">상태별 필터</label>
            <select 
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
            >
              <option value="all">전체</option>
              <option value="pending">대기</option>
              <option value="in_progress">진행중</option>
              <option value="completed">완료</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">정렬</label>
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
            >
              <option value="priority">우선순위</option>
              <option value="dueDate">마감일</option>
              <option value="createdAt">생성일</option>
              <option value="alphabetical">알파벳순</option>
            </select>
          </div>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <div className="tasks-title">할일 목록</div>
            <div className="task-count">{filteredAndSortedTodos.length}</div>
          </div>
          
          {filteredAndSortedTodos.length === 0 ? (
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
                      <h3 className="todo-title">{todo.title}</h3>
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
                  </div>
                  
                  <div className="todo-actions">
                    <select
                      className="status-select"
                      value={todo.status}
                      onChange={(e) => updateTodoStatus(todo.id, e.target.value as Todo['status'])}
                    >
                      <option value="pending">대기</option>
                      <option value="in_progress">진행중</option>
                      <option value="completed">완료</option>
                    </select>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      🗑️
                    </button>
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
                
                <div className="form-row">
                  <div className="form-group">
                    <label>우선순위</label>
                    <select
                      value={newTodo.priority}
                      onChange={(e) => setNewTodo({...newTodo, priority: e.target.value as typeof newTodo.priority})}
                      className="form-select"
                    >
                      <option value="high">높음</option>
                      <option value="medium">보통</option>
                      <option value="low">낮음</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>마감일</label>
                    <input
                      type="date"
                      value={newTodo.dueDate}
                      onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  취소
                </button>
                <button 
                  className="submit-btn"
                  onClick={handleAddTodo}
                  disabled={!newTodo.title.trim()}
                >
                  추가
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