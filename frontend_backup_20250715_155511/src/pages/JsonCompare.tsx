import React, { useState } from 'react';

const JsonCompare: React.FC = () => {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [result, setResult] = useState('');

  const compareJson = () => {
    try {
      const parsed1 = JSON.parse(json1);
      const parsed2 = JSON.parse(json2);
      
      if (JSON.stringify(parsed1) === JSON.stringify(parsed2)) {
        setResult('✅ JSON 데이터가 동일합니다.');
      } else {
        setResult('❌ JSON 데이터가 다릅니다.');
      }
    } catch (error) {
      setResult('❌ 유효하지 않은 JSON 형식입니다.');
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
            }}>🔍</div>
            
            <div style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
              JSON 비교<br/>
              두 JSON 데이터의 차이점을 빠르게 비교하세요
            </div>
          </div>
        </div>

        <div style={{ padding: '30px 20px', paddingBottom: '100px' }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '15px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '15px',
              margin: '0 0 15px 0'
            }}>JSON 1</h3>
            
            <textarea
              value={json1}
              onChange={(e) => setJson1(e.target.value)}
              placeholder="첫 번째 JSON 데이터를 입력하세요..."
              style={{
                width: '100%',
                height: '100px',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'monospace',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '15px',
              margin: '0 0 15px 0'
            }}>JSON 2</h3>
            
            <textarea
              value={json2}
              onChange={(e) => setJson2(e.target.value)}
              placeholder="두 번째 JSON 데이터를 입력하세요..."
              style={{
                width: '100%',
                height: '100px',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'monospace',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <button 
              onClick={compareJson}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              🔍 비교하기
            </button>
            <button 
              onClick={() => { setJson1(''); setJson2(''); setResult(''); }}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              🗑️ 초기화
            </button>
          </div>

          {result && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#333',
                marginBottom: '15px',
                margin: '0 0 15px 0'
              }}>비교 결과</h3>
              
              <div style={{
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                textAlign: 'center',
                color: result.includes('✅') ? '#10b981' : '#ef4444',
                fontWeight: 500
              }}>
                {result}
              </div>
            </div>
          )}

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '15px',
              margin: '0 0 15px 0'
            }}>샘플 데이터</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <button 
                onClick={() => {
                  setJson1('{"name":"John","age":30,"city":"New York"}');
                  setJson2('{"name":"John","age":30,"city":"New York"}');
                }}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                동일한 데이터
              </button>
              <button 
                onClick={() => {
                  setJson1('{"name":"John","age":30,"city":"New York"}');
                  setJson2('{"name":"Jane","age":25,"city":"Los Angeles"}');
                }}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                다른 데이터
              </button>
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

export default JsonCompare;