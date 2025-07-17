import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import CustomSelect from '../components/CustomSelect'
import { apiCall, apiCallWithJson } from '../utils/api'
import '../styles/MeetingNotes.css'

interface Meeting {
  id: number
  title: string
  date: string
  time: string
  location: string
  attendees: string[]
  agenda: string
  created_at: string
  updated_at: string
}

type SortType = 'date' | 'title' | 'created_at'

const MeetingNotes: React.FC = () => {
  const { token, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
    
    // 회의록 삭제 후 성공 메시지 표시
    if (location.state?.message) {
      console.log(location.state.message)
    }
    
    if (!isLoading) {
      loadMeetings()
    }
  }, [location.state, isLoading])

  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortType>('date')

  const sortOptions = [
    { value: 'date', label: '회의 날짜순', icon: '📅' },
    { value: 'created_at', label: '등록일순', icon: '🕐' },
    { value: 'title', label: '제목순', icon: '📝' }
  ]

  const loadMeetings = async () => {
    try {
      setLoading(true)
      if (!token) {
        console.log('토큰이 없습니다. 로그인 페이지로 이동합니다.')
        navigate('/login')
        return
      }
      
      console.log('회의록 목록 로드 시도 중...')
      const meetingsData = await apiCallWithJson<Meeting[]>('/api/meetings', {
        token
      })
      console.log('회의록 목록 로드 성공:', meetingsData)
      
      setMeetings(meetingsData)
    } catch (error) {
      console.error('회의록 목록 로드 실패:', error)
      setMeetings([])
    } finally {
      setLoading(false)
    }
  }

  const deleteMeeting = async (id: number) => {
    if (!confirm('이 회의록을 삭제하시겠습니까?')) return
    
    try {
      if (!token) {
        navigate('/login')
        return
      }
      
      await apiCallWithJson(`/api/meetings/${id}`, {
        method: 'DELETE',
        token
      })
      
      // 성공 시 로컬 상태 업데이트
      setMeetings(meetings.filter(meeting => meeting.id !== id))
    } catch (error) {
      console.error('회의록 삭제 실패:', error)
      alert('회의록 삭제 중 오류가 발생했습니다.')
    }
  }

  const filteredAndSortedMeetings = meetings
    .filter(meeting => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meeting.agenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meeting.attendees.some(attendee => attendee.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = new Date(`${a.date} ${a.time}`)
          const dateB = new Date(`${b.date} ${b.time}`)
          return dateB.getTime() - dateA.getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const period = hour >= 12 ? '오후' : '오전'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${period} ${displayHour}:${minutes}`
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

  const handleViewDetail = (meeting: Meeting) => {
    navigate(`/meeting/${meeting.id}`)
  }

  const handleAddMeeting = () => {
    navigate('/meeting/add')
  }

  return (
    <Layout
      pageTitle="회의록 메모"
      pageSubtitle="구조화된 회의록 작성하고<br/>체계적으로 관리하세요"
      pageIcon={memoIcon}
    >
      <div className="meeting-notes-container">
        <div className="add-meeting-button">
          <button 
            className="add-memo-btn"
            onClick={handleAddMeeting}
          >
            ✨ 새 회의록 작성
          </button>
        </div>

        <div className="search-filter-section">
          <div className="search-group">
            <input
              type="text"
              placeholder="회의록 제목, 안건, 참석자 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">정렬</label>
              <CustomSelect
                options={sortOptions}
                value={sortBy}
                onChange={(value) => setSortBy(value as SortType)}
                placeholder="정렬 방식을 선택하세요"
              />
            </div>
          </div>
        </div>

        <div className="memo-section">
          <div className="memo-header">
            <div className="memo-title">회의록 목록</div>
            <div className="memo-count">{filteredAndSortedMeetings.length}</div>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>회의록을 불러오는 중...</p>
            </div>
          ) : filteredAndSortedMeetings.length === 0 ? (
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
                    <div className="memo-item-date">
                      {formatDate(meeting.date)} {formatTime(meeting.time)}
                    </div>
                  </div>
                  
                  <div className="memo-item-preview">
                    {meeting.agenda ? meeting.agenda.substring(0, 100) + '...' : '안건이 없습니다.'}
                  </div>
                  
                  <div className="memo-item-meta">
                    <div className="location-info">
                      {meeting.location && (
                        <span>📍 {meeting.location}</span>
                      )}
                    </div>
                    <div className="participants-info">
                      👥 {meeting.attendees.length}명 참석
                    </div>
                  </div>
                  
                  <div className="memo-item-tags">
                    {meeting.attendees.slice(0, 3).map((attendee, index) => (
                      <span key={index} className="attendee-tag">{attendee}</span>
                    ))}
                    {meeting.attendees.length > 3 && (
                      <span className="attendee-tag">+{meeting.attendees.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="memo-item-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteMeeting(meeting.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MeetingNotes