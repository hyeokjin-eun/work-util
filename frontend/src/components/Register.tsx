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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      // Mock registration - in production, this would call your backend API
      alert('회원가입이 완료되었습니다!')
      navigate('/login')
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="app-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" fill="#3b82f6" opacity="0.1"/>
              <path d="M100 40 L130 70 L130 110 L100 140 L70 110 L70 70 Z" fill="#3b82f6"/>
              <circle cx="100" cy="90" r="20" fill="white"/>
            </svg>
          </div>
          <div className="app-title">SmartWork</div>
        </div>

        <div className="login-title">회원가입</div>
        <div className="login-subtitle">새 계정을 만들어보세요</div>

        <form onSubmit={handleSubmit} className="auth-form">
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