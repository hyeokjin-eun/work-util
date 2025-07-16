import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import '../styles/MeetingNotes.css'

interface MeetingNote {
  id: number
  title: string
  content: string
  date: string
  participants: string[]
  tags: string[]
  priority: 'normal' | 'important' | 'urgent'
  actionItems: ActionItem[]
  createdAt: string
  updatedAt: string
}

interface ActionItem {
  id: number
  text: string
  assignee: string
  completed: boolean
  dueDate?: string
}

type SortType = 'date' | 'title' | 'priority'

const MeetingNotes: React.FC = () => {
  const { } = useAuth()
  
  useEffect(() => {
    // Scroll to top when MeetingNotes component loads
    window.scrollTo(0, 0)
  }, [])

  const [meetings, setMeetings] = useState<MeetingNote[]>([
    {
      id: 1,
      title: '주간 팀 미팅',
      content: '프로젝트 진행 상황 점검 및 다음 주 업무 계획 논의. 주요 이슈사항 및 해결 방안 검토하였습니다.\n\n주요 논의사항:\n1. 프로젝트 A 진행률 75% 완료\n2. 버그 리포트 10건 해결\n3. 다음 주 배포 일정 확정\n\n결정사항:\n- 코드 리뷰 프로세스 개선\n- 테스트 커버리지 80% 이상 유지',
      date: '2025-07-15',
      participants: ['김개발', '이디자인', '박기획', '최테스터'],
      tags: ['정기회의', '긴급'],
      priority: 'urgent',
      actionItems: [
        { id: 1, text: '코드 리뷰 가이드라인 작성', assignee: '김개발', completed: false, dueDate: '2025-07-20' },
        { id: 2, text: '테스트 케이스 추가 작성', assignee: '최테스터', completed: false, dueDate: '2025-07-18' }
      ],
      createdAt: '2025-07-15',
      updatedAt: '2025-07-15'
    },
    {
      id: 2,
      title: '프로젝트 킥오프',
      content: '새로운 프로젝트 시작을 위한 킥오프 미팅. 프로젝트 목표, 일정, 역할 분담 등 논의하였습니다.\n\n프로젝트 개요:\n- 프로젝트명: SmartWork 2.0\n- 기간: 3개월\n- 팀원: 5명\n\n역할 분담:\n- 프론트엔드: 김개발, 이디자인\n- 백엔드: 박서버\n- 기획: 박기획\n- QA: 최테스터',
      date: '2025-07-14',
      participants: ['김개발', '이디자인', '박기획', '최테스터', '박서버'],
      tags: ['중요', '프로젝트'],
      priority: 'important',
      actionItems: [
        { id: 3, text: '프로젝트 계획서 작성', assignee: '박기획', completed: true, dueDate: '2025-07-16' },
        { id: 4, text: '개발 환경 설정', assignee: '김개발', completed: false, dueDate: '2025-07-17' }
      ],
      createdAt: '2025-07-14',
      updatedAt: '2025-07-14'
    },
    {
      id: 3,
      title: '클라이언트 미팅',
      content: '클라이언트 요구사항 검토 및 프로젝트 방향성 논의. 추가 기능 요청사항 확인하였습니다.\n\n클라이언트 요청사항:\n1. 대시보드 UI/UX 개선\n2. 모바일 반응형 지원\n3. 데이터 내보내기 기능\n\n예산 및 일정:\n- 추가 비용: 500만원\n- 완료 예정일: 2025-08-30',
      date: '2025-07-13',
      participants: ['박기획', '김개발', '클라이언트'],
      tags: ['클라이언트', '요구사항'],
      priority: 'normal',
      actionItems: [
        { id: 5, text: '요구사항 명세서 업데이트', assignee: '박기획', completed: false, dueDate: '2025-07-19' },
        { id: 6, text: '개발 일정 재조정', assignee: '김개발', completed: false, dueDate: '2025-07-20' }
      ],
      createdAt: '2025-07-13',
      updatedAt: '2025-07-13'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [sortBy, setSortBy] = useState<SortType>('date')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingNote | null>(null)
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    participants: [''],
    tags: [''],
    priority: 'normal' as const,
    actionItems: [{ text: '', assignee: '', dueDate: '' }]
  })

  const priorityColors = {
    normal: '#6b7280',
    important: '#f59e0b',
    urgent: '#ef4444'
  }

  const priorityLabels = {
    normal: '일반',
    important: '중요',
    urgent: '긴급'
  }

  const memoIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  )

  const getAllTags = () => {
    const tags = new Set<string>()
    meetings.forEach(meeting => {
      meeting.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }

  const filteredAndSortedMeetings = meetings
    .filter(meeting => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meeting.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meeting.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesTag = selectedTag === 'all' || meeting.tags.includes(selectedTag)
      
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'priority':
          const priorityOrder = { urgent: 3, important: 2, normal: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

  const handleAddMeeting = () => {
    if (!newMeeting.title.trim()) return

    const meeting: MeetingNote = {
      id: Date.now(),
      title: newMeeting.title,
      content: newMeeting.content,
      date: newMeeting.date,
      participants: newMeeting.participants.filter(p => p.trim() !== ''),
      tags: newMeeting.tags.filter(t => t.trim() !== ''),
      priority: newMeeting.priority,
      actionItems: newMeeting.actionItems
        .filter(item => item.text.trim() !== '')
        .map((item, index) => ({
          id: Date.now() + index,
          text: item.text,
          assignee: item.assignee,
          completed: false,
          dueDate: item.dueDate || undefined
        })),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }

    setMeetings([...meetings, meeting])
    setNewMeeting({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      participants: [''],
      tags: [''],
      priority: 'normal',
      actionItems: [{ text: '', assignee: '', dueDate: '' }]
    })
    setShowAddModal(false)
  }

  const handleDeleteMeeting = (id: number) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id))
  }

  const handleViewDetail = (meeting: MeetingNote) => {
    setSelectedMeeting(meeting)
    setShowDetailModal(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const addParticipant = () => {
    setNewMeeting({
      ...newMeeting,
      participants: [...newMeeting.participants, '']
    })
  }

  const removeParticipant = (index: number) => {
    setNewMeeting({
      ...newMeeting,
      participants: newMeeting.participants.filter((_, i) => i !== index)
    })
  }

  const addTag = () => {
    setNewMeeting({
      ...newMeeting,
      tags: [...newMeeting.tags, '']
    })
  }

  const removeTag = (index: number) => {
    setNewMeeting({
      ...newMeeting,
      tags: newMeeting.tags.filter((_, i) => i !== index)
    })
  }

  const addActionItem = () => {
    setNewMeeting({
      ...newMeeting,
      actionItems: [...newMeeting.actionItems, { text: '', assignee: '', dueDate: '' }]
    })
  }

  const removeActionItem = (index: number) => {
    setNewMeeting({
      ...newMeeting,
      actionItems: newMeeting.actionItems.filter((_, i) => i !== index)
    })
  }

  const toggleActionItem = (meetingId: number, actionItemId: number) => {
    setMeetings(meetings.map(meeting =>
      meeting.id === meetingId
        ? {
          ...meeting,
          actionItems: meeting.actionItems.map(item =>
            item.id === actionItemId
              ? { ...item, completed: !item.completed }
              : item
          )
        }
        : meeting
    ))
  }

  return (
    <Layout
      pageTitle="회의록 메모"
      pageSubtitle="구조화된 회의록 작성하고<br/>액션 아이템 관리하세요"
      pageIcon={memoIcon}
    >
      <div className="meeting-notes-container">
        <button 
          className="add-memo-btn"
          onClick={() => setShowAddModal(true)}
        >
          ➕ 새 회의 작성
        </button>

        <div className="search-filter-section">
          <div className="search-group">
            <input
              type="text"
              placeholder="회의록 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">태그</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="filter-select"
              >
                <option value="all">전체</option>
                {getAllTags().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">정렬</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="filter-select"
              >
                <option value="date">날짜순</option>
                <option value="title">제목순</option>
                <option value="priority">우선순위</option>
              </select>
            </div>
          </div>
        </div>

        <div className="memo-section">
          <div className="memo-header">
            <div className="memo-title">회의 목록</div>
            <div className="memo-count">{filteredAndSortedMeetings.length}</div>
          </div>
          
          {filteredAndSortedMeetings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>회의록이 없습니다</h3>
              <p>새로운 회의록을 작성해보세요!</p>
            </div>
          ) : (
            <div className="meeting-list">
              {filteredAndSortedMeetings.map(meeting => (
                <div 
                  key={meeting.id} 
                  className="memo-item"
                  onClick={() => handleViewDetail(meeting)}
                >
                  <div className="memo-item-header">
                    <div className="memo-item-title">{meeting.title}</div>
                    <div className="memo-item-date">{formatDate(meeting.date)}</div>
                  </div>
                  
                  <div className="memo-item-preview">
                    {meeting.content.substring(0, 100)}...
                  </div>
                  
                  <div className="memo-item-meta">
                    <div className="participants-info">
                      👥 {meeting.participants.length}명 참석
                    </div>
                    <div className="action-items-info">
                      ✅ {meeting.actionItems.filter(item => item.completed).length}/{meeting.actionItems.length} 완료
                    </div>
                  </div>
                  
                  <div className="memo-item-tags">
                    <span 
                      className="priority-tag"
                      style={{ backgroundColor: priorityColors[meeting.priority] }}
                    >
                      {priorityLabels[meeting.priority]}
                    </span>
                    {meeting.tags.map(tag => (
                      <span key={tag} className="memo-tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="memo-item-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteMeeting(meeting.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Meeting Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>새 회의록 작성</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>회의 제목 *</label>
                  <input
                    type="text"
                    placeholder="회의 제목을 입력하세요"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                    className="form-input"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>회의 날짜</label>
                    <input
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>우선순위</label>
                    <select
                      value={newMeeting.priority}
                      onChange={(e) => setNewMeeting({...newMeeting, priority: e.target.value as typeof newMeeting.priority})}
                      className="form-select"
                    >
                      <option value="normal">일반</option>
                      <option value="important">중요</option>
                      <option value="urgent">긴급</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>회의 내용</label>
                  <textarea
                    placeholder="회의 내용을 입력하세요"
                    value={newMeeting.content}
                    onChange={(e) => setNewMeeting({...newMeeting, content: e.target.value})}
                    className="form-textarea"
                    rows={5}
                  />
                </div>
                
                <div className="form-group">
                  <label>참석자</label>
                  {newMeeting.participants.map((participant, index) => (
                    <div key={index} className="input-with-button">
                      <input
                        type="text"
                        placeholder="참석자 이름"
                        value={participant}
                        onChange={(e) => {
                          const newParticipants = [...newMeeting.participants]
                          newParticipants[index] = e.target.value
                          setNewMeeting({...newMeeting, participants: newParticipants})
                        }}
                        className="form-input"
                      />
                      {newMeeting.participants.length > 1 && (
                        <button 
                          type="button"
                          className="remove-btn"
                          onClick={() => removeParticipant(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    className="add-item-btn"
                    onClick={addParticipant}
                  >
                    + 참석자 추가
                  </button>
                </div>
                
                <div className="form-group">
                  <label>태그</label>
                  {newMeeting.tags.map((tag, index) => (
                    <div key={index} className="input-with-button">
                      <input
                        type="text"
                        placeholder="태그 입력"
                        value={tag}
                        onChange={(e) => {
                          const newTags = [...newMeeting.tags]
                          newTags[index] = e.target.value
                          setNewMeeting({...newMeeting, tags: newTags})
                        }}
                        className="form-input"
                      />
                      {newMeeting.tags.length > 1 && (
                        <button 
                          type="button"
                          className="remove-btn"
                          onClick={() => removeTag(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    className="add-item-btn"
                    onClick={addTag}
                  >
                    + 태그 추가
                  </button>
                </div>
                
                <div className="form-group">
                  <label>액션 아이템</label>
                  {newMeeting.actionItems.map((item, index) => (
                    <div key={index} className="action-item-form">
                      <input
                        type="text"
                        placeholder="액션 아이템"
                        value={item.text}
                        onChange={(e) => {
                          const newActionItems = [...newMeeting.actionItems]
                          newActionItems[index] = {...newActionItems[index], text: e.target.value}
                          setNewMeeting({...newMeeting, actionItems: newActionItems})
                        }}
                        className="form-input"
                      />
                      <div className="action-item-details">
                        <input
                          type="text"
                          placeholder="담당자"
                          value={item.assignee}
                          onChange={(e) => {
                            const newActionItems = [...newMeeting.actionItems]
                            newActionItems[index] = {...newActionItems[index], assignee: e.target.value}
                            setNewMeeting({...newMeeting, actionItems: newActionItems})
                          }}
                          className="form-input"
                        />
                        <input
                          type="date"
                          value={item.dueDate}
                          onChange={(e) => {
                            const newActionItems = [...newMeeting.actionItems]
                            newActionItems[index] = {...newActionItems[index], dueDate: e.target.value}
                            setNewMeeting({...newMeeting, actionItems: newActionItems})
                          }}
                          className="form-input"
                        />
                        {newMeeting.actionItems.length > 1 && (
                          <button 
                            type="button"
                            className="remove-btn"
                            onClick={() => removeActionItem(index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button 
                    type="button"
                    className="add-item-btn"
                    onClick={addActionItem}
                  >
                    + 액션 아이템 추가
                  </button>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  취소
                </button>
                <button 
                  className="submit-btn"
                  onClick={handleAddMeeting}
                  disabled={!newMeeting.title.trim()}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meeting Detail Modal */}
        {showDetailModal && selectedMeeting && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedMeeting.title}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowDetailModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="meeting-info">
                  <div className="info-row">
                    <span className="info-label">날짜:</span>
                    <span>{formatDate(selectedMeeting.date)}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">우선순위:</span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: priorityColors[selectedMeeting.priority] }}
                    >
                      {priorityLabels[selectedMeeting.priority]}
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">참석자:</span>
                    <div className="participants-list">
                      {selectedMeeting.participants.map((participant, index) => (
                        <span key={index} className="participant-tag">{participant}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">태그:</span>
                    <div className="tags-list">
                      {selectedMeeting.tags.map((tag, index) => (
                        <span key={index} className="memo-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="meeting-content">
                  <h3>회의 내용</h3>
                  <div className="content-text">
                    {selectedMeeting.content.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
                
                <div className="action-items-section">
                  <h3>액션 아이템</h3>
                  {selectedMeeting.actionItems.length === 0 ? (
                    <p className="no-action-items">액션 아이템이 없습니다.</p>
                  ) : (
                    <div className="action-items-list">
                      {selectedMeeting.actionItems.map(item => (
                        <div key={item.id} className={`action-item ${item.completed ? 'completed' : ''}`}>
                          <div className="action-item-checkbox">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleActionItem(selectedMeeting.id, item.id)}
                            />
                            <span className="checkmark"></span>
                          </div>
                          <div className="action-item-content">
                            <div className="action-item-text">{item.text}</div>
                            <div className="action-item-meta">
                              <span className="assignee">담당: {item.assignee}</span>
                              {item.dueDate && (
                                <span className="due-date">마감: {formatDate(item.dueDate)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MeetingNotes