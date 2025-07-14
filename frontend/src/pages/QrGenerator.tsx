import React, { useState, useCallback, useRef } from 'react';
import QRCode from 'qrcode';
import '../styles/QrGenerator.css';

interface QROptions {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  type: 'image/png' | 'image/jpeg';
  quality: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  width: number;
}

const QrGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrOptions, setQrOptions] = useState<QROptions>({
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 256
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = useCallback(async () => {
    if (!inputText.trim()) {
      setError('텍스트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, inputText, {
          errorCorrectionLevel: qrOptions.errorCorrectionLevel,
          margin: qrOptions.margin,
          color: qrOptions.color,
          width: qrOptions.width
        });

        const dataUrl = canvas.toDataURL(qrOptions.type, qrOptions.quality);
        setQrCodeUrl(dataUrl);
      }
    } catch (err) {
      setError('QR 코드 생성에 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, qrOptions]);

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `qrcode.${qrOptions.type.split('/')[1]}`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      alert('QR 코드가 클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  const loadPresets = (type: string) => {
    switch (type) {
      case 'url':
        setInputText('https://example.com');
        break;
      case 'email':
        setInputText('mailto:user@example.com');
        break;
      case 'phone':
        setInputText('tel:+82-10-1234-5678');
        break;
      case 'sms':
        setInputText('sms:+82-10-1234-5678?body=안녕하세요');
        break;
      case 'wifi':
        setInputText('WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;');
        break;
      case 'vcard':
        setInputText('BEGIN:VCARD\nVERSION:3.0\nFN:김철수\nORG:회사명\nTEL:+82-10-1234-5678\nEMAIL:kim@example.com\nEND:VCARD');
        break;
      default:
        setInputText('');
    }
  };

  const clearAll = () => {
    setInputText('');
    setQrCodeUrl('');
    setError('');
  };

  React.useEffect(() => {
    if (inputText.trim()) {
      const timer = setTimeout(() => {
        generateQRCode();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setQrCodeUrl('');
      setError('');
    }
  }, [inputText, generateQRCode]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-icon">📱</div>
        <h1 className="page-title">QR 생성기</h1>
        <p className="page-subtitle">다양한 형식의 QR 코드를 쉽게 생성하고 커스터마이징하세요</p>
      </div>

      <div className="action-section">
        <button className="btn-secondary" onClick={clearAll}>
          <span className="btn-icon">🗑️</span>
          전체 지우기
        </button>
      </div>

      <div className="section">
        <h3 className="section-title">텍스트 입력</h3>
        <div className="form-grid">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="URL, 텍스트, 이메일, 전화번호 등을 입력하세요..."
            className="form-textarea"
            rows={5}
          />
          <div className="character-count">
            문자 수: {inputText.length}
          </div>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">빠른 입력 템플릿</h3>
        <div className="preset-grid">
          <button className="btn-secondary" onClick={() => loadPresets('url')}>
            <span className="btn-icon">🌐</span>
            웹사이트 URL
          </button>
          <button className="btn-secondary" onClick={() => loadPresets('email')}>
            <span className="btn-icon">📧</span>
            이메일
          </button>
          <button className="btn-secondary" onClick={() => loadPresets('phone')}>
            <span className="btn-icon">📞</span>
            전화번호
          </button>
          <button className="btn-secondary" onClick={() => loadPresets('sms')}>
            <span className="btn-icon">💬</span>
            SMS
          </button>
          <button className="btn-secondary" onClick={() => loadPresets('wifi')}>
            <span className="btn-icon">📶</span>
            WiFi
          </button>
          <button className="btn-secondary" onClick={() => loadPresets('vcard')}>
            <span className="btn-icon">👤</span>
            연락처 (vCard)
          </button>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">QR 코드 설정</h3>
        <div className="qr-options-grid">
          <div className="option-group">
            <label className="form-label">오류 정정 수준</label>
            <select
              value={qrOptions.errorCorrectionLevel}
              onChange={(e) => setQrOptions({
                ...qrOptions,
                errorCorrectionLevel: e.target.value as QROptions['errorCorrectionLevel']
              })}
              className="form-select"
            >
              <option value="L">낮음 (~7%)</option>
              <option value="M">중간 (~15%)</option>
              <option value="Q">높음 (~25%)</option>
              <option value="H">최고 (~30%)</option>
            </select>
          </div>

          <div className="option-group">
            <label className="form-label">크기: {qrOptions.width}px</label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={qrOptions.width}
              onChange={(e) => setQrOptions({
                ...qrOptions,
                width: Number(e.target.value)
              })}
              className="form-range"
            />
          </div>

          <div className="option-group">
            <label className="form-label">여백: {qrOptions.margin}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={qrOptions.margin}
              onChange={(e) => setQrOptions({
                ...qrOptions,
                margin: Number(e.target.value)
              })}
              className="form-range"
            />
          </div>

          <div className="color-options">
            <div className="color-group">
              <label className="form-label">전경색</label>
              <input
                type="color"
                value={qrOptions.color.dark}
                onChange={(e) => setQrOptions({
                  ...qrOptions,
                  color: { ...qrOptions.color, dark: e.target.value }
                })}
                className="form-color"
              />
            </div>
            <div className="color-group">
              <label className="form-label">배경색</label>
              <input
                type="color"
                value={qrOptions.color.light}
                onChange={(e) => setQrOptions({
                  ...qrOptions,
                  color: { ...qrOptions.color, light: e.target.value }
                })}
                className="form-color"
              />
            </div>
          </div>

          <div className="option-group">
            <label className="form-label">파일 형식</label>
            <select
              value={qrOptions.type}
              onChange={(e) => setQrOptions({
                ...qrOptions,
                type: e.target.value as QROptions['type']
              })}
              className="form-select"
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
            </select>
          </div>

          {qrOptions.type === 'image/jpeg' && (
            <div className="option-group">
              <label className="form-label">품질: {Math.round(qrOptions.quality * 100)}%</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={qrOptions.quality}
                onChange={(e) => setQrOptions({
                  ...qrOptions,
                  quality: Number(e.target.value)
                })}
                className="form-range"
              />
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">QR 코드 미리보기</h3>
        
        {error && (
          <div className="notification notification-error">
            <span className="notification-icon">❌</span>
            {error}
          </div>
        )}

        {isLoading && (
          <div className="notification notification-info">
            <span className="notification-icon">⏳</span>
            QR 코드 생성 중...
          </div>
        )}

        <div className="qr-display">
          <canvas
            ref={canvasRef}
            style={{ display: qrCodeUrl ? 'block' : 'none' }}
            className="qr-canvas"
          />
          {!qrCodeUrl && !isLoading && !error && (
            <div className="empty-state">
              <div className="empty-state-icon">📱</div>
              <div className="empty-state-text">텍스트를 입력하면 QR 코드가 생성됩니다.</div>
            </div>
          )}
        </div>

        {qrCodeUrl && (
          <div className="qr-actions">
            <button className="btn-primary" onClick={downloadQRCode}>
              <span className="btn-icon">💾</span>
              다운로드
            </button>
            <button className="btn-secondary" onClick={copyToClipboard}>
              <span className="btn-icon">📋</span>
              클립보드에 복사
            </button>
          </div>
        )}
      </div>

      <div className="section">
        <h3 className="section-title">
          <span className="section-icon">ℹ️</span>
          QR 코드 정보
        </h3>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">📏</div>
            <div className="info-content">
              <span className="info-label">입력 길이</span>
              <span className="info-value">{inputText.length} 문자</span>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">📐</div>
            <div className="info-content">
              <span className="info-label">크기</span>
              <span className="info-value">{qrOptions.width} × {qrOptions.width}px</span>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">🔧</div>
            <div className="info-content">
              <span className="info-label">오류 정정</span>
              <span className="info-value">{qrOptions.errorCorrectionLevel} 수준</span>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">🗂️</div>
            <div className="info-content">
              <span className="info-label">파일 형식</span>
              <span className="info-value">{qrOptions.type.split('/')[1].toUpperCase()}</span>
            </div>
          </div>
          {qrCodeUrl && (
            <div className="info-card">
              <div className="info-icon">💽</div>
              <div className="info-content">
                <span className="info-label">파일 크기</span>
                <span className="info-value">{Math.round(qrCodeUrl.length * 0.75 / 1024)} KB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">
          <span className="section-icon">💡</span>
          사용 팁
        </h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🌐</div>
            <div className="tip-content">
              <strong>URL</strong>
              <span>http:// 또는 https://로 시작</span>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📶</div>
            <div className="tip-content">
              <strong>WiFi</strong>
              <span>WIFI:T:WPA;S:네트워크명;P:비밀번호;H:false;</span>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📞</div>
            <div className="tip-content">
              <strong>전화</strong>
              <span>tel:+82-10-1234-5678</span>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📧</div>
            <div className="tip-content">
              <strong>이메일</strong>
              <span>mailto:user@example.com</span>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">💬</div>
            <div className="tip-content">
              <strong>SMS</strong>
              <span>sms:+82-10-1234-5678?body=메시지내용</span>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔧</div>
            <div className="tip-content">
              <strong>오류 정정</strong>
              <span>높은 수준은 손상되어도 읽을 수 있게 합니다</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;