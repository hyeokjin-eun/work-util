import React from 'react';

const WbsManager: React.FC = () => {
  const wbsItems = [
    { id: 1, level: 1, title: '웹사이트 개발 프로젝트', status: 'in-progress', progress: 65 },
    { id: 2, level: 2, title: '프론트엔드 개발', status: 'in-progress', progress: 80 },
    { id: 3, level: 3, title: 'UI/UX 디자인', status: 'completed', progress: 100 },
    { id: 4, level: 3, title: 'React 컴포넌트 개발', status: 'in-progress', progress: 70 },
    { id: 5, level: 2, title: '백엔드 개발', status: 'in-progress', progress: 50 },
    { id: 6, level: 3, title: 'API 개발', status: 'in-progress', progress: 60 },
    { id: 7, level: 3, title: '데이터베이스 설계', status: 'completed', progress: 100 },
    { id: 8, level: 2, title: '테스트 및 배포', status: 'not-started', progress: 0 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'not-started': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'in-progress': return '진행중';
      case 'not-started': return '대기';
      default: return '알 수 없음';
    }
  };

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
            }}>📊</div>
            
            <div style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
              WBS 관리<br/>
              프로젝트를 체계적으로 구조화하고 진행상황을 추적하세요
            </div>
          </div>
        </div>

        <div style={{ padding: '30px 20px', paddingBottom: '100px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#333',
              margin: 0
            }}>프로젝트 현황</h2>
            <button style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              + 추가
            </button>
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
              marginBottom: '15px',
              margin: '0 0 15px 0'
            }}>WBS 구조</h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {wbsItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => alert(`WBS 항목 클릭: ${item.title}`)}
                  style={{
                    padding: '15px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: `4px solid ${item.level === 1 ? '#3b82f6' : item.level === 2 ? '#10b981' : '#f59e0b'}`,
                    marginLeft: `${(item.level - 1) * 20}px`
                  }}
                >
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
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      background: getStatusColor(item.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      {getStatusText(item.status)}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      flex: 1,
                      height: '6px',
                      background: '#e5e7eb',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        background: getStatusColor(item.status),
                        width: `${item.progress}%`,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#666',
                      minWidth: '40px'
                    }}>
                      {item.progress}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {[
              { label: '완료', value: '3', color: '#10b981' },
              { label: '진행중', value: '4', color: '#f59e0b' },
              { label: '대기', value: '1', color: '#ef4444' }
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
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '15px',
              margin: '0 0 15px 0'
            }}>전체 진행률</h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '10px'
            }}>
              <div style={{
                flex: 1,
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: '#3b82f6',
                  width: '65%',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#3b82f6'
              }}>
                65%
              </div>
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#666',
              textAlign: 'center'
            }}>
              8개 작업 중 3개 완료 · 4개 진행중 · 1개 대기
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
              { name: '유틸리티', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z', active: true },
              { name: '대시보드', icon: 'M12 20V10 M18 20V4 M6 20v-4', active: false },
              { name: '캘린더', icon: 'M3 4h18v18H3V4z M16 2v4 M8 2v4 M3 10h18', active: false },
              { name: '마이', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', active: false }
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

export default WbsManager;