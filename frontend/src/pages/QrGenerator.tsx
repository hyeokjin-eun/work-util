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
    <div className="qr-generator-container">
      <div className="qr-generator-header">
        <h2>QR 생성기</h2>
        <button className="clear-btn" onClick={clearAll}>전체 지우기</button>
      </div>

      <div className="qr-content">
        <div className="qr-input-section">
          <div className="input-group">
            <label>변환할 텍스트</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="URL, 텍스트, 이메일, 전화번호 등을 입력하세요..."
              rows={5}
            />
            <div className="character-count">
              {inputText.length} 문자
            </div>
          </div>

          <div className="preset-buttons">
            <h3>빠른 입력</h3>
            <div className="preset-grid">
              <button onClick={() => loadPresets('url')}>웹사이트 URL</button>
              <button onClick={() => loadPresets('email')}>이메일</button>
              <button onClick={() => loadPresets('phone')}>전화번호</button>
              <button onClick={() => loadPresets('sms')}>SMS</button>
              <button onClick={() => loadPresets('wifi')}>WiFi</button>
              <button onClick={() => loadPresets('vcard')}>연락처 (vCard)</button>
            </div>
          </div>

          <div className="qr-options">
            <h3>QR 코드 설정</h3>
            
            <div className="option-row">
              <label>오류 정정 수준</label>
              <select
                value={qrOptions.errorCorrectionLevel}
                onChange={(e) => setQrOptions({
                  ...qrOptions,
                  errorCorrectionLevel: e.target.value as QROptions['errorCorrectionLevel']
                })}
              >
                <option value="L">낮음 (~7%)</option>
                <option value="M">중간 (~15%)</option>
                <option value="Q">높음 (~25%)</option>
                <option value="H">최고 (~30%)</option>
              </select>
            </div>

            <div className="option-row">
              <label>크기 (픽셀)</label>
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
              />
              <span>{qrOptions.width}px</span>
            </div>

            <div className="option-row">
              <label>여백</label>
              <input
                type="range"
                min="0"
                max="10"
                value={qrOptions.margin}
                onChange={(e) => setQrOptions({
                  ...qrOptions,
                  margin: Number(e.target.value)
                })}
              />
              <span>{qrOptions.margin}</span>
            </div>

            <div className="color-options">
              <div className="color-group">
                <label>전경색</label>
                <input
                  type="color"
                  value={qrOptions.color.dark}
                  onChange={(e) => setQrOptions({
                    ...qrOptions,
                    color: { ...qrOptions.color, dark: e.target.value }
                  })}
                />
              </div>
              <div className="color-group">
                <label>배경색</label>
                <input
                  type="color"
                  value={qrOptions.color.light}
                  onChange={(e) => setQrOptions({
                    ...qrOptions,
                    color: { ...qrOptions.color, light: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="option-row">
              <label>파일 형식</label>
              <select
                value={qrOptions.type}
                onChange={(e) => setQrOptions({
                  ...qrOptions,
                  type: e.target.value as QROptions['type']
                })}
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
              </select>
            </div>

            {qrOptions.type === 'image/jpeg' && (
              <div className="option-row">
                <label>품질</label>
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
                />
                <span>{Math.round(qrOptions.quality * 100)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="qr-output-section">
          <div className="qr-preview">
            <h3>QR 코드 미리보기</h3>
            
            {error && (
              <div className="error-message">{error}</div>
            )}

            {isLoading && (
              <div className="loading">QR 코드 생성 중...</div>
            )}

            <div className="qr-display">
              <canvas
                ref={canvasRef}
                style={{ display: qrCodeUrl ? 'block' : 'none' }}
              />
              {!qrCodeUrl && !isLoading && !error && (
                <div className="placeholder">
                  텍스트를 입력하면 QR 코드가 생성됩니다.
                </div>
              )}
            </div>

            {qrCodeUrl && (
              <div className="qr-actions">
                <button className="download-btn" onClick={downloadQRCode}>
                  다운로드
                </button>
                <button className="copy-btn" onClick={copyToClipboard}>
                  클립보드에 복사
                </button>
              </div>
            )}
          </div>

          <div className="qr-info">
            <h3>QR 코드 정보</h3>
            <div className="info-list">
              <div className="info-item">
                <span>입력 길이:</span>
                <span>{inputText.length} 문자</span>
              </div>
              <div className="info-item">
                <span>크기:</span>
                <span>{qrOptions.width} × {qrOptions.width}px</span>
              </div>
              <div className="info-item">
                <span>오류 정정:</span>
                <span>{qrOptions.errorCorrectionLevel} 수준</span>
              </div>
              <div className="info-item">
                <span>파일 형식:</span>
                <span>{qrOptions.type.split('/')[1].toUpperCase()}</span>
              </div>
              {qrCodeUrl && (
                <div className="info-item">
                  <span>파일 크기:</span>
                  <span>{Math.round(qrCodeUrl.length * 0.75 / 1024)} KB</span>
                </div>
              )}
            </div>
          </div>

          <div className="usage-tips">
            <h3>사용 팁</h3>
            <ul>
              <li>URL은 http:// 또는 https://로 시작해야 합니다</li>
              <li>WiFi: WIFI:T:WPA;S:네트워크명;P:비밀번호;H:false;</li>
              <li>전화: tel:+82-10-1234-5678</li>
              <li>이메일: mailto:user@example.com</li>
              <li>SMS: sms:+82-10-1234-5678?body=메시지내용</li>
              <li>높은 오류 정정 수준은 QR 코드가 손상되어도 읽을 수 있게 합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;