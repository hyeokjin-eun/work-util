import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../components/AuthContext'
import { apiCall } from '../utils/api'
import '../styles/Calendar.css'

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'todo' | 'meeting' | 'project'
  completed?: boolean
}

interface CalendarStats {
  totalEvents: number
  completedTodos: number
  todayEvents: number
  upcomingEvents: number
}

const Calendar: React.FC = () => {
  const { token } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [stats, setStats] = useState<CalendarStats>({
    totalEvents: 0,
    completedTodos: 0,
    todayEvents: 0,
    upcomingEvents: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Scroll to top when Calendar component loads
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (token) {
      loadCalendarData()
    }
  }, [token, currentDate])

  const calendarIcon = (
    <svg viewBox="0 0 24 24" style={{ width: '60px', height: '60px', stroke: 'white', fill: 'none', strokeWidth: 2 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )

  const loadCalendarData = async () => {
    try {
      setLoading(true)
      
      // 병렬로 모든 데이터 로드
      const [todosResponse, meetingsResponse, wbsProjectsResponse] = await Promise.all([
        apiCall('/api/todos', { method: 'GET', token }),
        apiCall('/api/meetings', { method: 'GET', token }),
        apiCall('/api/wbs/projects', { method: 'GET', token })
      ])

      const calendarEvents: CalendarEvent[] = []
      let completedTodos = 0
      let todayEvents = 0
      const today = new Date().toISOString().split('T')[0]

      // 할일 데이터 처리
      if (todosResponse.ok) {
        const todos = await todosResponse.json()
        todos.forEach((todo: any) => {
          if (todo.due_date) {
            calendarEvents.push({
              id: `todo-${todo.id}`,
              title: todo.title,
              date: todo.due_date,
              type: 'todo',
              completed: todo.completed
            })
            if (todo.completed) completedTodos++
            if (todo.due_date === today) todayEvents++
          }
        })
      }

      // 회의록 데이터 처리
      if (meetingsResponse.ok) {
        const meetings = await meetingsResponse.json()
        meetings.forEach((meeting: any) => {
          const meetingDate = new Date(meeting.created_at).toISOString().split('T')[0]
          calendarEvents.push({
            id: `meeting-${meeting.id}`,
            title: meeting.title,
            date: meetingDate,
            type: 'meeting'
          })
          if (meetingDate === today) todayEvents++
        })
      }

      // WBS 프로젝트 데이터 처리
      if (wbsProjectsResponse.ok) {
        const projects = await wbsProjectsResponse.json()
        projects.forEach((project: any) => {
          if (project.end_date) {
            calendarEvents.push({
              id: `project-${project.id}`,
              title: project.title,
              date: project.end_date,
              type: 'project'
            })
            if (project.end_date === today) todayEvents++
          }
        })
      }

      // 다음 7일간의 이벤트 계산
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      const upcomingEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= new Date() && eventDate <= nextWeek
      }).length

      setEvents(calendarEvents)
      setStats({
        totalEvents: calendarEvents.length,
        completedTodos,
        todayEvents,
        upcomingEvents
      })
    } catch (error) {
      console.error('캘린더 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next', event?: React.MouseEvent<HTMLButtonElement>) => {
    // Remove focus after click
    if (event && event.currentTarget) {
      event.currentTarget.blur()
    }
    
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = (event?: React.MouseEvent<HTMLButtonElement>) => {
    // Remove focus after click
    if (event && event.currentTarget) {
      event.currentTarget.blur()
    }
    setCurrentDate(new Date())
  }

  const getEventsForDate = (date: Date) => {
    // 타임존 이슈 방지를 위해 로컬 날짜 문자열 생성
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    return events.filter(event => event.date === dateStr)
  }

  const currentMonth = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
  const currentDay = new Date().getDate()
  const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()

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
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dayEvents = getEventsForDate(dayDate)
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday: day === currentDay && isCurrentMonth,
      events: dayEvents
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
      <div className="calendar-navigation">
        <button 
          className="calendar-nav-button"
          onClick={(e) => navigateMonth('prev', e)}
        >‹</button>
        <div className="calendar-month-title">{currentMonth}</div>
        <button 
          className="calendar-nav-button"
          onClick={(e) => navigateMonth('next', e)}
        >›</button>
      </div>

      <div className="calendar-today-wrapper">
        <button 
          className="calendar-today-button"
          onClick={(e) => goToToday(e)}
        >오늘</button>
      </div>

      {/* Calendar Grid */}
      <div className="card calendar-grid-container">
        {/* Day Headers */}
        <div className="calendar-week-header">
          {daysOfWeek.map((day) => (
            <div key={day} className="calendar-week-day">{day}</div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="calendar-days-grid">
          {calendarDays.slice(0, 42).map((dayInfo: any, index) => (
            <div
              key={index}
              className={`calendar-day ${dayInfo.isToday ? 'is-today' : ''} ${dayInfo.isCurrentMonth ? 'is-current-month' : 'is-other-month'}`}
            >
              <div className="calendar-day-number">{dayInfo.day}</div>
              {dayInfo.events && dayInfo.events.length > 0 && (
                <div className="calendar-events">
                  {dayInfo.events.slice(0, 3).map((event: CalendarEvent, eventIndex: number) => (
                    <div
                      key={eventIndex}
                      className="calendar-event-dot"
                      style={{
                        background: event.type === 'todo' 
                          ? (event.completed ? 'var(--success)' : 'var(--warning)') 
                          : event.type === 'meeting' 
                          ? 'var(--warning)' 
                          : 'var(--primary-blue)'
                      }}
                    />
                  ))}
                  {dayInfo.events.length > 3 && (
                    <div className="calendar-event-more">+{dayInfo.events.length - 3}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{loading ? '...' : stats.totalEvents}</div>
          <div className="stat-label">총 이벤트</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{loading ? '...' : stats.completedTodos}</div>
          <div className="stat-label">완료된 할일</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{loading ? '...' : stats.todayEvents}</div>
          <div className="stat-label">오늘 이벤트</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{loading ? '...' : stats.upcomingEvents}</div>
          <div className="stat-label">예정 이벤트</div>
        </div>
      </div>

      {/* Event Legend */}
      <div className="card">
        <div className="calendar-legend-title">이벤트 범례</div>
        <div className="calendar-legend-items">
          <div className="calendar-legend-item">
            <div className="calendar-legend-dot" style={{ background: 'var(--success)' }}></div>
            <div className="calendar-legend-text">완료된 할일</div>
          </div>
          <div className="calendar-legend-item">
            <div className="calendar-legend-dot" style={{ background: 'var(--warning)' }}></div>
            <div className="calendar-legend-text">미완료 할일 / 회의</div>
          </div>
          <div className="calendar-legend-item">
            <div className="calendar-legend-dot" style={{ background: 'var(--primary-blue)' }}></div>
            <div className="calendar-legend-text">프로젝트</div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Calendar