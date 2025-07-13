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
    <div className="todo-container">
      <div className="todo-header">
        <h2>할일 관리</h2>
        <button className="add-todo-btn" onClick={() => setShowAddForm(!showAddForm)}>
          + 새 할일 추가
        </button>
      </div>

      {showAddForm && (
        <div className="add-todo-form">
          <input
            type="text"
            placeholder="할일 제목"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          />
          <textarea
            placeholder="설명 (선택사항)"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          />
          <div className="form-row">
            <select
              value={newTodo.priority}
              onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as Todo['priority'] })}
            >
              <option value="high">높음</option>
              <option value="medium">중간</option>
              <option value="low">낮음</option>
            </select>
            <input
              type="date"
              value={newTodo.dueDate}
              onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button className="save-btn" onClick={addTodo}>저장</button>
            <button className="cancel-btn" onClick={() => {
              setShowAddForm(false);
              setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
            }}>취소</button>
          </div>
        </div>
      )}

      <div className="todo-filters">
        <div className="filter-group">
          <label>상태별 필터:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">전체</option>
            <option value="pending">대기중</option>
            <option value="in_progress">진행중</option>
            <option value="completed">완료</option>
          </select>
        </div>
        <div className="filter-group">
          <label>정렬:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="priority">우선순위</option>
            <option value="dueDate">마감일</option>
          </select>
        </div>
      </div>

      <div className="todo-list">
        {filteredAndSortedTodos.length === 0 ? (
          <div className="empty-state">할일이 없습니다.</div>
        ) : (
          filteredAndSortedTodos.map(todo => (
            <div key={todo.id} className="todo-item">
              <div className="todo-priority" style={{ backgroundColor: getPriorityColor(todo.priority) }}></div>
              <div className="todo-content">
                <h3>{todo.title}</h3>
                {todo.description && <p>{todo.description}</p>}
                <div className="todo-meta">
                  <span className={`status-badge status-${todo.status}`}>
                    {getStatusBadge(todo.status)}
                  </span>
                  {todo.dueDate && (
                    <span className="due-date">마감: {new Date(todo.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="todo-actions">
                <select
                  value={todo.status}
                  onChange={(e) => updateTodoStatus(todo.id, e.target.value as Todo['status'])}
                >
                  <option value="pending">대기중</option>
                  <option value="in_progress">진행중</option>
                  <option value="completed">완료</option>
                </select>
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>삭제</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;