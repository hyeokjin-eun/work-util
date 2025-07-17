import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  username: string
  email?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    const storedUsername = localStorage.getItem('username')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    
    if (storedToken && storedUsername) {
      setToken(storedToken)
      setUser({ username: storedUsername })
    }
    
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '로그인에 실패했습니다.')
      }

      const data = await response.json()
      
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('username', data.user.username)
      
      setToken(data.access_token)
      setUser({ username: data.user.username, email: data.user.email })
      
      // Scroll to top after login
      window.scrollTo(0, 0)
      
      navigate('/home')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem('refresh_token')
      
      if (!storedRefreshToken) {
        return false
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('username', data.user.username)
      
      setToken(data.access_token)
      setUser({ username: data.user.username, email: data.user.email })
      
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}