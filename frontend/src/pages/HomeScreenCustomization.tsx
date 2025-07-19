import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import QuickActionCustomizer from '../components/QuickActionCustomizer'
import CustomSelect from '../components/CustomSelect'
import { HomeScreenLayout, useHomeScreenLayout } from '../hooks/useHomeScreenLayout'
import { useQuickActions } from '../hooks/useQuickActions'
import '../styles/HomeScreenCustomization.css'
import '../styles/QuickActionCustomizer.css'

const HomeScreenCustomization: React.FC = () => {
  const navigate = useNavigate()
  const { layout: currentLayout, loading, saveLayout } = useHomeScreenLayout()
  const [layout, setLayout] = useState<HomeScreenLayout>(currentLayout)
  const [draggedSection, setDraggedSection] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false)
  const { quickActions, loading: quickActionsLoading, saveQuickActions } = useQuickActions()

  useEffect(() => {
    if (currentLayout) {
      setLayout(currentLayout)
    }
  }, [currentLayout])

  const handleSave = async () => {
    setSaving(true)
    try {
      const success = await saveLayout(layout)
      if (success) {
        navigate('/mypage')
      }
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSectionToggle = (sectionId: string) => {
    setLayout(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, enabled: !section.enabled }
          : section
      )
    }))
  }

  const handleSectionSettingChange = (sectionId: string, settingKey: string, value: any) => {
    setLayout(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              settings: { ...section.settings, [settingKey]: value }
            }
          : section
      )
    }))
  }

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault()
    
    if (!draggedSection || draggedSection === targetSectionId) {
      setDraggedSection(null)
      return
    }

    const sections = [...layout.sections]
    const draggedIndex = sections.findIndex(s => s.id === draggedSection)
    const targetIndex = sections.findIndex(s => s.id === targetSectionId)
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove dragged section
      const draggedItem = sections.splice(draggedIndex, 1)[0]
      
      // Insert at target position
      sections.splice(targetIndex, 0, draggedItem)
      
      // Update order values
      const updatedSections = sections.map((section, index) => ({
        ...section,
        order: index + 1
      }))
      
      setLayout(prev => ({
        ...prev,
        sections: updatedSections
      }))
    }
    
    setDraggedSection(null)
  }


  const handleQuickActionsCustomize = () => {
    setShowQuickActionsModal(true)
  }

  const handleQuickActionsSave = async (actions: any[]) => {
    const success = await saveQuickActions(actions)
    if (success) {
      setShowQuickActionsModal(false)
    }
  }


  const customizeIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M3 3h18v18H3z"/>
      <path d="M9 9h6v6H9z"/>
    </svg>
  )

  return (
    <Layout 
      pageTitle="홈 화면 사용자 지정"
      pageSubtitle="홈 화면의 레이아웃과 표시 요소를 원하는 대로 설정하세요<br/>변경 사항은 자동으로 저장됩니다"
      pageIcon={customizeIcon}
    >
      <div className="home-screen-customization-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>설정을 불러오는 중...</p>
          </div>
        ) : (
          <div className="customization-content">
            <div className="setting-card">
                  <h3 className="setting-title">섹션 관리</h3>
                  <p className="setting-description">홈 화면에 표시할 섹션을 선택하고 순서를 조정하세요</p>
                  
                  <div className="sections-list">
                    {layout.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <div
                          key={section.id}
                          className={`section-item ${draggedSection === section.id ? 'dragging' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, section.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, section.id)}
                        >
                          <div className="section-header">
                            <div className="section-info">
                              <input
                                type="checkbox"
                                checked={section.enabled}
                                onChange={() => handleSectionToggle(section.id)}
                              />
                              <div className="section-details">
                                <h4>{section.title}</h4>
                                <p>{section.description}</p>
                              </div>
                            </div>
                            <div className="drag-handle">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="12" x2="21" y2="12"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <line x1="3" y1="18" x2="21" y2="18"/>
                              </svg>
                            </div>
                          </div>

                          {section.enabled && (
                            <div className="section-settings">
                              {section.type === 'stats' && (
                                <div className="setting-row">
                                  <div className="setting-group">
                                    <label>레이아웃</label>
                                    <CustomSelect
                                      options={[
                                        { value: 'grid', label: '그리드', icon: '▦' },
                                        { value: 'list', label: '목록', icon: '☰' }
                                      ]}
                                      value={section.settings.layout || 'grid'}
                                      onChange={(value) => handleSectionSettingChange(section.id, 'layout', value)}
                                      placeholder="레이아웃 선택"
                                    />
                                  </div>
                                  <div className="setting-toggles">
                                    <label className="mini-toggle">
                                      <input
                                        type="checkbox"
                                        checked={section.settings.showTodos !== false}
                                        onChange={(e) => handleSectionSettingChange(section.id, 'showTodos', e.target.checked)}
                                      />
                                      <span>할일 표시</span>
                                    </label>
                                    <label className="mini-toggle">
                                      <input
                                        type="checkbox"
                                        checked={section.settings.showProjects !== false}
                                        onChange={(e) => handleSectionSettingChange(section.id, 'showProjects', e.target.checked)}
                                      />
                                      <span>프로젝트 표시</span>
                                    </label>
                                    <label className="mini-toggle">
                                      <input
                                        type="checkbox"
                                        checked={section.settings.showCompletion !== false}
                                        onChange={(e) => handleSectionSettingChange(section.id, 'showCompletion', e.target.checked)}
                                      />
                                      <span>완료율 표시</span>
                                    </label>
                                  </div>
                                </div>
                              )}
                              {section.type === 'quickActions' && (
                                <div>
                                  <div className="setting-row">
                                    <div className="setting-group">
                                      <label>레이아웃</label>
                                      <CustomSelect
                                        options={[
                                          { value: 'grid', label: '그리드', icon: '▦' },
                                          { value: 'list', label: '목록', icon: '☰' }
                                        ]}
                                        value={section.settings.layout || 'grid'}
                                        onChange={(value) => handleSectionSettingChange(section.id, 'layout', value)}
                                        placeholder="레이아웃 선택"
                                      />
                                    </div>
                                    <div className="setting-group">
                                      <label>최대 항목 수</label>
                                      <CustomSelect
                                        options={[
                                          { value: '4', label: '4개', icon: '④' },
                                          { value: '6', label: '6개', icon: '⑥' },
                                          { value: '8', label: '8개', icon: '⑧' },
                                          { value: '12', label: '12개', icon: '⑫' }
                                        ]}
                                        value={String(section.settings.maxItems || 8)}
                                        onChange={(value) => handleSectionSettingChange(section.id, 'maxItems', parseInt(value))}
                                        placeholder="항목 수 선택"
                                      />
                                    </div>
                                  </div>
                                  <div className="setting-row" style={{ marginTop: '16px' }}>
                                    <button 
                                      type="button"
                                      className="quick-actions-customize-button"
                                      onClick={handleQuickActionsCustomize}
                                      disabled={quickActionsLoading}
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3"/>
                                        <path d="M12 2v2"/>
                                        <path d="M12 20v2"/>
                                        <path d="M4.93 4.93l1.41 1.41"/>
                                        <path d="M17.66 17.66l1.41 1.41"/>
                                        <path d="M2 12h2"/>
                                        <path d="M20 12h2"/>
                                        <path d="M6.34 17.66l-1.41 1.41"/>
                                        <path d="M19.07 4.93l-1.41 1.41"/>
                                      </svg>
                                      빠른 실행 메뉴 사용자 지정
                                    </button>
                                  </div>
                                </div>
                              )}
                              {section.type === 'progress' && (
                                <div className="setting-toggles">
                                  <label className="mini-toggle">
                                    <input
                                      type="checkbox"
                                      checked={section.settings.showPercentage !== false}
                                      onChange={(e) => handleSectionSettingChange(section.id, 'showPercentage', e.target.checked)}
                                    />
                                    <span>백분율 표시</span>
                                  </label>
                                  <label className="mini-toggle">
                                    <input
                                      type="checkbox"
                                      checked={section.settings.showDetails !== false}
                                      onChange={(e) => handleSectionSettingChange(section.id, 'showDetails', e.target.checked)}
                                    />
                                    <span>세부 정보 표시</span>
                                  </label>
                                </div>
                              )}
                              {section.type === 'activity' && (
                                <div className="setting-toggles">
                                  <label className="mini-toggle">
                                    <input
                                      type="checkbox"
                                      checked={section.settings.showChart !== false}
                                      onChange={(e) => handleSectionSettingChange(section.id, 'showChart', e.target.checked)}
                                    />
                                    <span>차트 표시</span>
                                  </label>
                                  <label className="mini-toggle">
                                    <input
                                      type="checkbox"
                                      checked={section.settings.showStats !== false}
                                      onChange={(e) => handleSectionSettingChange(section.id, 'showStats', e.target.checked)}
                                    />
                                    <span>통계 표시</span>
                                  </label>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/mypage')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5m7-7-7 7 7 7"/>
                </svg>
                돌아가기
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="spinner"></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17,21 17,13 7,13 7,21"/>
                      <polyline points="7,3 7,8 15,8"/>
                    </svg>
                    설정 저장
                  </>
                )}
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Quick Action Customizer Modal */}
      <QuickActionCustomizer
        isOpen={showQuickActionsModal}
        onClose={() => setShowQuickActionsModal(false)}
        onSave={handleQuickActionsSave}
        currentActions={quickActions}
      />
    </Layout>
  )
}

export default HomeScreenCustomization