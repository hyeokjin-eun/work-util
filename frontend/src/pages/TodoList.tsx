import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../styles/TodoList.css';

interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('priority');
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: ''
  });

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo: Todo = {
      id: uuidv4(),
      title: newTodo.title,
      description: newTodo.description,
      priority: newTodo.priority,
      status: 'pending',
      dueDate: newTodo.dueDate || undefined,
      createdAt: new Date().toISOString()
    };

    setTodos([...todos, todo]);
    setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
    setShowAddForm(false);
  };

  const updateTodoStatus = (id: string, status: Todo['status']) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : undefined
        };
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'in_progress': return '진행중';
      case 'completed': return '완료';
      default: return status;
    }
  };

  const filteredAndSortedTodos = todos
    .filter(todo => filterStatus === 'all' || todo.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-icon">✓</div>
        <h1 className="page-title">할일 관리</h1>
        <p className="page-subtitle">우선순위와 마감일을 설정하여 체계적으로 업무를 관리하세요</p>
      </div>
      
      <div className="action-section">
        <button className="btn-primary add-todo-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <span className="btn-icon">+</span>
          새 할일 추가
        </button>
      </div>

      {showAddForm && (
        <div className="section add-todo-form">
          <h3 className="section-title">새 할일 추가</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="할일 제목"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="form-input"
            />
            <textarea
              placeholder="설명 (선택사항)"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="form-textarea"
            />
            <div className="form-row">
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as Todo['priority'] })}
                className="form-select"
              >
                <option value="high">높음</option>
                <option value="medium">중간</option>
                <option value="low">낮음</option>
              </select>
              <input
                type="date"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={addTodo}>
                <span className="btn-icon">💾</span>
                저장
              </button>
              <button className="btn-secondary" onClick={() => {
                setShowAddForm(false);
                setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
              }}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="section filters-section">
        <h3 className="section-title">필터 및 정렬</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">상태별 필터</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-select">
              <option value="all">전체</option>
              <option value="pending">대기중</option>
              <option value="in_progress">진행중</option>
              <option value="completed">완료</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">정렬</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-select">
              <option value="priority">우선순위</option>
              <option value="dueDate">마감일</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section todos-section">
        <h3 className="section-title">
          할일 목록 
          <span className="count-badge">{filteredAndSortedTodos.length}</span>
        </h3>
        <div className="todos-grid">
          {filteredAndSortedTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">할일이 없습니다.<br />새로운 할일을 추가해보세요!</div>
            </div>
          ) : (
            filteredAndSortedTodos.map(todo => (
              <div key={todo.id} className="todo-card">
                <div className="todo-header">
                  <div className="todo-priority-badge" data-priority={todo.priority}>
                    {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}
                  </div>
                  <h4 className="todo-title">{todo.title}</h4>
                </div>
                {todo.description && (
                  <p className="todo-description">{todo.description}</p>
                )}
                <div className="todo-meta">
                  <span className={`badge badge-${todo.status === 'completed' ? 'success' : todo.status === 'in_progress' ? 'warning' : 'info'}`}>
                    {getStatusBadge(todo.status)}
                  </span>
                  {todo.dueDate && (
                    <span className="due-date">📅 {new Date(todo.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="todo-actions">
                  <select
                    value={todo.status}
                    onChange={(e) => updateTodoStatus(todo.id, e.target.value as Todo['status'])}
                    className="form-select small"
                  >
                    <option value="pending">대기중</option>
                    <option value="in_progress">진행중</option>
                    <option value="completed">완료</option>
                  </select>
                  <button className="btn-delete" onClick={() => deleteTodo(todo.id)}>
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;