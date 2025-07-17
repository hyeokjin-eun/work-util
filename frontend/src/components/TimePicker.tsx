import React, { useState, useRef, useEffect } from 'react'
import './TimePicker.css'

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  placeholder?: string
  className?: string
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = "시간을 선택하세요",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHour, setSelectedHour] = useState(value ? parseInt(value.split(':')[0]) : 9)
  const [selectedMinute, setSelectedMinute] = useState(value ? parseInt(value.split(':')[1]) : 0)
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom')
  const timePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleResize = () => {
      if (isOpen) {
        const position = calculateDropdownPosition()
        setDropdownPosition(position)
      }
    }

    const handleScroll = () => {
      if (isOpen) {
        const position = calculateDropdownPosition()
        setDropdownPosition(position)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':')
      setSelectedHour(parseInt(hour))
      setSelectedMinute(parseInt(minute))
    }
  }, [value])

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return ''
    const [hour, minute] = timeString.split(':')
    return `${hour}:${minute}`
  }

  const calculateDropdownPosition = () => {
    if (!timePickerRef.current) return 'bottom'
    
    const rect = timePickerRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const dropdownHeight = 350 // 대략적인 시간 선택기 높이
    
    // 아래 공간이 충분한지 확인
    const spaceBelow = windowHeight - rect.bottom
    const spaceAbove = rect.top
    
    // 아래 공간이 부족하고 위 공간이 더 크면 위로 표시
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      return 'top'
    }
    
    return 'bottom'
  }

  const handleTimeSelect = (hour: number, minute: number) => {
    setSelectedHour(hour)
    setSelectedMinute(minute)
    onChange(formatTime(hour, minute))
    setIsOpen(false)
  }

  const handleToggleTimePicker = () => {
    if (!isOpen) {
      // 시간 선택기를 열 때 위치 계산
      const position = calculateDropdownPosition()
      setDropdownPosition(position)
    }
    setIsOpen(!isOpen)
  }

  const renderHours = () => {
    const hours = []
    for (let hour = 0; hour < 24; hour++) {
      hours.push(
        <div
          key={hour}
          className={`time-item ${selectedHour === hour ? 'selected' : ''}`}
          onClick={() => handleTimeSelect(hour, selectedMinute)}
        >
          {hour.toString().padStart(2, '0')}
        </div>
      )
    }
    return hours
  }

  const renderMinutes = () => {
    const minutes = []
    for (let minute = 0; minute < 60; minute += 5) {
      minutes.push(
        <div
          key={minute}
          className={`time-item ${selectedMinute === minute ? 'selected' : ''}`}
          onClick={() => handleTimeSelect(selectedHour, minute)}
        >
          {minute.toString().padStart(2, '0')}
        </div>
      )
    }
    return minutes
  }

  return (
    <div ref={timePickerRef} className={`time-picker ${className}`}>
      <div 
        className="time-picker-input"
        onClick={handleToggleTimePicker}
      >
        <input
          type="text"
          value={value ? formatDisplayTime(value) : ''}
          placeholder={placeholder}
          readOnly
          className="time-input-field"
        />
        <span className="time-picker-icon">🕐</span>
      </div>

      {isOpen && (
        <div className={`time-picker-dropdown ${dropdownPosition}`}>
          <div className="time-picker-header">
            <span className="time-picker-title">시간 선택</span>
          </div>

          <div className="time-picker-content">
            <div className="time-column">
              <div className="time-column-header">시</div>
              <div className="time-list">
                {renderHours()}
              </div>
            </div>
            
            <div className="time-separator">:</div>
            
            <div className="time-column">
              <div className="time-column-header">분</div>
              <div className="time-list">
                {renderMinutes()}
              </div>
            </div>
          </div>

          <div className="time-picker-shortcuts">
            <button 
              className="time-shortcut-btn"
              onClick={() => handleTimeSelect(9, 0)}
            >
              09:00
            </button>
            <button 
              className="time-shortcut-btn"
              onClick={() => handleTimeSelect(14, 0)}
            >
              14:00
            </button>
            <button 
              className="time-shortcut-btn"
              onClick={() => {
                const now = new Date()
                const roundedMinute = Math.round(now.getMinutes() / 5) * 5
                handleTimeSelect(now.getHours(), roundedMinute)
              }}
            >
              현재 시간
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimePicker