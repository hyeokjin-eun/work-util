import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, differenceInDays, addDays } from 'date-fns';
import '../styles/WbsManager.css';

interface WbsTask {
  id: string;
  title: string;
  description: string;
  type: 'creative' | 'administrative' | 'communication';
  priority: 'A' | 'B' | 'C';
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  startDate: string;
  endDate: string;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  assignee: string;
  parentId?: string;
  children: string[];
  milestones: Milestone[];
  progress: number;
  bufferTime: number; // 10-20% 여유시간
  kpis: KPI[];
  level: number; // 0: Project, 1: Phase, 2: Task, 3: Subtask
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  isCompleted: boolean;
}

interface KPI {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  tasks: WbsTask[];
  createdAt: string;
}

const WbsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'kanban' | 'gantt' | 'tree'>('kanban');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd')
  });
  const [newTask, setNewTask] = useState<Partial<WbsTask>>({
    title: '',
    description: '',
    type: 'administrative',
    priority: 'B',
    status: 'todo',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    estimatedHours: 8,
    actualHours: 0,
    assignee: '',
    dependencies: [],
    children: [],
    milestones: [],
    progress: 0,
    bufferTime: 15,
    kpis: [],
    level: 2
  });

  useEffect(() => {
    const savedProjects = localStorage.getItem('wbs-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wbs-projects', JSON.stringify(projects));
  }, [projects]);

  const createProject = () => {
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: uuidv4(),
      name: newProject.name,
      description: newProject.description,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      tasks: [],
      createdAt: new Date().toISOString()
    };

    setProjects([...projects, project]);
    setSelectedProject(project);
    setNewProject({
      name: '',
      description: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd')
    });
    setShowNewProjectForm(false);
  };

  const createTask = () => {
    if (!selectedProject || !newTask.title?.trim()) return;

    const task: WbsTask = {
      id: uuidv4(),
      title: newTask.title,
      description: newTask.description || '',
      type: newTask.type || 'administrative',
      priority: newTask.priority || 'B',
      status: newTask.status || 'todo',
      startDate: newTask.startDate || format(new Date(), 'yyyy-MM-dd'),
      endDate: newTask.endDate || format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      estimatedHours: newTask.estimatedHours || 8,
      actualHours: 0,
      assignee: newTask.assignee || '',
      dependencies: [],
      children: [],
      milestones: [],
      progress: 0,
      bufferTime: newTask.bufferTime || 15,
      kpis: [],
      level: newTask.level || 2
    };

    const updatedProject = {
      ...selectedProject,
      tasks: [...selectedProject.tasks, task]
    };

    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    setNewTask({
      title: '',
      description: '',
      type: 'administrative',
      priority: 'B',
      status: 'todo',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      estimatedHours: 8,
      actualHours: 0,
      assignee: '',
      dependencies: [],
      children: [],
      milestones: [],
      progress: 0,
      bufferTime: 15,
      kpis: [],
      level: 2
    });
    setShowNewTaskForm(false);
  };

  const updateTaskStatus = (taskId: string, status: WbsTask['status']) => {
    if (!selectedProject) return;

    const updatedTasks = selectedProject.tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status };
        if (status === 'completed') {
          updatedTask.progress = 100;
        }
        return updatedTask;
      }
      return task;
    });

    const updatedProject = { ...selectedProject, tasks: updatedTasks };
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const updateTaskProgress = (taskId: string, progress: number) => {
    if (!selectedProject) return;

    const updatedTasks = selectedProject.tasks.map(task => {
      if (task.id === taskId) {
        let status = task.status;
        if (progress === 100 && status !== 'completed') {
          status = 'completed';
        } else if (progress > 0 && status === 'todo') {
          status = 'in_progress';
        }
        return { ...task, progress, status };
      }
      return task;
    });

    const updatedProject = { ...selectedProject, tasks: updatedTasks };
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const getTasksByStatus = (status: string) => {
    if (!selectedProject) return [];
    
    let filteredTasks = selectedProject.tasks;

    if (filterStatus !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
    }

    return status === 'all' ? filteredTasks : filteredTasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'A': return '#e74c3c';
      case 'B': return '#f39c12';
      case 'C': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'creative': return '🎨';
      case 'administrative': return '📋';
      case 'communication': return '💬';
      default: return '📋';
    }
  };

  const getProgressPercentage = () => {
    if (!selectedProject || selectedProject.tasks.length === 0) return 0;
    
    const totalProgress = selectedProject.tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / selectedProject.tasks.length);
  };

  const getProjectStats = () => {
    if (!selectedProject) return { total: 0, completed: 0, inProgress: 0, blocked: 0, overdue: 0 };

    const today = new Date();
    const stats = selectedProject.tasks.reduce((acc, task) => {
      acc.total++;
      
      if (task.status === 'completed') acc.completed++;
      else if (task.status === 'in_progress') acc.inProgress++;
      else if (task.status === 'blocked') acc.blocked++;
      
      if (task.status !== 'completed' && new Date(task.endDate) < today) {
        acc.overdue++;
      }
      
      return acc;
    }, { total: 0, completed: 0, inProgress: 0, blocked: 0, overdue: 0 });

    return stats;
  };

  const generateTemplate = (templateType: string) => {
    const templates = {
      software: [
        { title: '요구사항 분석', type: 'administrative', priority: 'A', estimatedHours: 16 },
        { title: '시스템 설계', type: 'creative', priority: 'A', estimatedHours: 24 },
        { title: '데이터베이스 설계', type: 'administrative', priority: 'A', estimatedHours: 12 },
        { title: '프론트엔드 개발', type: 'creative', priority: 'B', estimatedHours: 40 },
        { title: '백엔드 개발', type: 'creative', priority: 'B', estimatedHours: 48 },
        { title: '통합 테스트', type: 'administrative', priority: 'B', estimatedHours: 16 },
        { title: '사용자 테스트', type: 'communication', priority: 'B', estimatedHours: 8 },
        { title: '배포 및 출시', type: 'administrative', priority: 'A', estimatedHours: 8 }
      ],
      marketing: [
        { title: '시장 조사', type: 'administrative', priority: 'A', estimatedHours: 16 },
        { title: '타겟 고객 분석', type: 'administrative', priority: 'A', estimatedHours: 12 },
        { title: '브랜딩 전략 수립', type: 'creative', priority: 'A', estimatedHours: 20 },
        { title: '콘텐츠 제작', type: 'creative', priority: 'B', estimatedHours: 32 },
        { title: '광고 캠페인 기획', type: 'creative', priority: 'B', estimatedHours: 16 },
        { title: '소셜미디어 관리', type: 'communication', priority: 'B', estimatedHours: 24 },
        { title: '성과 분석', type: 'administrative', priority: 'B', estimatedHours: 8 }
      ],
      research: [
        { title: '문헌 조사', type: 'administrative', priority: 'A', estimatedHours: 20 },
        { title: '연구 방법론 설계', type: 'administrative', priority: 'A', estimatedHours: 12 },
        { title: '데이터 수집', type: 'administrative', priority: 'B', estimatedHours: 32 },
        { title: '데이터 분석', type: 'administrative', priority: 'B', estimatedHours: 24 },
        { title: '결과 해석', type: 'creative', priority: 'A', estimatedHours: 16 },
        { title: '보고서 작성', type: 'creative', priority: 'A', estimatedHours: 20 },
        { title: '발표 준비', type: 'communication', priority: 'B', estimatedHours: 8 }
      ]
    };

    if (!selectedProject) return;

    const template = templates[templateType as keyof typeof templates];
    if (!template) return;

    const newTasks = template.map((taskTemplate, index) => ({
      id: uuidv4(),
      title: taskTemplate.title,
      description: '',
      type: taskTemplate.type as WbsTask['type'],
      priority: taskTemplate.priority as WbsTask['priority'],
      status: 'todo' as WbsTask['status'],
      startDate: format(addDays(new Date(), index * 3), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), index * 3 + 7), 'yyyy-MM-dd'),
      estimatedHours: taskTemplate.estimatedHours,
      actualHours: 0,
      assignee: '',
      dependencies: [],
      children: [],
      milestones: [],
      progress: 0,
      bufferTime: 15,
      kpis: [],
      level: 2
    }));

    const updatedProject = {
      ...selectedProject,
      tasks: [...selectedProject.tasks, ...newTasks]
    };

    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const stats = getProjectStats();

  return (
    <div className="wbs-container">
      <div className="wbs-header">
        <h2>WBS 관리</h2>
        <div className="header-actions">
          <button className="new-project-btn" onClick={() => setShowNewProjectForm(true)}>
            + 새 프로젝트
          </button>
        </div>
      </div>

      <div className="wbs-content">
        <div className="projects-sidebar">
          <h3>프로젝트 목록</h3>
          <div className="projects-list">
            {projects.length === 0 ? (
              <div className="empty-state">프로젝트가 없습니다.</div>
            ) : (
              projects.map(project => (
                <div
                  key={project.id}
                  className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                  onClick={() => setSelectedProject(project)}
                >
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                  <div className="project-dates">
                    {project.startDate} ~ {project.endDate}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="wbs-main">
          {showNewProjectForm ? (
            <div className="project-form">
              <h3>새 프로젝트 생성</h3>
              <div className="form-group">
                <label>프로젝트명</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>설명</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>시작일</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>종료일</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="save-btn" onClick={createProject}>생성</button>
                <button className="cancel-btn" onClick={() => setShowNewProjectForm(false)}>취소</button>
              </div>
            </div>
          ) : selectedProject ? (
            <>
              <div className="project-header">
                <div className="project-info">
                  <h3>{selectedProject.name}</h3>
                  <p>{selectedProject.description}</p>
                  <div className="project-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${getProgressPercentage()}%` }}
                      ></div>
                    </div>
                    <span>{getProgressPercentage()}% 완료</span>
                  </div>
                </div>
                <div className="project-actions">
                  <select 
                    value={viewMode} 
                    onChange={(e) => setViewMode(e.target.value as typeof viewMode)}
                  >
                    <option value="kanban">칸반 보드</option>
                    <option value="tree">트리 뷰</option>
                    <option value="gantt">간트 차트</option>
                  </select>
                  <button onClick={() => setShowNewTaskForm(true)}>+ 작업 추가</button>
                </div>
              </div>

              <div className="project-stats">
                <div className="stat-card">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">전체 작업</span>
                </div>
                <div className="stat-card completed">
                  <span className="stat-value">{stats.completed}</span>
                  <span className="stat-label">완료</span>
                </div>
                <div className="stat-card in-progress">
                  <span className="stat-value">{stats.inProgress}</span>
                  <span className="stat-label">진행중</span>
                </div>
                <div className="stat-card blocked">
                  <span className="stat-value">{stats.blocked}</span>
                  <span className="stat-label">블록됨</span>
                </div>
                <div className="stat-card overdue">
                  <span className="stat-value">{stats.overdue}</span>
                  <span className="stat-label">지연</span>
                </div>
              </div>

              <div className="filters">
                <div className="filter-group">
                  <label>상태:</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">전체</option>
                    <option value="todo">할 일</option>
                    <option value="in_progress">진행중</option>
                    <option value="completed">완료</option>
                    <option value="blocked">블록됨</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>우선순위:</label>
                  <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="all">전체</option>
                    <option value="A">A급 (반드시)</option>
                    <option value="B">B급 (해야함)</option>
                    <option value="C">C급 (하면좋음)</option>
                  </select>
                </div>
                <div className="template-actions">
                  <label>템플릿:</label>
                  <button onClick={() => generateTemplate('software')}>소프트웨어</button>
                  <button onClick={() => generateTemplate('marketing')}>마케팅</button>
                  <button onClick={() => generateTemplate('research')}>연구</button>
                </div>
              </div>

              {showNewTaskForm && (
                <div className="task-form">
                  <h4>새 작업 추가</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>작업명</label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>담당자</label>
                      <input
                        type="text"
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>설명</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>유형</label>
                      <select
                        value={newTask.type}
                        onChange={(e) => setNewTask({ ...newTask, type: e.target.value as WbsTask['type'] })}
                      >
                        <option value="creative">창작</option>
                        <option value="administrative">행정</option>
                        <option value="communication">소통</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>우선순위</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as WbsTask['priority'] })}
                      >
                        <option value="A">A급 (반드시)</option>
                        <option value="B">B급 (해야함)</option>
                        <option value="C">C급 (하면좋음)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>시작일</label>
                      <input
                        type="date"
                        value={newTask.startDate}
                        onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>종료일</label>
                      <input
                        type="date"
                        value={newTask.endDate}
                        onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>예상시간 (시간)</label>
                      <input
                        type="number"
                        value={newTask.estimatedHours}
                        onChange={(e) => setNewTask({ ...newTask, estimatedHours: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="save-btn" onClick={createTask}>추가</button>
                    <button className="cancel-btn" onClick={() => setShowNewTaskForm(false)}>취소</button>
                  </div>
                </div>
              )}

              {viewMode === 'kanban' && (
                <div className="kanban-board">
                  <div className="kanban-column">
                    <h4>할 일 ({getTasksByStatus('todo').length})</h4>
                    <div className="kanban-tasks">
                      {getTasksByStatus('todo').map(task => (
                        <div key={task.id} className="kanban-task">
                          <div className="task-header">
                            <span className="task-type">{getTypeIcon(task.type)}</span>
                            <span 
                              className="task-priority" 
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <h5>{task.title}</h5>
                          <p>{task.description}</p>
                          <div className="task-info">
                            <span>👤 {task.assignee || '미배정'}</span>
                            <span>📅 {task.endDate}</span>
                            <span>⏱ {task.estimatedHours}h</span>
                          </div>
                          <div className="task-progress">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={task.progress}
                              onChange={(e) => updateTaskProgress(task.id, Number(e.target.value))}
                            />
                            <span>{task.progress}%</span>
                          </div>
                          <div className="task-actions">
                            <button onClick={() => updateTaskStatus(task.id, 'in_progress')}>
                              시작
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="kanban-column">
                    <h4>진행중 ({getTasksByStatus('in_progress').length})</h4>
                    <div className="kanban-tasks">
                      {getTasksByStatus('in_progress').map(task => (
                        <div key={task.id} className="kanban-task in-progress">
                          <div className="task-header">
                            <span className="task-type">{getTypeIcon(task.type)}</span>
                            <span 
                              className="task-priority" 
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <h5>{task.title}</h5>
                          <p>{task.description}</p>
                          <div className="task-info">
                            <span>👤 {task.assignee || '미배정'}</span>
                            <span>📅 {task.endDate}</span>
                            <span>⏱ {task.estimatedHours}h</span>
                          </div>
                          <div className="task-progress">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={task.progress}
                              onChange={(e) => updateTaskProgress(task.id, Number(e.target.value))}
                            />
                            <span>{task.progress}%</span>
                          </div>
                          <div className="task-actions">
                            <button onClick={() => updateTaskStatus(task.id, 'completed')}>
                              완료
                            </button>
                            <button onClick={() => updateTaskStatus(task.id, 'blocked')}>
                              블록
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="kanban-column">
                    <h4>완료 ({getTasksByStatus('completed').length})</h4>
                    <div className="kanban-tasks">
                      {getTasksByStatus('completed').map(task => (
                        <div key={task.id} className="kanban-task completed">
                          <div className="task-header">
                            <span className="task-type">{getTypeIcon(task.type)}</span>
                            <span 
                              className="task-priority" 
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <h5>{task.title}</h5>
                          <p>{task.description}</p>
                          <div className="task-info">
                            <span>👤 {task.assignee || '미배정'}</span>
                            <span>📅 {task.endDate}</span>
                            <span>⏱ {task.estimatedHours}h</span>
                          </div>
                          <div className="task-progress">
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: '100%' }}></div>
                            </div>
                            <span>완료</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="kanban-column">
                    <h4>블록됨 ({getTasksByStatus('blocked').length})</h4>
                    <div className="kanban-tasks">
                      {getTasksByStatus('blocked').map(task => (
                        <div key={task.id} className="kanban-task blocked">
                          <div className="task-header">
                            <span className="task-type">{getTypeIcon(task.type)}</span>
                            <span 
                              className="task-priority" 
                              style={{ backgroundColor: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <h5>{task.title}</h5>
                          <p>{task.description}</p>
                          <div className="task-info">
                            <span>👤 {task.assignee || '미배정'}</span>
                            <span>📅 {task.endDate}</span>
                            <span>⏱ {task.estimatedHours}h</span>
                          </div>
                          <div className="task-progress">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={task.progress}
                              onChange={(e) => updateTaskProgress(task.id, Number(e.target.value))}
                            />
                            <span>{task.progress}%</span>
                          </div>
                          <div className="task-actions">
                            <button onClick={() => updateTaskStatus(task.id, 'in_progress')}>
                              재개
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-content">
              <p>프로젝트를 선택하거나 새 프로젝트를 생성하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WbsManager;