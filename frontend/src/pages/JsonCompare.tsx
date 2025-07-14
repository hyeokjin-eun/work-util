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
    <div className="page-container">
      <div className="page-header">
        <div className="header-icon">🔍</div>
        <h1 className="page-title">JSON 비교기</h1>
        <p className="page-subtitle">두 JSON 데이터를 비교하여 차이점을 시각화합니다</p>
      </div>

      <div className="action-section">
        <div className="actions-grid">
          <button className="btn-primary" onClick={loadSampleData}>
            <span className="btn-icon">📝</span>
            샘플 데이터 로드
          </button>
          <button className="btn-secondary" onClick={clearAll}>
            <span className="btn-icon">🗑️</span>
            전체 지우기
          </button>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">JSON 입력</h3>
        <div className="json-inputs-grid">
          <div className="input-section">
            <div className="section-header">
              <h4>원본 JSON</h4>
            </div>
            <textarea
              className="json-textarea"
              value={leftJson}
              onChange={(e) => setLeftJson(e.target.value)}
              placeholder="첫 번째 JSON 데이터를 입력하세요..."
              rows={15}
            />
            {leftError && (
              <div className="notification notification-error">
                <span className="notification-icon">❌</span>
                {leftError}
              </div>
            )}
          </div>

          <div className="input-section">
            <div className="section-header">
              <h4>비교할 JSON</h4>
            </div>
            <textarea
              className="json-textarea"
              value={rightJson}
              onChange={(e) => setRightJson(e.target.value)}
              placeholder="두 번째 JSON 데이터를 입력하세요..."
              rows={15}
            />
            {rightError && (
              <div className="notification notification-error">
                <span className="notification-icon">❌</span>
                {rightError}
              </div>
            )}
          </div>
        </div>
      </div>

      {comparisonResults.length > 0 && (
        <>
          <div className="section">
            <h3 className="section-title">
              <span className="section-icon">📊</span>
              비교 결과 요약
            </h3>
            <div className="summary-stats">
              <div className="stat-card total">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <span className="stat-label">전체</span>
                  <span className="stat-value">{summary.total}</span>
                </div>
              </div>
              <div className="stat-card added">
                <div className="stat-icon">➕</div>
                <div className="stat-content">
                  <span className="stat-label">추가</span>
                  <span className="stat-value">{summary.added}</span>
                </div>
              </div>
              <div className="stat-card removed">
                <div className="stat-icon">➖</div>
                <div className="stat-content">
                  <span className="stat-label">삭제</span>
                  <span className="stat-value">{summary.removed}</span>
                </div>
              </div>
              <div className="stat-card modified">
                <div className="stat-icon">🔄</div>
                <div className="stat-content">
                  <span className="stat-label">수정</span>
                  <span className="stat-value">{summary.modified}</span>
                </div>
              </div>
              <div className="stat-card unchanged">
                <div className="stat-icon">✓</div>
                <div className="stat-content">
                  <span className="stat-label">동일</span>
                  <span className="stat-value">{summary.unchanged}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">표시 옵션</h3>
            <div className="controls-grid">
              <div className="control-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showOnlyDifferences}
                    onChange={(e) => setShowOnlyDifferences(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">차이점만 표시</span>
                </label>
              </div>
              <div className="control-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={sortResults}
                    onChange={(e) => setSortResults(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">경로별 정렬</span>
                </label>
              </div>
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">
              상세 비교 결과
              <span className="count-badge">{filteredResults.length}</span>
            </h3>
            <div className="results-grid">
              {filteredResults.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <div className="empty-state-text">표시할 결과가 없습니다.</div>
                </div>
              ) : (
                filteredResults.map((result, index) => (
                  <div key={index} className={`result-card ${result.type}`}>
                    <div className="result-header">
                      <span className="type-icon">{getTypeIcon(result.type)}</span>
                      <span className="result-path">{result.path}</span>
                      <span className={`type-badge ${result.type}`}>
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