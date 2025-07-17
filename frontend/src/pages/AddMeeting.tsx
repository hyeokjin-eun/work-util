import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import DatePicker from '../components/DatePicker'
import TimePicker from '../components/TimePicker'
import { apiCall } from '../utils/api'
import '../styles/AddMeeting.css'

interface MeetingFormData {
  title: string
  date: string
  time: string
  location: string
  attendees: string[]
  agenda: string
  content: string
  decisions: string
  action_items: string
}

const AddMeeting: React.FC = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [formData, setFormData] = useState<MeetingFormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: [],
    agenda: '',
    content: '',
    decisions: '',
    action_items: ''
  })

  const [newAttendee, setNewAttendee] = useState('')
  const [showAttendeeInput, setShowAttendeeInput] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addMeetingIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
      <path d="M12 15v2m0-6v2"/>
    </svg>
  )

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.title.trim()) {
      newErrors.title = '회의 제목을 입력해주세요'
    }

    if (formData.title.length > 100) {
      newErrors.title = '제목은 100자를 초과할 수 없습니다'
    }

    if (!formData.date) {
      newErrors.date = '회의 날짜를 선택해주세요'
    }

    if (!formData.time) {
      newErrors.time = '회의 시간을 입력해주세요'
    }

    if (formData.content.length > 2000) {
      newErrors.content = '회의 내용은 2000자를 초과할 수 없습니다'
    }

    if (formData.agenda.length > 1000) {
      newErrors.agenda = '안건은 1000자를 초과할 수 없습니다'
    }

    if (formData.decisions.length > 1000) {
      newErrors.decisions = '결정사항은 1000자를 초과할 수 없습니다'
    }

    if (formData.action_items.length > 1000) {
      newErrors.action_items = '액션아이템은 1000자를 초과할 수 없습니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }
      
      const response = await apiCall('/api/meetings', {
        method: 'POST',
        token,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          attendees: formData.attendees,
          agenda: formData.agenda,
          content: formData.content,
          decisions: formData.decisions,
          action_items: formData.action_items
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '회의록 추가에 실패했습니다.')
      }
      
      const result = await response.json()
      
      navigate('/meeting-notes', { 
        state: { 
          message: result.message || '새 회의록이 성공적으로 추가되었습니다!',
          newMeetingId: result.meeting?.id 
        }
      })
    } catch (error) {
      console.error('회의록 추가 중 오류 발생:', error)
      if (error instanceof Error && error.message.includes('인증이 만료되었습니다')) {
        navigate('/login')
        return
      }
      setErrors({ submit: error instanceof Error ? error.message : '회의록 추가 중 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAttendeeAdd = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }))
      setNewAttendee('')
      setShowAttendeeInput(false)
    }
  }

  const handleAttendeeRemove = (attendeeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(attendee => attendee !== attendeeToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAttendeeAdd()
    }
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  return (
    <Layout
      pageTitle="새 회의록 추가"
      pageSubtitle="회의 내용을 체계적으로<br/>기록하고 관리해보세요"
      pageIcon={addMeetingIcon}
    >
      <div className="add-meeting-container">
        <form onSubmit={handleSubmit} className="add-meeting-form">
          {/* 회의 제목 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label required">
                회의 제목
                <span className="char-count">
                  {formData.title.length}/100
                </span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="회의 제목을 입력하세요"
                className={`form-input ${errors.title ? 'error' : ''}`}
                maxLength={100}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
          </div>

          {/* 날짜 및 시간 */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">회의 날짜</label>
                <DatePicker
                  value={formData.date}
                  onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                  placeholder="날짜를 선택하세요"
                  className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label className="form-label required">회의 시간</label>
                <TimePicker
                  value={formData.time}
                  onChange={(time) => setFormData(prev => ({ ...prev, time }))}
                  placeholder="시간을 선택하세요"
                  className={errors.time ? 'error' : ''}
                />
                {errors.time && <span className="error-message">{errors.time}</span>}
              </div>
            </div>
          </div>

          {/* 장소 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">회의 장소</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="회의 장소를 입력하세요"
                className="form-input"
              />
            </div>
          </div>

          {/* 참석자 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">참석자</label>
              <div className="attendees-container">
                {formData.attendees.map(attendee => (
                  <span key={attendee} className="attendee">
                    {attendee}
                    <button
                      type="button"
                      onClick={() => handleAttendeeRemove(attendee)}
                      className="attendee-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {showAttendeeInput ? (
                  <div className="attendee-input-container">
                    <input
                      type="text"
                      value={newAttendee}
                      onChange={(e) => setNewAttendee(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="참석자 이름"
                      className="attendee-input"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAttendeeAdd}
                      className="attendee-add-confirm"
                    >
                      추가
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAttendeeInput(false)
                        setNewAttendee('')
                      }}
                      className="attendee-add-cancel"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAttendeeInput(true)}
                    className="attendee-add-button"
                  >
                    + 참석자 추가
                  </button>
                )}
                
                {formData.attendees.length === 0 && !showAttendeeInput && (
                  <span className="no-attendees">참석자를 추가해주세요</span>
                )}
              </div>
            </div>
          </div>

          {/* 안건 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                회의 안건
                <span className="char-count">
                  {formData.agenda.length}/1000
                </span>
              </label>
              <textarea
                value={formData.agenda}
                onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
                placeholder="회의 안건을 입력하세요"
                className={`form-textarea ${errors.agenda ? 'error' : ''}`}
                rows={3}
                maxLength={1000}
              />
              {errors.agenda && <span className="error-message">{errors.agenda}</span>}
            </div>
          </div>

          {/* 회의 내용 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                회의 내용
                <span className="char-count">
                  {formData.content.length}/2000
                </span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="회의 내용을 상세히 입력하세요"
                className={`form-textarea ${errors.content ? 'error' : ''}`}
                rows={6}
                maxLength={2000}
              />
              {errors.content && <span className="error-message">{errors.content}</span>}
            </div>
          </div>

          {/* 결정사항 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                결정사항
                <span className="char-count">
                  {formData.decisions.length}/1000
                </span>
              </label>
              <textarea
                value={formData.decisions}
                onChange={(e) => setFormData(prev => ({ ...prev, decisions: e.target.value }))}
                placeholder="회의에서 결정된 사항들을 입력하세요"
                className={`form-textarea ${errors.decisions ? 'error' : ''}`}
                rows={4}
                maxLength={1000}
              />
              {errors.decisions && <span className="error-message">{errors.decisions}</span>}
            </div>
          </div>

          {/* 액션아이템 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                액션아이템
                <span className="char-count">
                  {formData.action_items.length}/1000
                </span>
              </label>
              <textarea
                value={formData.action_items}
                onChange={(e) => setFormData(prev => ({ ...prev, action_items: e.target.value }))}
                placeholder="후속 조치 사항들을 입력하세요"
                className={`form-textarea ${errors.action_items ? 'error' : ''}`}
                rows={4}
                maxLength={1000}
              />
              {errors.action_items && <span className="error-message">{errors.action_items}</span>}
            </div>
          </div>

          {/* 에러 메시지 */}
          {errors.submit && (
            <div className="form-section">
              <div className="error-message global-error">
                {errors.submit}
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/meeting-notes')}
              className="cancel-button"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !formData.title.trim() || !formData.date || !formData.time}
            >
              {isSubmitting ? '추가 중...' : '회의록 추가'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default AddMeeting