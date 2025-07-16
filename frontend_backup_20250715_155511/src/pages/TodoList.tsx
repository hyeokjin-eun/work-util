import React from 'react';

const TodoList: React.FC = () => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      color: '#333',
      overflowX: 'hidden',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        background: 'white',
        minHeight: '100vh',
        position: 'relative',
        boxShadow: '0 0 30px rgba(59, 130, 246, 0.1)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          padding: '50px 20px 30px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            animation: 'float 20s linear infinite'
          }}></div>
          
          <style>
            {`
              @keyframes float {
                0% { transform: translateY(0) rotate(0deg); }
                100% { transform: translateY(-20px) rotate(360deg); }
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
            `}
          </style>

          <div style={{
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '30px'
            }}>
              <h1 style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                margin: 0
              }}>SmartWork</h1>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>T</div>
            </div>
            
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              transition: 'all 0.3s ease',
              animation: 'pulse 2s infinite'
            }}>
              <svg viewBox="0 0 24 24" style={{
                width: '40px',
                height: '40px',
                stroke: 'white',
                strokeWidth: 3,
                fill: 'none'
              }}>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            
            <div style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
              ✓ 할일 관리<br/>
              우선순위와 마감일을 설정하여 체계적으로 업무를 관리하세요
            </div>
          </div>
        </div>

        <div style={{
          padding: '30px 20px'
        }}>
          <button style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            padding: '18px 24px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 600,
            width: '100%',
            marginBottom: '30px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            ✨ 새 할일 추가
          </button>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '25px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.1)'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#2d3748',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                width: '4px',
                height: '20px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '2px',
                marginRight: '10px'
              }}></div>
              필터 및 정렬
            </div>
            
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#4a5568',
                marginBottom: '8px'
              }}>상태별 필터</label>
              <select style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px',
                paddingRight: '40px'
              }}>
                <option>전체</option>
                <option>진행중</option>
                <option>완료</option>
                <option>대기</option>
              </select>
            </div>

            <div style={{
              marginBottom: '0'
            }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#4a5568',
                marginBottom: '8px'
              }}>정렬</label>
              <select style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px',
                paddingRight: '40px'
              }}>
                <option>우선순위</option>
                <option>마감일</option>
                <option>생성일</option>
                <option>알파벳순</option>
              </select>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            marginBottom: '100px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#2d3748',
                marginRight: '10px'
              }}>할일 목록</div>
              <div style={{
                background: '#ef4444',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600
              }}>0</div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#a0aec0'
            }}>
              <svg viewBox="0 0 24 24" style={{
                width: '80px',
                height: '80px',
                marginBottom: '20px',
                stroke: '#cbd5e0',
                strokeWidth: 1,
                fill: 'none'
              }}>
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3 style={{
                fontSize: '16px',
                marginBottom: '8px',
                color: '#718096',
                margin: '0 0 8px 0'
              }}>할일이 없습니다</h3>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.5,
                margin: 0
              }}>새로운 할일을 추가해보세요!</p>
            </div>
          </div>
        </div>

        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '400px',
          background: 'white',
          borderTop: '1px solid rgba(59, 130, 246, 0.1)',
          padding: '12px 0',
          boxShadow: '0 -5px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            <a href="#" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#3b82f6',
              background: 'rgba(59, 130, 246, 0.1)',
              transition: 'all 0.3s ease',
              padding: '8px 12px',
              borderRadius: '12px',
              minWidth: '60px'
            }}>
              <svg viewBox="0 0 24 24" style={{
                width: '24px',
                height: '24px',
                marginBottom: '4px',
                stroke: 'currentColor',
                fill: 'none',
                strokeWidth: 2
              }}>
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              <span style={{
                fontSize: '12px',
                fontWeight: 500
              }}>홈</span>
            </a>
            <a href="#" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#a0aec0',
              transition: 'all 0.3s ease',
              padding: '8px 12px',
              borderRadius: '12px',
              minWidth: '60px'
            }}>
              <svg viewBox="0 0 24 24" style={{
                width: '24px',
                height: '24px',
                marginBottom: '4px',
                stroke: 'currentColor',
                fill: 'none',
                strokeWidth: 2
              }}>
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              <span style={{
                fontSize: '12px',
                fontWeight: 500
              }}>유틸리티</span>
            </a>
            <a href="#" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#a0aec0',
              transition: 'all 0.3s ease',
              padding: '8px 12px',
              borderRadius: '12px',
              minWidth: '60px'
            }}>
              <svg viewBox="0 0 24 24" style={{
                width: '24px',
                height: '24px',
                marginBottom: '4px',
                stroke: 'currentColor',
                fill: 'none',
                strokeWidth: 2
              }}>
                <path d="M12 20V10"/>
                <path d="M18 20V4"/>
                <path d="M6 20v-4"/>
              </svg>
              <span style={{
                fontSize: '12px',
                fontWeight: 500
              }}>대시보드</span>
            </a>
            <a href="#" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#a0aec0',
              transition: 'all 0.3s ease',
              padding: '8px 12px',
              borderRadius: '12px',
              minWidth: '60px'
            }}>
              <svg viewBox="0 0 24 24" style={{
                width: '24px',
                height: '24px',
                marginBottom: '4px',
                stroke: 'currentColor',
                fill: 'none',
                strokeWidth: 2
              }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span style={{
                fontSize: '12px',
                fontWeight: 500
              }}>캘린더</span>
            </a>
            <a href="#" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#a0aec0',
              transition: 'all 0.3s ease',
              padding: '8px 12px',
              borderRadius: '12px',
              minWidth: '60px'
            }}>
              <svg viewBox="0 0 24 24" style={{
                width: '24px',
                height: '24px',
                marginBottom: '4px',
                stroke: 'currentColor',
                fill: 'none',
                strokeWidth: 2
              }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span style={{
                fontSize: '12px',
                fontWeight: 500
              }}>마이</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;