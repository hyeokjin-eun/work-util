import React, { useState, useCallback, useMemo } from 'react';
import '../styles/JsonCompare.css';

interface ComparisonResult {
  path: string;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  oldValue?: any;
  newValue?: any;
}

const JsonCompare: React.FC = () => {
  const [leftJson, setLeftJson] = useState('');
  const [rightJson, setRightJson] = useState('');
  const [leftError, setLeftError] = useState('');
  const [rightError, setRightError] = useState('');
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [sortResults, setSortResults] = useState(false);

  const compareJsonObjects = useCallback((obj1: any, obj2: any, path = ''): ComparisonResult[] => {
    const results: ComparisonResult[] = [];
    
    const allKeys = new Set([
      ...Object.keys(obj1 || {}),
      ...Object.keys(obj2 || {})
    ]);

    allKeys.forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      const value1 = obj1?.[key];
      const value2 = obj2?.[key];

      if (!(key in (obj1 || {}))) {
        results.push({
          path: currentPath,
          type: 'added',
          newValue: value2
        });
      } else if (!(key in (obj2 || {}))) {
        results.push({
          path: currentPath,
          type: 'removed',
          oldValue: value1
        });
      } else if (typeof value1 === 'object' && value1 !== null && 
                 typeof value2 === 'object' && value2 !== null &&
                 !Array.isArray(value1) && !Array.isArray(value2)) {
        results.push(...compareJsonObjects(value1, value2, currentPath));
      } else if (Array.isArray(value1) && Array.isArray(value2)) {
        results.push(...compareArrays(value1, value2, currentPath));
      } else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
        results.push({
          path: currentPath,
          type: 'modified',
          oldValue: value1,
          newValue: value2
        });
      } else {
        results.push({
          path: currentPath,
          type: 'unchanged',
          oldValue: value1,
          newValue: value2
        });
      }
    });

    return results;
  }, []);

  const compareArrays = useCallback((arr1: any[], arr2: any[], path: string): ComparisonResult[] => {
    const results: ComparisonResult[] = [];
    const maxLength = Math.max(arr1.length, arr2.length);

    for (let i = 0; i < maxLength; i++) {
      const currentPath = `${path}[${i}]`;
      const value1 = arr1[i];
      const value2 = arr2[i];

      if (i >= arr1.length) {
        results.push({
          path: currentPath,
          type: 'added',
          newValue: value2
        });
      } else if (i >= arr2.length) {
        results.push({
          path: currentPath,
          type: 'removed',
          oldValue: value1
        });
      } else if (typeof value1 === 'object' && value1 !== null && 
                 typeof value2 === 'object' && value2 !== null &&
                 !Array.isArray(value1) && !Array.isArray(value2)) {
        results.push(...compareJsonObjects(value1, value2, currentPath));
      } else if (Array.isArray(value1) && Array.isArray(value2)) {
        results.push(...compareArrays(value1, value2, currentPath));
      } else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
        results.push({
          path: currentPath,
          type: 'modified',
          oldValue: value1,
          newValue: value2
        });
      } else {
        results.push({
          path: currentPath,
          type: 'unchanged',
          oldValue: value1,
          newValue: value2
        });
      }
    }

    return results;
  }, []);

  const performComparison = useCallback(() => {
    setLeftError('');
    setRightError('');
    setComparisonResults([]);

    if (!leftJson.trim() && !rightJson.trim()) {
      return;
    }

    try {
      let leftParsed = null;
      let rightParsed = null;

      if (leftJson.trim()) {
        leftParsed = JSON.parse(leftJson);
      }

      if (rightJson.trim()) {
        rightParsed = JSON.parse(rightJson);
      }

      const results = compareJsonObjects(leftParsed, rightParsed);
      setComparisonResults(results);
    } catch (err) {
      if (leftJson.trim()) {
        try {
          JSON.parse(leftJson);
        } catch {
          setLeftError('Invalid JSON format');
          return;
        }
      }

      if (rightJson.trim()) {
        try {
          JSON.parse(rightJson);
        } catch {
          setRightError('Invalid JSON format');
          return;
        }
      }
    }
  }, [leftJson, rightJson, compareJsonObjects]);

  const filteredResults = useMemo(() => {
    let results = showOnlyDifferences 
      ? comparisonResults.filter(result => result.type !== 'unchanged')
      : comparisonResults;

    if (sortResults) {
      results = [...results].sort((a, b) => a.path.localeCompare(b.path));
    }

    return results;
  }, [comparisonResults, showOnlyDifferences, sortResults]);

  const summary = useMemo(() => {
    const stats = comparisonResults.reduce((acc, result) => {
      acc[result.type] = (acc[result.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: comparisonResults.length,
      added: stats.added || 0,
      removed: stats.removed || 0,
      modified: stats.modified || 0,
      unchanged: stats.unchanged || 0
    };
  }, [comparisonResults]);

  const loadSampleData = () => {
    const sample1 = {
      "name": "김철수",
      "age": 30,
      "email": "kim@example.com",
      "address": {
        "city": "서울",
        "district": "강남구"
      },
      "hobbies": ["독서", "영화감상"]
    };

    const sample2 = {
      "name": "김철수",
      "age": 31,
      "email": "kim.updated@example.com",
      "address": {
        "city": "서울",
        "district": "서초구",
        "zipCode": "12345"
      },
      "hobbies": ["독서", "운동", "여행"]
    };

    setLeftJson(JSON.stringify(sample1, null, 2));
    setRightJson(JSON.stringify(sample2, null, 2));
  };

  const clearAll = () => {
    setLeftJson('');
    setRightJson('');
    setLeftError('');
    setRightError('');
    setComparisonResults([]);
  };

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'added': return '➕';
      case 'removed': return '➖';
      case 'modified': return '🔄';
      case 'unchanged': return '✓';
      default: return '';
    }
  };

  React.useEffect(() => {
    performComparison();
  }, [performComparison]);

  return (
    <div className="json-compare-container">
      <div className="json-compare-header">
        <h2>JSON 비교기</h2>
        <div className="compare-actions">
          <button className="sample-btn" onClick={loadSampleData}>샘플 데이터</button>
          <button className="clear-btn" onClick={clearAll}>전체 지우기</button>
        </div>
      </div>

      <div className="json-inputs">
        <div className="input-section">
          <h3>원본 JSON</h3>
          <textarea
            className="json-input"
            value={leftJson}
            onChange={(e) => setLeftJson(e.target.value)}
            placeholder="첫 번째 JSON 데이터를 입력하세요..."
            rows={15}
          />
          {leftError && <div className="error-message">{leftError}</div>}
        </div>

        <div className="input-section">
          <h3>비교할 JSON</h3>
          <textarea
            className="json-input"
            value={rightJson}
            onChange={(e) => setRightJson(e.target.value)}
            placeholder="두 번째 JSON 데이터를 입력하세요..."
            rows={15}
          />
          {rightError && <div className="error-message">{rightError}</div>}
        </div>
      </div>

      {comparisonResults.length > 0 && (
        <>
          <div className="comparison-summary">
            <h3>비교 결과 요약</h3>
            <div className="summary-stats">
              <div className="stat-item total">
                <span>전체: {summary.total}</span>
              </div>
              <div className="stat-item added">
                <span>추가: {summary.added}</span>
              </div>
              <div className="stat-item removed">
                <span>삭제: {summary.removed}</span>
              </div>
              <div className="stat-item modified">
                <span>수정: {summary.modified}</span>
              </div>
              <div className="stat-item unchanged">
                <span>동일: {summary.unchanged}</span>
              </div>
            </div>
          </div>

          <div className="comparison-controls">
            <label>
              <input
                type="checkbox"
                checked={showOnlyDifferences}
                onChange={(e) => setShowOnlyDifferences(e.target.checked)}
              />
              차이점만 표시
            </label>
            <label>
              <input
                type="checkbox"
                checked={sortResults}
                onChange={(e) => setSortResults(e.target.checked)}
              />
              경로별 정렬
            </label>
          </div>

          <div className="comparison-results">
            <h3>상세 비교 결과</h3>
            <div className="results-list">
              {filteredResults.length === 0 ? (
                <div className="no-results">표시할 결과가 없습니다.</div>
              ) : (
                filteredResults.map((result, index) => (
                  <div key={index} className={`result-item ${result.type}`}>
                    <div className="result-header">
                      <span className="type-icon">{getTypeIcon(result.type)}</span>
                      <span className="path">{result.path}</span>
                      <span className={`type-label ${result.type}`}>
                        {result.type === 'added' && '추가됨'}
                        {result.type === 'removed' && '삭제됨'}
                        {result.type === 'modified' && '수정됨'}
                        {result.type === 'unchanged' && '동일함'}
                      </span>
                    </div>
                    <div className="result-content">
                      {result.type === 'added' && (
                        <div className="value-display added-value">
                          <strong>새 값:</strong>
                          <pre>{formatValue(result.newValue)}</pre>
                        </div>
                      )}
                      {result.type === 'removed' && (
                        <div className="value-display removed-value">
                          <strong>삭제된 값:</strong>
                          <pre>{formatValue(result.oldValue)}</pre>
                        </div>
                      )}
                      {result.type === 'modified' && (
                        <div className="value-comparison">
                          <div className="value-display old-value">
                            <strong>이전 값:</strong>
                            <pre>{formatValue(result.oldValue)}</pre>
                          </div>
                          <div className="value-display new-value">
                            <strong>새 값:</strong>
                            <pre>{formatValue(result.newValue)}</pre>
                          </div>
                        </div>
                      )}
                      {result.type === 'unchanged' && (
                        <div className="value-display unchanged-value">
                          <strong>값:</strong>
                          <pre>{formatValue(result.oldValue)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JsonCompare;