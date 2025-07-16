import React from 'react';

const MeetingNotes: React.FC = () => {
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
            }}>📝</div>
            
            <div style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
              회의록<br/>
              중요한 회의 내용을 체계적으로 기록하고 관리하세요
            </div>
          </div>
        </div>

        <div style={{ padding: '30px 20px', paddingBottom: '100px' }}>
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
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
          }}>
            ✨ 새 회의록 작성
          </button>

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
              }}>회의록 목록</div>
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
              }}>회의록이 없습니다</h3>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.5,
                margin: 0
              }}>새로운 회의록을 작성해보세요!</p>
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

export default MeetingNotes;