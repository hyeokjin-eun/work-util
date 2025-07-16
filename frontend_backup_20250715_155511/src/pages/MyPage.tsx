import React from 'react';

const MyPage: React.FC = () => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      color: '#333',
      overflowX: 'hidden'
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
          <style>
            {`@keyframes float { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-20px) rotate(360deg); } }`}
          </style>
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
          
          <div style={{ position: 'relative', zIndex: 2 }}>
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
              fontSize: '40px'
            }}>👤</div>
            
            <div style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
              마이페이지<br/>
              안녕하세요, test님! 계정 정보와 통계를 확인하세요
            </div>
          </div>
        </div>

        <div style={{ padding: '30px 20px', paddingBottom: '100px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '15px',
            marginBottom: '30px'
          }}>
            {[
              { value: '0', label: '완료 작업', color: '#10b981' },
              { value: '0', label: '진행 중', color: '#f59e0b' },
              { value: '0', label: '총 작업', color: '#3b82f6' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '15px 10px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                borderTop: `3px solid ${stat.color}`
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: stat.color,
                  marginBottom: '5px'
                }}>{stat.value}</div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  fontWeight: 500
                }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '20px',
              margin: '0 0 20px 0'
            }}>빠른 실행</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px'
            }}>
              {[
                { title: '새 할일', icon: '✓', color: '#3b82f6' },
                { title: '회의록', icon: '📝', color: '#10b981' },
                { title: 'JSON 도구', icon: '🔧', color: '#f59e0b' },
                { title: 'QR 생성', icon: '📱', color: '#8b5cf6' }
              ].map((action, index) => (
                <div key={index} style={{
                  background: '#f8fafc',
                  borderRadius: '10px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: action.color,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                    fontSize: '20px',
                    color: 'white'
                  }}>{action.icon}</div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#333'
                  }}>{action.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '20px',
              margin: '0 0 20px 0'
            }}>활동 요약</h3>
            
            <div style={{
              textAlign: 'center',
              padding: '20px 0',
              color: '#a0aec0'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '10px'
              }}>📊</div>
              <div style={{
                fontSize: '16px',
                color: '#718096',
                marginBottom: '5px'
              }}>최근 활동이 없습니다</div>
              <div style={{
                fontSize: '14px',
                color: '#a0aec0'
              }}>작업을 시작해보세요!</div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '20px',
              margin: '0 0 20px 0'
            }}>계정 설정</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { title: '프로필 수정', icon: '👤' },
                { title: '알림 설정', icon: '🔔' },
                { title: '테마 설정', icon: '🎨' },
                { title: '데이터 백업', icon: '💾' },
                { title: '로그아웃', icon: '🚪' }
              ].map((setting, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < 4 ? '1px solid #f1f5f9' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '20px',
                    marginRight: '15px',
                    width: '24px',
                    textAlign: 'center'
                  }}>{setting.icon}</div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#333',
                    flex: 1
                  }}>{setting.title}</div>
                  <div style={{
                    fontSize: '16px',
                    color: '#cbd5e0'
                  }}>›</div>
                </div>
              ))}
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
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {[
              { name: '홈', icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', active: false },
              { name: '유틸리티', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z', active: false },
              { name: '대시보드', icon: 'M12 20V10 M18 20V4 M6 20v-4', active: false },
              { name: '캘린더', icon: 'M3 4h18v18H3V4z M16 2v4 M8 2v4 M3 10h18', active: false },
              { name: '마이', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', active: true }
            ].map((item, index) => (
              <a key={index} href="#" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: item.active ? '#3b82f6' : '#a0aec0',
                background: item.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
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
                  <path d={item.icon}/>
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;