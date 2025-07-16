import React, { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'

interface QRSettings {
  errorLevel: 'L' | 'M' | 'Q' | 'H'
  size: number
  margin: number
  foreColor: string
  backColor: string
  fileFormat: 'PNG' | 'JPEG'
}

const QrGenerator: React.FC = () => {
  const [text, setText] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [settings, setSettings] = useState<QRSettings>({
    errorLevel: 'M',
    size: 256,
    margin: 4,
    foreColor: '#000000',
    backColor: '#ffffff',
    fileFormat: 'PNG'
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const qrIcon = (
    <div style={{ width: '60px', height: '60px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
      📱
    </div>
  )

  const generateQR = async () => {
    if (!text.trim()) {
      setQrDataUrl(null)
      return
    }

    try {
      // Use dynamic import for qrcode library
      const QRCode = await import('qrcode')
      
      const canvas = canvasRef.current
      if (!canvas) return

      const options = {
        errorCorrectionLevel: settings.errorLevel,
        width: settings.size,
        margin: settings.margin,
        color: {
          dark: settings.foreColor,
          light: settings.backColor
        }
      }

      await QRCode.toCanvas(canvas, text, options)
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL(`image/${settings.fileFormat.toLowerCase()}`)
      setQrDataUrl(dataUrl)
    } catch (error) {
      console.error('QR 코드 생성 오류:', error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      generateQR()
    }, 500)
    return () => clearTimeout(timer)
  }, [text, settings])

  const insertTemplate = (type: 'url' | 'wifi' | 'tel' | 'email') => {
    let template = ''
    switch (type) {
      case 'url':
        template = 'https://example.com'
        break
      case 'wifi':
        template = 'WIFI:T:WPA;S:네트워크명;P:비밀번호;H:false;'
        break
      case 'tel':
        template = 'tel:+82-10-1234-5678'
        break
      case 'email':
        template = 'mailto:user@example.com'
        break
    }
    setText(template)
  }

  const downloadQR = () => {
    if (!qrDataUrl) return
    
    const link = document.createElement('a')
    link.download = `qrcode.${settings.fileFormat.toLowerCase()}`
    link.href = qrDataUrl
    link.click()
  }

  const copyToClipboard = async () => {
    if (!qrDataUrl) return
    
    try {
      const response = await fetch(qrDataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ])
      alert('QR 코드가 클립보드에 복사되었습니다!')
    } catch (error) {
      console.error('클립보드 복사 오류:', error)
      alert('클립보드 복사에 실패했습니다.')
    }
  }

  return (
    <Layout 
      pageTitle="QR 생성기"
      pageSubtitle="다양한 형식의 QR 코드를 쉽게 생성하세요"
      pageIcon={qrIcon}
    >
      <div className="qr-generator-container">
        <div className="input-section">
          <div className="section-title">텍스트 입력</div>
          
          <div className="form-group">
            <textarea 
              className="form-textarea" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="QR 코드로 변환할 텍스트를 입력하세요..."
            />
            <div className="char-count">문자 수: {text.length}</div>
          </div>

          <div className="templates-section">
            <div className="templates-title">빠른 입력 템플릿</div>
            <div className="template-grid">
              <button className="template-btn" onClick={() => insertTemplate('url')}>🌐 URL</button>
              <button className="template-btn" onClick={() => insertTemplate('wifi')}>📶 WiFi</button>
              <button className="template-btn" onClick={() => insertTemplate('tel')}>📞 전화</button>
              <button className="template-btn" onClick={() => insertTemplate('email')}>📧 이메일</button>
            </div>
          </div>
        </div>

        <div className="input-section">
          <div className="section-title">QR 코드 설정</div>
          
          <div className="form-group">
            <label className="form-label">오류 정정 수준</label>
            <select 
              className="form-select" 
              value={settings.errorLevel}
              onChange={(e) => setSettings({...settings, errorLevel: e.target.value as 'L' | 'M' | 'Q' | 'H'})}
            >
              <option value="L">낮음 (~7%)</option>
              <option value="M">중간 (~15%)</option>
              <option value="Q">높음 (~25%)</option>
              <option value="H">최고 (~30%)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">크기</label>
            <select 
              className="form-select" 
              value={settings.size}
              onChange={(e) => setSettings({...settings, size: Number(e.target.value)})}
            >
              <option value={128}>128px</option>
              <option value={256}>256px</option>
              <option value={512}>512px</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">여백</label>
            <input 
              type="number" 
              className="form-input" 
              value={settings.margin}
              onChange={(e) => setSettings({...settings, margin: Number(e.target.value)})}
              min="0" 
              max="10"
            />
          </div>

          <div className="form-group">
            <label className="form-label">색상 설정</label>
            <div className="color-group">
              <div className="color-item">
                <label className="color-label">전경색</label>
                <input 
                  type="color" 
                  className="color-input" 
                  value={settings.foreColor}
                  onChange={(e) => setSettings({...settings, foreColor: e.target.value})}
                />
              </div>
              <div className="color-item">
                <label className="color-label">배경색</label>
                <input 
                  type="color" 
                  className="color-input" 
                  value={settings.backColor}
                  onChange={(e) => setSettings({...settings, backColor: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">파일 형식</label>
            <select 
              className="form-select" 
              value={settings.fileFormat}
              onChange={(e) => setSettings({...settings, fileFormat: e.target.value as 'PNG' | 'JPEG'})}
            >
              <option value="PNG">PNG</option>
              <option value="JPEG">JPEG</option>
            </select>
          </div>
        </div>

        <div className="preview-section">
          <div className="section-title">QR 코드 미리보기</div>
          <div className="preview-container">
            <canvas 
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            {qrDataUrl ? (
              <div className="qr-display">
                <img src={qrDataUrl} alt="QR Code" className="qr-image" />
                <div className="qr-actions">
                  <button className="download-btn" onClick={downloadQR}>
                    💾 다운로드
                  </button>
                  <button className="copy-btn" onClick={copyToClipboard}>
                    📋 복사
                  </button>
                </div>
              </div>
            ) : (
              <div className="qr-placeholder">
                <div className="placeholder-icon">📱</div>
                <div className="qr-message">텍스트를 입력하면 QR 코드가 생성됩니다.</div>
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <div className="section-title">ℹ️ QR 코드 정보</div>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">📏</div>
              <div className="info-value">{text.length} 문자</div>
              <div className="info-label">입력 길이</div>
            </div>
            <div className="info-item">
              <div className="info-icon">📐</div>
              <div className="info-value">{settings.size} × {settings.size}px</div>
              <div className="info-label">크기</div>
            </div>
            <div className="info-item">
              <div className="info-icon">🔧</div>
              <div className="info-value">{settings.errorLevel} 수준</div>
              <div className="info-label">오류 정정</div>
            </div>
            <div className="info-item">
              <div className="info-icon">🗂️</div>
              <div className="info-value">{settings.fileFormat}</div>
              <div className="info-label">파일 형식</div>
            </div>
          </div>
        </div>

        <div className="tips-section">
          <div className="section-title">💡 사용 팁</div>
          
          <div className="tip-item">
            <div className="tip-header">
              <div className="tip-icon">🌐</div>
              <div className="tip-title">URL</div>
            </div>
            <div className="tip-description">http:// 또는 https://로 시작</div>
          </div>

          <div className="tip-item">
            <div className="tip-header">
              <div className="tip-icon">📶</div>
              <div className="tip-title">WiFi</div>
            </div>
            <div className="tip-description">WIFI:T:WPA;S:네트워크명;P:비밀번호;H:false;</div>
          </div>

          <div className="tip-item">
            <div className="tip-header">
              <div className="tip-icon">📞</div>
              <div className="tip-title">전화</div>
            </div>
            <div className="tip-description">tel:+82-10-1234-5678</div>
          </div>

          <div className="tip-item">
            <div className="tip-header">
              <div className="tip-icon">📧</div>
              <div className="tip-title">이메일</div>
            </div>
            <div className="tip-description">mailto:user@example.com</div>
          </div>

          <div className="tip-item">
            <div className="tip-header">
              <div className="tip-icon">💬</div>
              <div className="tip-title">SMS</div>
            </div>
            <div className="tip-description">sms:+82-10-1234-5678?body=메시지내용</div>
          </div>

          <div className="tip-item">
            <div className="tip-header">
              <div className="tip-icon">🔧</div>
              <div className="tip-title">오류 정정</div>
            </div>
            <div className="tip-description">높은 수준은 손상되어도 읽을 수 있게 합니다</div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default QrGenerator