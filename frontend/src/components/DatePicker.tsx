import React, { useState, useRef, useEffect } from 'react'
import './DatePicker.css'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  min?: string
  placeholder?: string
  className?: string
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  min,
  placeholder = "날짜를 선택하세요",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date())
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth())
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear())
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom')
  const datePickerRef = useRef<HTMLDivElement>(null)

  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
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
      const date = new Date(value)
      setSelectedDate(date)
      setCurrentMonth(date.getMonth())
      setCurrentYear(date.getFullYear())
    }
  }, [value])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  const calculateDropdownPosition = () => {
    if (!datePickerRef.current) return 'bottom'
    
    const rect = datePickerRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const dropdownHeight = 450 // 대략적인 달력 높이
    
    // 아래 공간이 충분한지 확인
    const spaceBelow = windowHeight - rect.bottom
    const spaceAbove = rect.top
    
    // 아래 공간이 부족하고 위 공간이 더 크면 위로 표시
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      return 'top'
    }
    
    return 'bottom'
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(newDate)
    onChange(formatDate(newDate))
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const isDateDisabled = (day: number) => {
    if (!min) return false
    const date = new Date(currentYear, currentMonth, day)
    const minDate = new Date(min)
    return date < minDate
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    return (
      value &&
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    )
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    // 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day)
      const today = isToday(day)
      const selected = isSelected(day)

      days.push(
        <div
          key={day}
          className={`calendar-day ${disabled ? 'disabled' : ''} ${today ? 'today' : ''} ${selected ? 'selected' : ''}`}
          onClick={() => !disabled && handleDateSelect(day)}
        >
          {day}
        </div>
      )
    }

    return days
  }

  const handleToggleCalendar = () => {
    if (!isOpen) {
      // 달력을 열 때 위치 계산
      const position = calculateDropdownPosition()
      setDropdownPosition(position)
    }
    setIsOpen(!isOpen)
  }

  return (
    <div ref={datePickerRef} className={`date-picker ${className}`}>
      <div 
        className="date-picker-input"
        onClick={handleToggleCalendar}
      >
        <input
          type="text"
          value={value ? formatDisplayDate(value) : ''}
          placeholder={placeholder}
          readOnly
          className="date-input-field"
        />
        <span className="date-picker-icon">📅</span>
      </div>

      {isOpen && (
        <div className={`date-picker-dropdown ${dropdownPosition}`}>
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={handlePrevMonth}>
              ‹
            </button>
            <div className="calendar-month-year">
              <span className="calendar-month">{months[currentMonth]}</span>
              <span className="calendar-year">{currentYear}</span>
            </div>
            <button className="calendar-nav-btn" onClick={handleNextMonth}>
              ›
            </button>
          </div>

          <div className="calendar-weekdays">
            {weekDays.map(day => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {renderCalendarDays()}
          </div>

          <div className="calendar-shortcuts">
            <button 
              className="calendar-shortcut-btn"
              onClick={() => handleDateSelect(new Date().getDate())}
            >
              오늘
            </button>
            <button 
              className="calendar-shortcut-btn"
              onClick={() => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                setCurrentMonth(tomorrow.getMonth())
                setCurrentYear(tomorrow.getFullYear())
                handleDateSelect(tomorrow.getDate())
              }}
            >
              내일
            </button>
            <button 
              className="calendar-shortcut-btn"
              onClick={() => {
                const nextWeek = new Date()
                nextWeek.setDate(nextWeek.getDate() + 7)
                setCurrentMonth(nextWeek.getMonth())
                setCurrentYear(nextWeek.getFullYear())
                handleDateSelect(nextWeek.getDate())
              }}
            >
              일주일 후
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker