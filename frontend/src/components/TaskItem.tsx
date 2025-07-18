import React from 'react';

interface TaskItemProps {
  title: string;
  meta?: string;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
  onToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  title, 
  meta, 
  completed = false,
  priority = 'medium',
  onToggle,
  onClick,
  className = ''
}) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.();
  };

  return (
    <div 
      className={`task-item ${className}`}
      onClick={onClick}
    >
      <div 
        className={`task-checkbox ${completed ? 'checked' : ''}`}
        onClick={handleCheckboxClick}
      />
      <div className="task-content">
        <div className="task-title">{title}</div>
        {meta && <div className="task-meta">{meta}</div>}
      </div>
      <div className={`task-priority ${priority}`} />
    </div>
  );
};

export default TaskItem;