import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'

const Calendar: React.FC = () => {
  useEffect(() => {
    // Scroll to top when Calendar component loads
    window.scrollTo(0, 0)
  }, [])
  const [currentDate] = useState(new Date())

  const calendarIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )

  const currentMonth = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
  const currentDay = currentDate.getDate()

  // Simple calendar generation
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const calendarDays = []
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    calendarDays.push({
      day: prevMonth.getDate() - i,
      isCurrentMonth: false,
      isToday: false
    })
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday: day === currentDay
    })
  }
  
  // Next month days to fill the grid
  const remainingCells = 42 - calendarDays.length
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false
    })
  }

  return (
    <Layout 
      pageTitle="캘린더"
      pageSubtitle="자신의 일정을 계획하고<br/>일정과 업무를 한눈에 확인하세요"
      pageIcon={calendarIcon}
    >
      {/* Calendar Navigation */}
      <div className="flex" style={{ alignItems: 'center', justifyContent: 'center', marginBottom: '20px', gap: '20px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          background: 'var(--primary-blue)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white', 
          cursor: 'pointer', 
          fontSize: '16px', 
          transition: 'all 0.3s ease' 
        }}>‹</div>
        <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>{currentMonth}</div>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          background: 'var(--primary-blue)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white', 
          cursor: 'pointer', 
          fontSize: '16px', 
          transition: 'all 0.3s ease' 
        }}>›</div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button style={{
          background: 'var(--primary-blue)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>오늘</button>
      </div>

      {/* Calendar Grid */}
      <div className="card" style={{ marginBottom: '20px' }}>
        {/* Day Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '15px' }}>
          {daysOfWeek.map((day) => (
            <div key={day} style={{ 
              textAlign: 'center', 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#666', 
              padding: '8px 0' 
            }}>{day}</div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {calendarDays.slice(0, 42).map((dayInfo, index) => (
            <div
              key={index}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: dayInfo.isToday ? 'var(--primary-blue)' : 'transparent',
                color: dayInfo.isToday ? 'white' : (dayInfo.isCurrentMonth ? '#333' : '#ccc')
              }}
            >
              {dayInfo.day}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">총 이벤트</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">완료된 할일</div>
        </div>
      </div>

      {/* Event Legend */}
      <div className="card">
        <div className="title-lg" style={{ marginBottom: '15px' }}>이벤트 범례</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: 'var(--success)', 
              marginRight: '8px' 
            }}></div>
            <div style={{ fontSize: '14px', color: '#666' }}>할일</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: 'var(--warning)', 
              marginRight: '8px' 
            }}></div>
            <div style={{ fontSize: '14px', color: '#666' }}>회의</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: 'var(--primary-blue)', 
              marginRight: '8px' 
            }}></div>
            <div style={{ fontSize: '14px', color: '#666' }}>프로젝트</div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Calendar