import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import DatePicker from '../components/DatePicker'
import TimePicker from '../components/TimePicker'
import { apiCall } from '../utils/api'
import '../styles/MeetingDetail.css'

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

const MeetingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { token, isLoading } = useAuth()
  const navigate = useNavigate()
  
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
  const [pageLoading, setPageLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const meetingDetailIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
      <circle cx="12" cy="16" r="1"/>
    </svg>
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    
    if (!isLoading && id && !isDeleting) {
      loadMeetingDetail()
    }
  }, [isLoading, id, isDeleting])

  const loadMeetingDetail = async () => {
    try {
      if (!id) {
        navigate('/meeting-notes')
        return
      }
      
      if (!token) {
        console.log('토큰이 없습니다. 인증 확인 중...')
        return
      }

      const response = await apiCall(`/api/meetings/${id}`, {
        method: 'GET',
        token
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const meetingData = await response.json()

      setFormData({
        title: meetingData.title || '',
        date: meetingData.date || '',
        time: meetingData.time || '',
        location: meetingData.location || '',
        attendees: Array.isArray(meetingData.attendees) ? meetingData.attendees : [],
        agenda: meetingData.agenda || '',
        content: meetingData.content || '',
        decisions: meetingData.decisions || '',
        action_items: meetingData.action_items || ''
      })
      
    } catch (error) {
      console.error('회의록 상세 정보 로드 실패:', error)
      setFormData({
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
    } finally {
      setPageLoading(false)
    }
  }

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

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      if (!token || !id) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const requestData = {
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        attendees: formData.attendees,
        agenda: formData.agenda,
        content: formData.content,
        decisions: formData.decisions,
        action_items: formData.action_items
      }
      
      console.log('회의록 수정 요청 데이터:', requestData)
      
      const response = await apiCall(`/api/meetings/${id}`, {
        method: 'PUT',
        token,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '수정 중 오류가 발생했습니다.' }))
        console.error('API 에러 응답:', errorData)
        const errorMessage = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : Array.isArray(errorData.detail) 
            ? errorData.detail.map((err: any) => err.msg || err).join(', ')
            : errorData.message || JSON.stringify(errorData) || '회의록 수정 중 오류가 발생했습니다.'
        throw new Error(errorMessage)
      }

      // 수정 완료 후 회의록 목록으로 이동
      navigate('/meeting-notes', {
        state: {
          message: '회의록이 성공적으로 수정되었습니다.'
        }
      })
    } catch (error) {
      console.error('회의록 수정 중 오류 발생:', error)
      setErrors({ submit: error instanceof Error ? error.message : '회의록 수정 중 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('이 회의록을 삭제하시겠습니까?')) return

    try {
      if (!token || !id) {
        throw new Error('인증 토큰이 없습니다.')
      }

      setIsDeleting(true)

      const response = await apiCall(`/api/meetings/${id}`, {
        method: 'DELETE',
        token
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '삭제 중 오류가 발생했습니다.' }))
        throw new Error(errorData.detail || errorData.message || '회의록 삭제 중 오류가 발생했습니다.')
      }

      // Immediately navigate without any delays
      console.log('회의록 삭제 완료, 목록 페이지로 이동...')
      navigate('/meeting-notes', { 
        replace: true,
        state: { 
          message: '회의록이 성공적으로 삭제되었습니다.',
        }
      })
      
    } catch (error) {
      console.error('회의록 삭제 중 오류 발생:', error)
      alert('회의록 삭제 중 오류가 발생했습니다. 다시 시도해주세요.')
      setIsDeleting(false)
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

  const formatTime = (timeString: string) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    return `${hours}:${minutes}`
  }

  if (pageLoading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>회의록 정보를 불러오는 중...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      pageTitle={isEditing ? "회의록 수정" : "회의록 상세"}
      pageSubtitle={isEditing ? "회의록 정보를 수정해보세요" : "회의록 정보를 확인하고<br/>수정하거나 삭제할 수 있습니다"}
      pageIcon={meetingDetailIcon}
    >
      <div className="meeting-detail-container">
        <form className="meeting-detail-form">
          {/* 회의 제목 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label required">
                회의 제목
                {isEditing && (
                  <span className="char-count">
                    {formData.title.length}/100
                  </span>
                )}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                    if (errors.title) {
                      setErrors(prev => ({ ...prev, title: '' }))
                    }
                  }}
                  placeholder="회의 제목을 입력하세요"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  maxLength={100}
                />
              ) : (
                <div className="view-field title-field">{formData.title}</div>
              )}
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
          </div>

          {/* 날짜 및 시간 */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">회의 날짜</label>
                {isEditing ? (
                  <DatePicker
                    value={formData.date}
                    onChange={(date) => {
                      setFormData(prev => ({ ...prev, date }))
                      if (errors.date) {
                        setErrors(prev => ({ ...prev, date: '' }))
                      }
                    }}
                    placeholder="날짜를 선택하세요"
                    className={errors.date ? 'error' : ''}
                  />
                ) : (
                  <div className="view-field date-field">
                    {formData.date ? new Date(formData.date).toLocaleDateString('ko-KR') : '날짜가 설정되지 않았습니다.'}
                  </div>
                )}
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label className="form-label required">회의 시간</label>
                {isEditing ? (
                  <TimePicker
                    value={formData.time}
                    onChange={(time) => {
                      setFormData(prev => ({ ...prev, time }))
                      if (errors.time) {
                        setErrors(prev => ({ ...prev, time: '' }))
                      }
                    }}
                    placeholder="시간을 선택하세요"
                    className={errors.time ? 'error' : ''}
                  />
                ) : (
                  <div className="view-field time-field">
                    {formData.time ? formatTime(formData.time) : '시간이 설정되지 않았습니다.'}
                  </div>
                )}
                {errors.time && <span className="error-message">{errors.time}</span>}
              </div>
            </div>
          </div>

          {/* 장소 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">회의 장소</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="회의 장소를 입력하세요"
                  className="form-input"
                />
              ) : (
                <div className="view-field location-field">
                  {formData.location || '장소가 설정되지 않았습니다.'}
                </div>
              )}
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
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleAttendeeRemove(attendee)}
                        className="attendee-remove"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                
                {isEditing && (
                  <>
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
                  </>
                )}
                
                {formData.attendees.length === 0 && !isEditing && (
                  <span className="no-attendees">참석자가 없습니다.</span>
                )}
              </div>
            </div>
          </div>

          {/* 안건 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                회의 안건
                {isEditing && (
                  <span className="char-count">
                    {formData.agenda.length}/1000
                  </span>
                )}
              </label>
              {isEditing ? (
                <textarea
                  value={formData.agenda}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, agenda: e.target.value }))
                    if (errors.agenda) {
                      setErrors(prev => ({ ...prev, agenda: '' }))
                    }
                  }}
                  placeholder="회의 안건을 입력하세요"
                  className={`form-textarea ${errors.agenda ? 'error' : ''}`}
                  rows={3}
                  maxLength={1000}
                />
              ) : (
                <div className="view-field agenda-field">
                  {formData.agenda || '안건이 없습니다.'}
                </div>
              )}
              {errors.agenda && <span className="error-message">{errors.agenda}</span>}
            </div>
          </div>

          {/* 회의 내용 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                회의 내용
                {isEditing && (
                  <span className="char-count">
                    {formData.content.length}/2000
                  </span>
                )}
              </label>
              {isEditing ? (
                <textarea
                  value={formData.content}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, content: e.target.value }))
                    if (errors.content) {
                      setErrors(prev => ({ ...prev, content: '' }))
                    }
                  }}
                  placeholder="회의 내용을 상세히 입력하세요"
                  className={`form-textarea ${errors.content ? 'error' : ''}`}
                  rows={6}
                  maxLength={2000}
                />
              ) : (
                <div className="view-field content-field">
                  {formData.content || '회의 내용이 없습니다.'}
                </div>
              )}
              {errors.content && <span className="error-message">{errors.content}</span>}
            </div>
          </div>

          {/* 결정사항 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                결정사항
                {isEditing && (
                  <span className="char-count">
                    {formData.decisions.length}/1000
                  </span>
                )}
              </label>
              {isEditing ? (
                <textarea
                  value={formData.decisions}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, decisions: e.target.value }))
                    if (errors.decisions) {
                      setErrors(prev => ({ ...prev, decisions: '' }))
                    }
                  }}
                  placeholder="회의에서 결정된 사항들을 입력하세요"
                  className={`form-textarea ${errors.decisions ? 'error' : ''}`}
                  rows={4}
                  maxLength={1000}
                />
              ) : (
                <div className="view-field decisions-field">
                  {formData.decisions || '결정사항이 없습니다.'}
                </div>
              )}
              {errors.decisions && <span className="error-message">{errors.decisions}</span>}
            </div>
          </div>

          {/* 액션아이템 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                액션아이템
                {isEditing && (
                  <span className="char-count">
                    {formData.action_items.length}/1000
                  </span>
                )}
              </label>
              {isEditing ? (
                <textarea
                  value={formData.action_items}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, action_items: e.target.value }))
                    if (errors.action_items) {
                      setErrors(prev => ({ ...prev, action_items: '' }))
                    }
                  }}
                  placeholder="후속 조치 사항들을 입력하세요"
                  className={`form-textarea ${errors.action_items ? 'error' : ''}`}
                  rows={4}
                  maxLength={1000}
                />
              ) : (
                <div className="view-field action-items-field">
                  {formData.action_items || '액션아이템이 없습니다.'}
                </div>
              )}
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
          {!isEditing ? (
            <>
              <div className="form-actions">
                <button 
                  className="submit-button"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ 수정
                </button>
              </div>
              <div className="form-actions" style={{ marginTop: '16px', paddingTop: '0', borderTop: 'none' }}>
                <button 
                  className="submit-button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{ 
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
                    width: '100%'
                  }}
                >
                  {isDeleting ? '삭제 중...' : '🗑️ 삭제'}
                </button>
              </div>
              <div className="form-actions" style={{ marginTop: '16px', paddingTop: '0', borderTop: 'none' }}>
                <button 
                  className="cancel-button"
                  onClick={() => navigate('/meeting-notes')}
                  style={{ width: '100%' }}
                >
                  목록으로
                </button>
              </div>
            </>
          ) : (
            <div className="form-actions">
              <button 
                className="cancel-button"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button 
                className="submit-button"
                onClick={handleSave}
                disabled={isSubmitting || !formData.title.trim() || !formData.date || !formData.time}
              >
                {isSubmitting ? '저장 중...' : '💾 저장'}
              </button>
            </div>
          )}
        </form>
      </div>
    </Layout>
  )
}

export default MeetingDetail