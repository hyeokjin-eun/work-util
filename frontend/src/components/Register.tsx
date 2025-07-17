import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // 입력 시 에러 메시지 제거
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '회원가입에 실패했습니다.')
      }

      const data = await response.json()
      
      // Registration successful - store tokens and user info
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('username', data.user.username)
      
      alert('회원가입이 완료되었습니다!')
      navigate('/home') // Navigate directly to home since user is already logged in
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-icon-login animate-float">
            <svg viewBox="0 0 24 24" style={{ width: '32px', height: '32px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
            </svg>
          </div>
          <div className="app-title-login animate-float-delayed">SmartWork</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">사용자명</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="사용자명을 입력하세요"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">이메일</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="이메일 주소를 입력하세요"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">회원가입</button>
        </form>

        <div className="signup-link">
          <span className="signup-text">이미 계정이 있으신가요? </span>
          <Link to="/login" className="signup-button">로그인</Link>
        </div>
      </div>
    </div>
  )
}

export default Register