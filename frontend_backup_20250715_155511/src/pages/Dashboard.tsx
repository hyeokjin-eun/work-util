import React from 'react';

const Dashboard: React.FC = () => {
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'end',
              gap: '8px',
              marginBottom: '30px'
            }}>
              <svg viewBox="0 0 24 24" style={{
                width: '60px',
                height: '60px',
                stroke: 'white',
                fill: 'none',
                strokeWidth: 2
              }}>
                <path d="M12 20V10"/>
                <path d="M18 20V4"/>
                <path d="M6 20v-4"/>
              </svg>
            </div>
            
            <div style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
              대시보드<br/>
              좋은 저녁입니다, test님! 오늘도 생산적인 하루 보내세요
            </div>
          </div>
        </div>

        <div style={{
          padding: '30px 20px',
          paddingBottom: '100px',
          background: '#f8fafc'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#3b82f6',
                marginBottom: '5px'
              }}>0</div>
              <div style={{
                fontSize: '14px',
                color: '#666',
                fontWeight: 500
              }}>전체 할일</div>
            </div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#3b82f6',
                marginBottom: '5px'
              }}>0</div>
              <div style={{
                fontSize: '14px',
                color: '#666',
                fontWeight: 500
              }}>완료된 할일</div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            borderLeft: '4px solid #3b82f6',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#3b82f6',
              marginBottom: '5px'
            }}>0%</div>
            <div style={{
              fontSize: '14px',
              color: '#666',
              fontWeight: 500
            }}>완료율</div>
          </div>

          <div style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#333',
            marginBottom: '15px',
            marginTop: '10px'
          }}>오늘의 진행률</div>
          
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            marginBottom: '20px'
          }}>
            <div style={{
              marginBottom: '15px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333'
                }}>할일 완료율</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#3b82f6'
                }}>0%</div>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: '#3b82f6',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                  width: '0%'
                }}></div>
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                marginTop: '5px'
              }}>0/0 완료</div>
            </div>
          </div>

          <div style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#333',
            marginBottom: '15px',
            marginTop: '10px'
          }}>빠른 실행</div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#3b82f6',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: '24px',
                color: 'white'
              }}>✓</div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#333'
              }}>새 할일 추가</div>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#10b981',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: '24px',
                color: 'white'
              }}>📝</div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#333'
              }}>회의록 작성</div>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#f59e0b',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: '24px',
                color: 'white'
              }}>🔧</div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#333'
              }}>JSON 포맷팅</div>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#8b5cf6',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: '24px',
                color: 'white'
              }}>📱</div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#333'
              }}>QR 코드 생성</div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div style={{
                fontSize: '18px',
                marginRight: '8px'
              }}>📊</div>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#333'
              }}>최근 활동</div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '20px'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '15px'
              }}>활동 요약</div>
              <div style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '15px'
              }}>최근 활동 없음</div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                gap: '20px'
              }}>
                <div style={{
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#3b82f6',
                    marginBottom: '5px'
                  }}>0</div>
                  <div style={{
                    fontSize: '12px',
                    color: '#666'
                  }}>회의록</div>
                </div>
                <div style={{
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#3b82f6',
                    marginBottom: '5px'
                  }}>0</div>
                  <div style={{
                    fontSize: '12px',
                    color: '#666'
                  }}>프로젝트</div>
                </div>
              </div>
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

export default Dashboard;