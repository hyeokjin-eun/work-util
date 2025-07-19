import { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthContext'
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

const defaultQuickActions: Omit<QuickAction, 'icon'>[] = [
  {
    id: 'new-todo',
    title: '새 할일 추가',
    subtitle: '작업을 추가하세요',
    path: '/todo',
    color: 'primary',
    enabled: true,
    order: 0
  },
  {
    id: 'meeting-notes',
    title: '회의록 작성',
    subtitle: '회의 내용을 기록하세요',
    path: '/meeting-notes',
    color: 'secondary',
    enabled: true,
    order: 1
  },
  {
    id: 'json-formatter',
    title: 'JSON 포맷팅',
    subtitle: '데이터를 정리하세요',
    path: '/json-formatter',
    color: 'accent',
    enabled: true,
    order: 2
  },
  {
    id: 'wbs',
    title: 'WBS 관리',
    subtitle: '프로젝트를 구조화하세요',
    path: '/wbs',
    color: 'info',
    enabled: true,
    order: 3
  },
  {
    id: 'json-compare',
    title: 'JSON 비교',
    subtitle: '데이터를 비교하세요',
    path: '/json-compare',
    color: 'warning',
    enabled: false,
    order: 4
  },
  {
    id: 'qr-generator',
    title: 'QR 생성',
    subtitle: 'QR 코드를 만드세요',
    path: '/qr-generator',
    color: 'success',
    enabled: false,
    order: 5
  },
  {
    id: 'calendar',
    title: '캘린더',
    subtitle: '일정을 확인하세요',
    path: '/calendar',
    color: 'primary',
    enabled: false,
    order: 6
  },
  {
    id: 'utilities',
    title: '유틸리티',
    subtitle: '도구 모음을 사용하세요',
    path: '/utilities',
    color: 'info',
    enabled: false,
    order: 7
  }
]

export const useQuickActions = () => {
  const { token, isLoading } = useAuth()
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const [loading, setLoading] = useState(true)

  // Icon mapping function
  const getIcon = (actionId: string): React.ReactNode => {
    return getQuickActionIcon(actionId)
  }

  const loadQuickActions = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const response = await apiCall('/api/user/quick-actions', {
        method: 'GET',
        token
      })
      
      if (response.ok) {
        const userActions = await response.json()
        
        // Check if userActions is null or empty (no saved preferences)
        if (!userActions || userActions.length === 0) {
          // Use default actions
          const defaultActionsWithIcons = defaultQuickActions.map(action => ({
            ...action,
            icon: getIcon(action.id)
          }))
          setQuickActions(defaultActionsWithIcons)
        } else {
          // Use saved user actions
          const actionsWithIcons = userActions.map((action: Omit<QuickAction, 'icon'>) => ({
            ...action,
            icon: getIcon(action.id)
          }))
          setQuickActions(actionsWithIcons)
        }
      } else {
        // If no user preferences exist, use defaults
        const defaultActionsWithIcons = defaultQuickActions.map(action => ({
          ...action,
          icon: getIcon(action.id)
        }))
        setQuickActions(defaultActionsWithIcons)
      }
    } catch (error) {
      console.error('Failed to load quick actions:', error)
      // Fallback to default actions
      const defaultActionsWithIcons = defaultQuickActions.map(action => ({
        ...action,
        icon: getIcon(action.id)
      }))
      setQuickActions(defaultActionsWithIcons)
    } finally {
      setLoading(false)
    }
  }

  const saveQuickActions = async (actions: QuickAction[]) => {
    if (!token) return false
    
    try {
      const actionsToSave = actions.map(({ icon, ...action }) => action)
      
      const response = await apiCall('/api/user/quick-actions', {
        method: 'PUT',
        token,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ actions: actionsToSave })
      })
      
      if (response.ok) {
        // Reload data from API to ensure synchronization
        await loadQuickActions()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to save quick actions:', error)
      return false
    }
  }

  const getEnabledActions = () => {
    return quickActions
      .filter(action => action.enabled)
      .sort((a, b) => a.order - b.order)
  }

  const resetToDefaults = async () => {
    const defaultActionsWithIcons = defaultQuickActions.map(action => ({
      ...action,
      icon: getIcon(action.id)
    }))
    return await saveQuickActions(defaultActionsWithIcons)
  }

  useEffect(() => {
    if (!isLoading && token) {
      loadQuickActions()
    }
  }, [isLoading, token])

  return {
    quickActions,
    loading,
    getEnabledActions,
    saveQuickActions,
    resetToDefaults,
    reloadQuickActions: loadQuickActions
  }
}