// API 호출을 위한 공통 유틸리티 함수

interface FetchOptions extends RequestInit {
  token?: string
}

// JWT 토큰 만료 검사 함수
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch {
    return true
  }
}

// 토큰 갱신 함수
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (!refreshToken) {
      return null
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('username', data.user.username)
    
    return data.access_token
  } catch (error) {
    console.error('Token refresh failed:', error)
    return null
  }
}

export const apiCall = async (url: string, options: FetchOptions = {}) => {
  let { token, ...fetchOptions } = options

  // 토큰이 있고 만료되었으면 갱신 시도
  if (token && isTokenExpired(token)) {
    console.log('Token expired, attempting to refresh...')
    const newToken = await refreshAccessToken()
    
    if (newToken) {
      token = newToken
    } else {
      // 갱신 실패 시 로그아웃 처리
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('username')
      // Don't use window.location.href, let the component handle navigation
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
    }
  }

  const headers = {
    ...fetchOptions.headers,
    ...(token && { 'Authorization': `Bearer ${token}` })
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers
  })

  // 401 Unauthorized 에러 처리 (갱신 후에도 401이면 완전한 로그아웃)
  if (response.status === 401) {
    // 토큰 갱신 재시도
    const newToken = await refreshAccessToken()
    
    if (newToken) {
      // 새 토큰으로 재시도
      const retryHeaders = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${newToken}`
      }
      
      const retryResponse = await fetch(url, {
        ...fetchOptions,
        headers: retryHeaders
      })
      
      if (retryResponse.ok) {
        return retryResponse
      }
    }
    
    // 갱신 실패 또는 재시도 실패 시 로그아웃
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('username')
    // Don't use window.location.href, let the component handle navigation
    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
  }

  return response
}

// JSON 응답을 반환하는 API 호출
export const apiCallWithJson = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  const response = await apiCall(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: '알 수 없는 오류가 발생했습니다.' }))
    throw new Error(errorData.detail || errorData.message || '요청 처리 중 오류가 발생했습니다.')
  }

  return response.json()
}