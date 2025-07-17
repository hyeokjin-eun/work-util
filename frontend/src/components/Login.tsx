import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import LogoIntro from './LogoIntro'
import { useIntro } from '../hooks/useIntro'
import '../styles/Auth.css'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const { hasSeenIntro, markIntroAsSeen } = useIntro()

  useEffect(() => {
    if (token) {
      navigate('/home')
    }
  }, [token, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(username, password)
    } catch (err) {
      setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
    }
  }

  const handleIntroComplete = () => {
    markIntroAsSeen()
  }

  if (!hasSeenIntro) {
    return <LogoIntro onComplete={handleIntroComplete} />
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
            <label className="form-label">사용자명 또는 이메일</label>
            <input
              type="text"
              className="form-input"
              placeholder="이메일 주소를 입력하세요"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (error) setError('') // 입력 시 에러 메시지 제거
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              className="form-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('') // 입력 시 에러 메시지 제거
              }}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">로그인</button>
        </form>

        <div className="signup-link">
          <span className="signup-text">아직 계정이 없으신가요? </span>
          <Link to="/register" className="signup-button">회원가입</Link>
        </div>
      </div>
    </div>
  )
}

export default Login