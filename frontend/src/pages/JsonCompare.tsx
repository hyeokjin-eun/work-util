import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'

interface Difference {
  type: 'added' | 'removed' | 'modified'
  path: string
  value?: any
  oldValue?: any
  newValue?: any
}

const JsonCompare: React.FC = () => {
  const [originalJson, setOriginalJson] = useState('')
  const [compareJson, setCompareJson] = useState('')
  const [result, setResult] = useState<string>('')
  const [resultType, setResultType] = useState<'empty' | 'identical' | 'different'>('empty')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const compareIcon = (
    <div style={{ width: '60px', height: '60px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
      🔍
    </div>
  )

  const loadSampleData = () => {
    const sampleData1 = {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipcode": "10001"
      },
      "hobbies": ["reading", "swimming"]
    }

    const sampleData2 = {
      "name": "John Doe",
      "age": 31,
      "email": "john.doe@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipcode": "10001",
        "country": "USA"
      },
      "hobbies": ["reading", "swimming", "hiking"]
    }

    setOriginalJson(JSON.stringify(sampleData1, null, 2))
    setCompareJson(JSON.stringify(sampleData2, null, 2))
    performComparison(JSON.stringify(sampleData1, null, 2), JSON.stringify(sampleData2, null, 2))
  }

  const findDifferences = (obj1: any, obj2: any, path = ''): Difference[] => {
    const differences: Difference[] = []
    
    // obj1의 모든 키 검사
    for (const key in obj1) {
      const currentPath = path ? `${path}.${key}` : key
      
      if (!(key in obj2)) {
        differences.push({
          type: 'removed',
          path: currentPath,
          value: obj1[key]
        })
      } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && obj1[key] !== null && obj2[key] !== null) {
        differences.push(...findDifferences(obj1[key], obj2[key], currentPath))
      } else if (obj1[key] !== obj2[key]) {
        differences.push({
          type: 'modified',
          path: currentPath,
          oldValue: obj1[key],
          newValue: obj2[key]
        })
      }
    }
    
    // obj2의 새로운 키 검사
    for (const key in obj2) {
      if (!(key in obj1)) {
        const currentPath = path ? `${path}.${key}` : key
        differences.push({
          type: 'added',
          path: currentPath,
          value: obj2[key]
        })
      }
    }
    
    return differences
  }

  const formatDifferences = (differences: Difference[]): string => {
    let result = `발견된 차이점: ${differences.length}개\n\n`
    
    differences.forEach((diff, index) => {
      result += `${index + 1}. ${diff.path}\n`
      
      switch (diff.type) {
        case 'added':
          result += `   + 추가됨: ${JSON.stringify(diff.value)}\n`
          break
        case 'removed':
          result += `   - 삭제됨: ${JSON.stringify(diff.value)}\n`
          break
        case 'modified':
          result += `   ~ 변경됨: ${JSON.stringify(diff.oldValue)} → ${JSON.stringify(diff.newValue)}\n`
          break
      }
      result += '\n'
    })
    
    return result
  }

  const performComparison = (original = originalJson, compare = compareJson) => {
    if (!original.trim() || !compare.trim()) {
      setResult('JSON 데이터를 입력하고 비교 버튼을 클릭하세요')
      setResultType('empty')
      return
    }

    try {
      const obj1 = JSON.parse(original)
      const obj2 = JSON.parse(compare)
      
      const differences = findDifferences(obj1, obj2)
      
      if (differences.length === 0) {
        setResult('✅ 두 JSON 데이터가 동일합니다!')
        setResultType('identical')
      } else {
        setResult(formatDifferences(differences))
        setResultType('different')
      }
    } catch (error) {
      setResult(`❌ JSON 형식 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      setResultType('different')
    }
  }

  const clearAll = () => {
    setOriginalJson('')
    setCompareJson('')
    setResult('JSON 데이터를 입력하고 비교 버튼을 클릭하세요')
    setResultType('empty')
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (originalJson.trim() && compareJson.trim()) {
        performComparison()
      }
    }, 1000)

    return () => clearTimeout(debounceTimer)
  }, [originalJson, compareJson])

  return (
    <Layout 
      pageTitle="JSON 비교기"
      pageSubtitle="두 JSON 데이터를 비교하여 차이점을 시각화합니다"
      pageIcon={compareIcon}
    >
      <div className="json-compare-container">
        <div className="control-section">
          <button className="compare-btn" onClick={loadSampleData}>
            🔍 샘플 데이터 로드
          </button>
          <button className="clear-btn" onClick={clearAll}>
            🗑️ 전체 지우기
          </button>
        </div>

        <div className="json-section">
          <div className="json-title">원본 JSON</div>
          <textarea 
            className="json-textarea"
            value={originalJson}
            onChange={(e) => setOriginalJson(e.target.value)}
            placeholder="첫 번째 JSON 데이터를 입력하세요..."
          />
        </div>

        <div className="json-section">
          <div className="json-title">비교할 JSON</div>
          <textarea 
            className="json-textarea"
            value={compareJson}
            onChange={(e) => setCompareJson(e.target.value)}
            placeholder="두 번째 JSON 데이터를 입력하세요..."
          />
        </div>

        <div className="result-section">
          <div className="result-title">비교 결과</div>
          <div className={`result-content ${resultType}`}>
            {result}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default JsonCompare