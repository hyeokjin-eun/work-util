import React from 'react';

interface WidgetProps {
  title: string;
  value: string | number;
  label?: string;
  trend?: {
    value: string;
    direction: 'positive' | 'negative' | 'neutral';
  };
  progress?: number;
  children?: React.ReactNode;
  className?: string;
}

const Widget: React.FC<WidgetProps> = ({ 
  title, 
  value, 
  label, 
  trend, 
  progress,
  children,
  className = ''
}) => {
  const getTrendIcon = (direction: string) => {
    if (direction === 'positive') {
      return (
        <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
          <path d="M7 14l5-5 5 5"/>
        </svg>
      );
    } else if (direction === 'negative') {
      return (
        <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
          <path d="M17 10l-5 5-5-5"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`widget ${className}`}>
      <div className="widget-header">
        <div className="widget-title">{title}</div>
      </div>
      <div className="widget-value">{value}</div>
      {label && <div className="widget-label">{label}</div>}
      {progress !== undefined && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
      {trend && (
        <div className={`widget-trend ${trend.direction}`}>
          {getTrendIcon(trend.direction)}
          {trend.value}
        </div>
      )}
      {children}
    </div>
  );
};

export default Widget;