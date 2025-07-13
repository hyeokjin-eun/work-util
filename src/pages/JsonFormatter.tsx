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
    <div className="json-formatter-container">
      <div className="json-formatter-header">
        <h2>JSON 포맷터</h2>
        <div className="formatter-controls">
          <div className="control-group">
            <label>들여쓰기 크기:</label>
            <select 
              value={indentSize} 
              onChange={(e) => setIndentSize(Number(e.target.value))}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={sortKeys}
                onChange={(e) => setSortKeys(e.target.checked)}
              />
              키 정렬
            </label>
          </div>
        </div>
      </div>

      <div className="formatter-actions">
        <button className="format-btn" onClick={formatJson}>포맷팅</button>
        <button className="minify-btn" onClick={minifyJson}>압축</button>
        <button className="validate-btn" onClick={validateJson}>검증</button>
        <button className="sample-btn" onClick={loadSampleJson}>샘플 로드</button>
        <button className="clear-btn" onClick={clearAll}>전체 지우기</button>
      </div>

      {error && (
        <div className={`error-message ${error === 'Valid JSON' ? 'success' : 'error'}`}>
          {error}
        </div>
      )}

      <div className="formatter-content">
        <div className="input-section">
          <div className="section-header">
            <h3>입력 JSON</h3>
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(input)}
              disabled={!input}
            >
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
          <div className="character-count">
            문자 수: {input.length}
          </div>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h3>출력 JSON</h3>
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(output)}
              disabled={!output}
            >
              복사
            </button>
          </div>
          <textarea
            className="json-textarea"
            value={output}
            readOnly
            placeholder="포맷된 JSON이 여기에 표시됩니다..."
            rows={20}
          />
          <div className="character-count">
            문자 수: {output.length}
          </div>
        </div>
      </div>

      <div className="json-tools">
        <div className="tool-section">
          <h3>JSON 정보</h3>
          <div className="json-stats">
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
                    <div className="stat-item">
                      <span>최대 깊이:</span>
                      <span>{stats.maxDepth}</span>
                    </div>
                    <div className="stat-item">
                      <span>객체 개수:</span>
                      <span>{stats.objectCount}</span>
                    </div>
                    <div className="stat-item">
                      <span>배열 개수:</span>
                      <span>{stats.arrayCount}</span>
                    </div>
                    <div className="stat-item">
                      <span>총 키 개수:</span>
                      <span>{stats.totalKeys}</span>
                    </div>
                    <div className="stat-item">
                      <span>문자열:</span>
                      <span>{stats.stringCount}</span>
                    </div>
                    <div className="stat-item">
                      <span>숫자:</span>
                      <span>{stats.numberCount}</span>
                    </div>
                    <div className="stat-item">
                      <span>불린:</span>
                      <span>{stats.booleanCount}</span>
                    </div>
                    <div className="stat-item">
                      <span>null:</span>
                      <span>{stats.nullCount}</span>
                    </div>
                  </div>
                );
              } catch {
                return <div>JSON 통계를 계산할 수 없습니다.</div>;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;