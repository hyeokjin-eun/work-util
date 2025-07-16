import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import '../styles/JsonFormatter.css'

const JsonFormatter: React.FC = () => {
  const [indentSize, setIndentSize] = useState('2')
  const [sortKeys, setSortKeys] = useState(true)
  const [inputJson, setInputJson] = useState('')
  const [outputJson, setOutputJson] = useState('')
  const [outputColor, setOutputColor] = useState('#333')

  useEffect(() => {
    // Scroll to top when JsonFormatter component loads
    window.scrollTo(0, 0)
  }, [])
  
  const jsonIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  )

  const sortObjectKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj
    if (Array.isArray(obj)) return obj.map(sortObjectKeys)
    
    const sorted: any = {}
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = sortObjectKeys(obj[key])
    })
    return sorted
  }

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(inputJson)
      const indent = indentSize === 'tab' ? '\t' : ' '.repeat(parseInt(indentSize))
      
      let formatted
      if (sortKeys) {
        formatted = JSON.stringify(sortObjectKeys(parsed), null, indent)
      } else {
        formatted = JSON.stringify(parsed, null, indent)
      }
      
      setOutputJson(formatted)
      setOutputColor('#333')
    } catch (error) {
      setOutputJson(`❌ JSON 형식이 올바르지 않습니다: ${(error as Error).message}`)
      setOutputColor('#ef4444')
    }
  }

  const validateJSON = () => {
    try {
      JSON.parse(inputJson)
      setOutputJson('✅ 유효한 JSON 형식입니다!')
      setOutputColor('#10b981')
    } catch (error) {
      setOutputJson(`❌ 유효하지 않은 JSON: ${(error as Error).message}`)
      setOutputColor('#ef4444')
    }
  }

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(inputJson)
      setOutputJson(JSON.stringify(parsed))
      setOutputColor('#333')
    } catch (error) {
      setOutputJson(`❌ JSON 형식이 올바르지 않습니다: ${(error as Error).message}`)
      setOutputColor('#ef4444')
    }
  }

  const clearAll = () => {
    setInputJson('')
    setOutputJson('')
    setOutputColor('#333')
  }

  const copyInput = () => {
    navigator.clipboard.writeText(inputJson)
    alert('입력 JSON이 복사되었습니다!')
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(outputJson)
    alert('출력 JSON이 복사되었습니다!')
  }
  
  return (
    <Layout 
      pageTitle="JSON 포맷터"
      pageSubtitle="복잡한 JSON 데이터를 보기 좋게 정리하고 분석하세요"
      pageIcon={jsonIcon}
    >
      <div className="json-formatter-container">
        <div className="settings-section">
          <div className="settings-title">설정 및 도구</div>
          
          <div className="form-group">
            <label className="form-label">들여쓰기 크기</label>
            <select 
              className="form-select" 
              value={indentSize} 
              onChange={(e) => setIndentSize(e.target.value)}
            >
              <option value="2">📐 2칸 간격 (컴팩트)</option>
              <option value="4">📏 4칸 간격 (표준)</option>
              <option value="tab">📑 탭 간격 (넓게)</option>
            </select>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                className="checkbox" 
                checked={sortKeys} 
                onChange={(e) => setSortKeys(e.target.checked)}
              />
              <label className="checkbox-label">키 정렬</label>
            </div>
          </div>

          <button className="format-btn" onClick={formatJSON}>
            🔧 포맷팅
          </button>

          <div className="quick-actions">
            <div className="quick-action" onClick={clearAll}>
              <div className="quick-action-icon">🗑️</div>
              <div>삭제</div>
            </div>
            <div className="quick-action" onClick={validateJSON}>
              <div className="quick-action-icon">✅</div>
              <div>검증</div>
            </div>
            <div className="quick-action" onClick={minifyJSON}>
              <div className="quick-action-icon">📝</div>
              <div>압축 모드</div>
            </div>
            <div className="quick-action" onClick={copyOutput}>
              <div className="quick-action-icon">🗂️</div>
              <div>복사 자료</div>
            </div>
          </div>
        </div>

        <div className="json-section">
          <div className="json-title">입력 JSON</div>
          <textarea 
            className="json-textarea" 
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="여기에 JSON 데이터를 입력하세요..."
          />
          <button className="copy-btn" onClick={copyInput}>📋 복사</button>
        </div>

        <div className="json-section">
          <div className="json-title">출력 JSON</div>
          <textarea 
            className="json-textarea" 
            value={outputJson}
            style={{ color: outputColor }}
            placeholder="포맷된 JSON이 여기에 표시됩니다..."
            readOnly
          />
          <button className="copy-btn" onClick={copyOutput}>📋 복사</button>
        </div>
      </div>
    </Layout>
  )
}

export default JsonFormatter