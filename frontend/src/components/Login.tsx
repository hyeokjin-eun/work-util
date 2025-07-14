import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';
const logoImage = '/work_util_logo.png';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ username, password });
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.detail || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-app">
      <div className="auth-main-content">
        <div className="auth-card">
          <div className="auth-logo">
            <img src={logoImage} alt="Work Util Logo" className="logo-image" />
          </div>
          <h2 className="auth-card-title">로그인</h2>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                사용자명 또는 이메일
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="form-input"
                placeholder="이메일 주소를 입력하세요"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="form-input"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-signup-text">
              아직 계정이 없으신가요? <Link to="/register" className="auth-link">회원가입</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;