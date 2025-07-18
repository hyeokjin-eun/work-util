import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { apiCall } from '../utils/api'
import { getQuickActionIcon } from '../utils/icons'

interface QuickAction {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  path: string
  color: 'primary' | 'secondary' | 'accent' | 'info' | 'warning' | 'success'
  enabled: boolean
  order: number
}

interface QuickActionCustomizerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (actions: QuickAction[]) => void
  currentActions: QuickAction[]
}

const QuickActionCustomizer: React.FC<QuickActionCustomizerProps> = ({
  isOpen,
  onClose,
  onSave,
  currentActions
}) => {
  const { token } = useAuth()
  const [actions, setActions] = useState<QuickAction[]>(currentActions)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setActions(currentActions)
  }, [currentActions])

  const handleToggleAction = (id: string) => {
    setActions(prev => 
      prev.map(action => 
        action.id === id ? { ...action, enabled: !action.enabled } : action
      )
    )
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null) return

    const newActions = [...actions]
    const draggedAction = newActions[draggedIndex]
    
    newActions.splice(draggedIndex, 1)
    newActions.splice(dropIndex, 0, draggedAction)
    
    // Update order property
    const updatedActions = newActions.map((action, index) => ({
      ...action,
      order: index
    }))
    
    setActions(updatedActions)
    setDraggedIndex(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save to backend
      await apiCall('/api/user/quick-actions', {
        method: 'PUT',
        token,
        body: JSON.stringify({ actions })
      })
      
      onSave(actions)
      onClose()
    } catch (error) {
      console.error('Failed to save quick actions:', error)
    } finally {
      setSaving(false)
    }
  }

  const getColorClass = (color: string) => {
    const colorMap = {
      primary: '#3b82f6',
      secondary: '#6b7280',
      accent: '#f59e0b',
      info: '#06b6d4',
      warning: '#eab308',
      success: '#10b981'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.primary
  }

  if (!isOpen) return null

  return (
    <div className="quick-action-customizer-overlay">
      <div className="quick-action-customizer-modal">
        <div className="customizer-header">
          <h3>빠른 실행 메뉴 사용자 지정</h3>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="customizer-content">
          <div className="customizer-instructions">
            <p>아래 항목들을 드래그하여 순서를 변경하거나 체크박스를 클릭하여 표시/숨김을 설정하세요.</p>
          </div>
          
          <div className="actions-list">
            {actions.map((action, index) => (
              <div
                key={action.id}
                className={`action-item ${!action.enabled ? 'disabled' : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="action-drag-handle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </div>
                
                <div className="action-preview">
                  <div 
                    className="action-icon-preview"
                    style={{ backgroundColor: getColorClass(action.color) }}
                  >
                    {getQuickActionIcon(action.id)}
                  </div>
                  <div className="action-info">
                    <div className="action-title">{action.title}</div>
                    <div className="action-subtitle">{action.subtitle}</div>
                  </div>
                </div>
                
                <div className="action-controls">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={action.enabled}
                      onChange={() => handleToggleAction(action.id)}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="customizer-footer">
          <button className="btn-secondary" onClick={onClose}>
            취소
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuickActionCustomizer