import React, { useState, useCallback } from 'react';
import '../styles/JsonFormatter.css';

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);

  const formatJson = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      let formatted;
      
      if (sortKeys) {
        const sortObject = (obj: any): any => {
          if (Array.isArray(obj)) {
            return obj.map(sortObject);
          } else if (obj !== null && typeof obj === 'object') {
            const sortedKeys = Object.keys(obj).sort();
            const sortedObj: any = {};
            sortedKeys.forEach(key => {
              sortedObj[key] = sortObject(obj[key]);
            });
            return sortedObj;
          }
          return obj;
        };
        formatted = JSON.stringify(sortObject(parsed), null, indentSize);
      } else {
        formatted = JSON.stringify(parsed, null, indentSize);
      }
      
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
      setOutput('');
    }
  }, [input, indentSize, sortKeys]);

  const minifyJson = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
      setOutput('');
    }
  }, [input]);

  const validateJson = useCallback(() => {
    if (!input.trim()) {
      setError('');
      return;
    }

    try {
      JSON.parse(input);
      setError('Valid JSON');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  }, [input]);

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const loadSampleJson = () => {
    const sampleJson = {
      "name": "김철수",
      "age": 30,
      "email": "kim@example.com",
      "address": {
        "city": "서울",
        "district": "강남구",
        "zipCode": "12345"
      },
      "hobbies": ["독서", "영화감상", "운동"],
      "isActive": true,
      "score": 95.5,
      "lastLogin": "2024-01-15T10:30:00Z"
    };
    setInput(JSON.stringify(sampleJson));
  };

  React.useEffect(() => {
    formatJson();
  }, [formatJson]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-icon">{'{}'}</div>
        <h1 className="page-title">JSON 포맷터</h1>
        <p className="page-subtitle">복잡한 JSON 데이터를 보기 좋게 정리하고 분석하세요</p>
      </div>

      <div className="section">
        <h3 className="section-title">설정 및 도구</h3>
        <div className="controls-grid">
          <div className="control-group">
            <label className="control-label">들여쓰기 크기</label>
            <select 
              value={indentSize} 
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="form-select"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
          <div className="control-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={sortKeys}
                onChange={(e) => setSortKeys(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">키 정렬</span>
            </label>
          </div>
        </div>
        
        <div className="actions-grid">
          <button className="btn-primary" onClick={formatJson}>
            <span className="btn-icon">🎨</span>
            포맷팅
          </button>
          <button className="btn-secondary" onClick={minifyJson}>
            <span className="btn-icon">📦</span>
            압축
          </button>
          <button className="btn-secondary" onClick={validateJson}>
            <span className="btn-icon">✅</span>
            검증
          </button>
          <button className="btn-secondary" onClick={loadSampleJson}>
            <span className="btn-icon">📝</span>
            샘플 로드
          </button>
          <button className="btn-secondary" onClick={clearAll}>
            <span className="btn-icon">🗑️</span>
            전체 지우기
          </button>
        </div>
      </div>

      {error && (
        <div className={`notification ${error === 'Valid JSON' ? 'notification-success' : 'notification-error'}`}>
          <span className="notification-icon">{error === 'Valid JSON' ? '✅' : '❌'}</span>
          {error}
        </div>
      )}

      <div className="content-grid">
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">입력 JSON</h3>
            <button 
              className="btn-secondary copy-btn" 
              onClick={() => copyToClipboard(input)}
              disabled={!input}
            >
              <span className="btn-icon">📋</span>
              복사
            </button>
          </div>
          <textarea
            className="json-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="여기에 JSON 데이터를 입력하세요..."
            rows={20}
          />
          <div className="textarea-footer">
            <span className="character-count">문자 수: {input.length}</span>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h3 className="section-title">출력 JSON</h3>
            <button 
              className="btn-secondary copy-btn" 
              onClick={() => copyToClipboard(output)}
              disabled={!output}
            >
              <span className="btn-icon">📋</span>
              복사
            </button>
          </div>
          <textarea
            className="json-textarea output"
            value={output}
            readOnly
            placeholder="포맷된 JSON이 여기에 표시됩니다..."
            rows={20}
          />
          <div className="textarea-footer">
            <span className="character-count">문자 수: {output.length}</span>
          </div>
        </div>
      </div>

      {output && (
        <div className="section">
          <h3 className="section-title">
            <span className="section-icon">📊</span>
            JSON 통계
          </h3>
          <div className="stats-container">
            {output && (() => {
              try {
                const parsed = JSON.parse(output);
                const getJsonStats = (obj: any, depth = 0): any => {
                  let stats = {
                    maxDepth: depth,
                    objectCount: 0,
                    arrayCount: 0,
                    stringCount: 0,
                    numberCount: 0,
                    booleanCount: 0,
                    nullCount: 0,
                    totalKeys: 0
                  };

                  if (Array.isArray(obj)) {
                    stats.arrayCount++;
                    obj.forEach(item => {
                      const childStats = getJsonStats(item, depth + 1);
                      stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
                      stats.objectCount += childStats.objectCount;
                      stats.arrayCount += childStats.arrayCount;
                      stats.stringCount += childStats.stringCount;
                      stats.numberCount += childStats.numberCount;
                      stats.booleanCount += childStats.booleanCount;
                      stats.nullCount += childStats.nullCount;
                      stats.totalKeys += childStats.totalKeys;
                    });
                  } else if (obj !== null && typeof obj === 'object') {
                    stats.objectCount++;
                    const keys = Object.keys(obj);
                    stats.totalKeys += keys.length;
                    keys.forEach(key => {
                      const childStats = getJsonStats(obj[key], depth + 1);
                      stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
                      stats.objectCount += childStats.objectCount;
                      stats.arrayCount += childStats.arrayCount;
                      stats.stringCount += childStats.stringCount;
                      stats.numberCount += childStats.numberCount;
                      stats.booleanCount += childStats.booleanCount;
                      stats.nullCount += childStats.nullCount;
                      stats.totalKeys += childStats.totalKeys;
                    });
                  } else if (typeof obj === 'string') {
                    stats.stringCount++;
                  } else if (typeof obj === 'number') {
                    stats.numberCount++;
                  } else if (typeof obj === 'boolean') {
                    stats.booleanCount++;
                  } else if (obj === null) {
                    stats.nullCount++;
                  }

                  return stats;
                };

                const stats = getJsonStats(parsed);
                return (
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">📏</div>
                      <div className="stat-content">
                        <span className="stat-label">최대 깊이</span>
                        <span className="stat-value">{stats.maxDepth}</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">🧩</div>
                      <div className="stat-content">
                        <span className="stat-label">객체 개수</span>
                        <span className="stat-value">{stats.objectCount}</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">📚</div>
                      <div className="stat-content">
                        <span className="stat-label">배열 개수</span>
                        <span className="stat-value">{stats.arrayCount}</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">🔑</div>
                      <div className="stat-content">
                        <span className="stat-label">총 키 개수</span>
                        <span className="stat-value">{stats.totalKeys}</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">📝</div>
                      <div className="stat-content">
                        <span className="stat-label">문자열</span>
                        <span className="stat-value">{stats.stringCount}</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">🔢</div>
                      <div className="stat-content">
                        <span className="stat-label">숫자</span>
                        <span className="stat-value">{stats.numberCount}</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">✅</div>
                      <div className="stat-content">
                        <span className="stat-label">불린</span>
                        <span className="stat-value">{stats.booleanCount}</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">⚫</div>
                      <div className="stat-content">
                        <span className="stat-label">null</span>
                        <span className="stat-value">{stats.nullCount}</span>
                      </div>
                    </div>
                  </div>
                );
              } catch {
                return <div className="error-text">JSON 통계를 계산할 수 없습니다.</div>;
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonFormatter;