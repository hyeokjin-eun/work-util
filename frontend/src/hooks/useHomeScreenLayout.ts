import { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthContext'
import { apiCall } from '../utils/api'

export interface HomeScreenSection {
  id: string
  type: 'welcome' | 'stats' | 'progress' | 'quickActions' | 'activity'
  title: string
  description: string
  enabled: boolean
  order: number
  settings: {
    [key: string]: any
  }
}

export interface HomeScreenLayout {
  sections: HomeScreenSection[]
}

const defaultLayout: HomeScreenLayout = {
  sections: [
    {
      id: 'welcome',
      type: 'welcome',
      title: '환영 배너',
      description: '현재 시간과 날짜를 표시합니다',
      enabled: true,
      order: 1,
      settings: {
        showTime: true,
        showDate: true,
        showGreeting: true
      }
    },
    {
      id: 'stats',
      type: 'stats',
      title: '통계 현황',
      description: '할일, 완료율, 프로젝트 등 주요 통계를 표시합니다',
      enabled: true,
      order: 2,
      settings: {
        layout: 'grid',
        showAnimations: true,
        showTodos: true,
        showProjects: true,
        showCompletion: true
      }
    },
    {
      id: 'progress',
      type: 'progress',
      title: '진행률 표시',
      description: '전체 진행률을 바 형태로 표시합니다',
      enabled: true,
      order: 3,
      settings: {
        showPercentage: true,
        showDetails: true,
        animateProgress: true
      }
    },
    {
      id: 'quickActions',
      type: 'quickActions',
      title: '빠른 실행',
      description: '자주 사용하는 기능들에 빠르게 접근할 수 있습니다',
      enabled: true,
      order: 4,
      settings: {
        layout: 'grid',
        showIcons: true,
        showDescriptions: true,
        maxItems: 8
      }
    },
    {
      id: 'activity',
      type: 'activity',
      title: '활동 현황',
      description: '최근 활동과 프로젝트 현황을 표시합니다',
      enabled: true,
      order: 5,
      settings: {
        showChart: true,
        showStats: true,
        showRecentActivity: true
      }
    }
  ]
}

export const useHomeScreenLayout = () => {
  const { token, isLoading } = useAuth()
  const [layout, setLayout] = useState<HomeScreenLayout>(defaultLayout)
  const [loading, setLoading] = useState(true)

  const loadLayout = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const response = await apiCall('/api/user/home-screen-layout', {
        method: 'GET',
        token,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const userLayout = await response.json()
        setLayout(userLayout)
      } else {
        // Use default layout if no user preferences exist
        setLayout(defaultLayout)
      }
    } catch (error) {
      console.error('Failed to load home screen layout:', error)
      // Fallback to default layout
      setLayout(defaultLayout)
    } finally {
      setLoading(false)
    }
  }

  const saveLayout = async (newLayout: HomeScreenLayout) => {
    console.log('saveLayout called with token:', token ? 'present' : 'missing')
    console.log('Layout data:', newLayout)
    
    if (!token) {
      console.error('No token available for saving layout')
      return false
    }
    
    try {
      console.log('Making API call to save layout...')
      const response = await apiCall('/api/user/home-screen-layout', {
        method: 'PUT',
        token,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ layout: newLayout })
      })
      
      console.log('API response status:', response.status)
      
      if (response.ok) {
        console.log('Layout saved successfully')
        setLayout(newLayout)
        return true
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        console.error('Failed to save home screen layout:', response.status, errorData)
        return false
      }
    } catch (error) {
      console.error('Failed to save home screen layout:', error)
      return false
    }
  }

  const resetToDefaults = async () => {
    return await saveLayout(defaultLayout)
  }

  const updateLayout = (updates: Partial<HomeScreenLayout>) => {
    setLayout(prev => ({ ...prev, ...updates }))
  }

  useEffect(() => {
    if (!isLoading && token) {
      loadLayout()
    }
  }, [isLoading, token])

  return {
    layout,
    loading,
    saveLayout,
    resetToDefaults,
    updateLayout,
    reloadLayout: loadLayout
  }
}