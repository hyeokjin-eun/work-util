import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import Layout from '../components/Layout'
import DatePicker from '../components/DatePicker'
import CustomSelect from '../components/CustomSelect'
import { apiCall } from '../utils/api'
import '../styles/AddWBS.css'

interface WBSProjectFormData {
  title: string
  description: string
  start_date: string
  end_date: string
  status: string
}

const AddWBS: React.FC = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [formData, setFormData] = useState<WBSProjectFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planning'
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addWBSIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <path d="M3 3h18v18H3z"/>
      <path d="M12 8v8m-4-4h8M7 3v18m10-18v18"/>
      <path d="M12 15v2m0-6v2"/>
    </svg>
  )

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.title.trim()) {
      newErrors.title = '프로젝트 제목을 입력해주세요'
    }

    if (formData.title.length > 200) {
      newErrors.title = '제목은 200자를 초과할 수 없습니다'
    }

    if (!formData.start_date) {
      newErrors.start_date = '시작일을 선택해주세요'
    }

    if (!formData.end_date) {
      newErrors.end_date = '종료일을 선택해주세요'
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      
      if (startDate > endDate) {
        newErrors.end_date = '종료일은 시작일보다 늦어야 합니다'
      }
    }

    if (formData.description.length > 2000) {
      newErrors.description = '설명은 2000자를 초과할 수 없습니다'
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
      
      const requestData = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        status: formData.status
      }
      
      console.log('WBS 프로젝트 생성 요청:', requestData)
      
      const response = await apiCall('/api/wbs/projects', {
        method: 'POST',
        token,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
      
      console.log('API 응답 상태:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'WBS 프로젝트 생성에 실패했습니다.' }))
        console.error('API 에러 응답:', errorData)
        throw new Error(errorData.detail || 'WBS 프로젝트 생성에 실패했습니다.')
      }
      
      const result = await response.json()
      console.log('생성된 프로젝트:', result)
      
      navigate('/wbs', { 
        state: { 
          message: '새 WBS 프로젝트가 성공적으로 생성되었습니다!',
          newProjectId: result.id
        }
      })
    } catch (error) {
      console.error('WBS 프로젝트 생성 중 오류 발생:', error)
      if (error instanceof Error && error.message.includes('인증이 만료되었습니다')) {
        navigate('/login')
        return
      }
      setErrors({ submit: error instanceof Error ? error.message : 'WBS 프로젝트 생성 중 오류가 발생했습니다. 다시 시도해주세요.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusOptions = [
    { value: 'planning', label: '계획', icon: '📋', description: '프로젝트 계획 단계' },
    { value: 'in_progress', label: '진행중', icon: '⚡', description: '현재 진행 중인 프로젝트' },
    { value: 'completed', label: '완료', icon: '✅', description: '완료된 프로젝트' },
    { value: 'on_hold', label: '보류', icon: '⏸️', description: '일시 중단된 프로젝트' }
  ]

  return (
    <Layout
      pageTitle="새 WBS 프로젝트"
      pageSubtitle="프로젝트 정보를 입력하여<br/>WBS를 생성하세요"
      pageIcon={addWBSIcon}
    >
      <div className="add-wbs-container">
        <form onSubmit={handleSubmit} className="add-wbs-form">
          {/* 프로젝트 제목 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label required">
                프로젝트 제목
                <span className="char-count">
                  {formData.title.length}/200
                </span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: '' }))
                  }
                }}
                placeholder="프로젝트 제목을 입력하세요"
                className={`form-input ${errors.title ? 'error' : ''}`}
                maxLength={200}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
          </div>

          {/* 프로젝트 설명 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">
                프로젝트 설명
                <span className="char-count">
                  {formData.description.length}/2000
                </span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }))
                  if (errors.description) {
                    setErrors(prev => ({ ...prev, description: '' }))
                  }
                }}
                placeholder="프로젝트에 대한 상세한 설명을 입력하세요"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                rows={4}
                maxLength={2000}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          {/* 시작일 및 종료일 */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">시작일</label>
                <DatePicker
                  value={formData.start_date}
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, start_date: date }))
                    if (errors.start_date) {
                      setErrors(prev => ({ ...prev, start_date: '' }))
                    }
                  }}
                  placeholder="시작일을 선택하세요"
                  className={errors.start_date ? 'error' : ''}
                />
                {errors.start_date && <span className="error-message">{errors.start_date}</span>}
              </div>
              <div className="form-group">
                <label className="form-label required">종료일</label>
                <DatePicker
                  value={formData.end_date}
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, end_date: date }))
                    if (errors.end_date) {
                      setErrors(prev => ({ ...prev, end_date: '' }))
                    }
                  }}
                  placeholder="종료일을 선택하세요"
                  className={errors.end_date ? 'error' : ''}
                  min={formData.start_date}
                />
                {errors.end_date && <span className="error-message">{errors.end_date}</span>}
              </div>
            </div>
          </div>

          {/* 프로젝트 상태 */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">프로젝트 상태</label>
              <CustomSelect
                options={statusOptions}
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value as string }))}
                placeholder="프로젝트 상태를 선택하세요"
              />
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
              onClick={() => navigate('/wbs')}
              className="cancel-button"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !formData.title.trim() || !formData.start_date || !formData.end_date}
            >
              {isSubmitting ? '생성 중...' : '📊 WBS 프로젝트 생성'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default AddWBS