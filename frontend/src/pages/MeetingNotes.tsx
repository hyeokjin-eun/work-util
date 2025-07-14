import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import '../styles/MeetingNotes.css';
import '../styles/globals.css';

interface MeetingNote {
  id: string;
  title: string;
  date: string;
  participants: string[];
  agenda: string[];
  notes: string;
  actionItems: ActionItem[];
  createdAt: string;
  updatedAt: string;
}

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'completed';
}

const MeetingNotes: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingNote[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<MeetingNote>>({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    participants: [],
    agenda: [],
    notes: '',
    actionItems: []
  });
  const [participantInput, setParticipantInput] = useState('');
  const [agendaInput, setAgendaInput] = useState('');
  const [newActionItem, setNewActionItem] = useState({
    task: '',
    assignee: '',
    dueDate: ''
  });

  useEffect(() => {
    const savedMeetings = localStorage.getItem('meetings');
    if (savedMeetings) {
      setMeetings(JSON.parse(savedMeetings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);

  const addMeeting = () => {
    if (!newMeeting.title?.trim()) return;

    const meeting: MeetingNote = {
      id: uuidv4(),
      title: newMeeting.title,
      date: newMeeting.date || format(new Date(), 'yyyy-MM-dd'),
      participants: newMeeting.participants || [],
      agenda: newMeeting.agenda || [],
      notes: newMeeting.notes || '',
      actionItems: newMeeting.actionItems || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMeetings([...meetings, meeting]);
    setNewMeeting({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      participants: [],
      agenda: [],
      notes: '',
      actionItems: []
    });
    setShowNewForm(false);
  };

  const updateMeeting = () => {
    if (!selectedMeeting) return;

    setMeetings(meetings.map(meeting => 
      meeting.id === selectedMeeting.id 
        ? { ...selectedMeeting, updatedAt: new Date().toISOString() }
        : meeting
    ));
    setIsEditing(false);
  };

  const deleteMeeting = (id: string) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
    if (selectedMeeting?.id === id) {
      setSelectedMeeting(null);
    }
  };

  const addParticipant = () => {
    if (!participantInput.trim()) return;
    
    if (showNewForm) {
      setNewMeeting({
        ...newMeeting,
        participants: [...(newMeeting.participants || []), participantInput]
      });
    } else if (selectedMeeting && isEditing) {
      setSelectedMeeting({
        ...selectedMeeting,
        participants: [...selectedMeeting.participants, participantInput]
      });
    }
    setParticipantInput('');
  };

  const addAgenda = () => {
    if (!agendaInput.trim()) return;
    
    if (showNewForm) {
      setNewMeeting({
        ...newMeeting,
        agenda: [...(newMeeting.agenda || []), agendaInput]
      });
    } else if (selectedMeeting && isEditing) {
      setSelectedMeeting({
        ...selectedMeeting,
        agenda: [...selectedMeeting.agenda, agendaInput]
      });
    }
    setAgendaInput('');
  };

  const addActionItem = () => {
    if (!newActionItem.task.trim() || !newActionItem.assignee.trim()) return;

    const actionItem: ActionItem = {
      id: uuidv4(),
      task: newActionItem.task,
      assignee: newActionItem.assignee,
      dueDate: newActionItem.dueDate,
      status: 'pending'
    };

    if (showNewForm) {
      setNewMeeting({
        ...newMeeting,
        actionItems: [...(newMeeting.actionItems || []), actionItem]
      });
    } else if (selectedMeeting && isEditing) {
      setSelectedMeeting({
        ...selectedMeeting,
        actionItems: [...selectedMeeting.actionItems, actionItem]
      });
    }

    setNewActionItem({ task: '', assignee: '', dueDate: '' });
  };

  const toggleActionItemStatus = (meetingId: string, actionItemId: string) => {
    setMeetings(meetings.map(meeting => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          actionItems: meeting.actionItems.map(item =>
            item.id === actionItemId
              ? { ...item, status: item.status === 'pending' ? 'completed' : 'pending' }
              : item
          )
        };
      }
      return meeting;
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-icon">📝</div>
        <h1 className="page-title">회의록 메모</h1>
        <p className="page-subtitle">구조화된 회의록 작성 및 액션 아이템 관리</p>
      </div>
      
      <div className="action-section">
        <button className="btn-primary add-meeting-btn" onClick={() => setShowNewForm(true)}>
          <span className="btn-icon">+</span>
          새 회의 작성
        </button>
      </div>

      <div className="section meetings-section">
        <h3 className="section-title">
          회의 목록
          <span className="count-badge">{meetings.length}</span>
        </h3>
        <div className="meetings-grid">
          {meetings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">회의록이 없습니다.<br />새로운 회의를 작성해보세요!</div>
            </div>
          ) : (
            meetings.map(meeting => (
              <div
                key={meeting.id}
                className={`meeting-card ${selectedMeeting?.id === meeting.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedMeeting(meeting);
                  setShowNewForm(false);
                  setIsEditing(false);
                }}
              >
                <div className="meeting-header">
                  <h4 className="meeting-title">{meeting.title}</h4>
                  <span className="meeting-date">📅 {new Date(meeting.date).toLocaleDateString()}</span>
                </div>
                <div className="meeting-meta">
                  <span className="participant-count">👥 {meeting.participants.length}명</span>
                  <span className="agenda-count">📋 {meeting.agenda.length}개 안건</span>
                </div>
                {meeting.notes && (
                  <div className="meeting-preview">{meeting.notes.substring(0, 100)}...</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showNewForm && (
        <div className="section add-meeting-form">
          <h3 className="section-title">새 회의 작성</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="회의 제목"
              value={newMeeting.title || ''}
              onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              className="form-input"
            />
            <input
              type="date"
              value={newMeeting.date || ''}
              onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              className="form-input"
            />
            <div className="form-section">
              <label className="form-label">참석자</label>
              <div className="input-with-button">
                <input
                  type="text"
                  value={participantInput}
                  onChange={(e) => setParticipantInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                  placeholder="참석자 이름"
                  className="form-input"
                />
                <button className="btn-secondary" onClick={addParticipant}>추가</button>
              </div>
              <div className="tags-list">
                {newMeeting.participants?.map((p, idx) => (
                  <span key={idx} className="tag">{p}</span>
                ))}
              </div>
            </div>
            <div className="form-section">
              <label className="form-label">안건</label>
              <div className="input-with-button">
                <input
                  type="text"
                  value={agendaInput}
                  onChange={(e) => setAgendaInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAgenda()}
                  placeholder="안건 내용"
                  className="form-input"
                />
                <button className="btn-secondary" onClick={addAgenda}>추가</button>
              </div>
              <ol className="agenda-list">
                {newMeeting.agenda?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>
            <textarea
              placeholder="회의 내용"
              value={newMeeting.notes || ''}
              onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
              className="form-textarea"
              rows={10}
            />
            <div className="form-section">
              <label className="form-label">액션 아이템</label>
              <div className="action-item-form">
                <input
                  type="text"
                  placeholder="할 일"
                  value={newActionItem.task}
                  onChange={(e) => setNewActionItem({ ...newActionItem, task: e.target.value })}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="담당자"
                  value={newActionItem.assignee}
                  onChange={(e) => setNewActionItem({ ...newActionItem, assignee: e.target.value })}
                  className="form-input"
                />
                <input
                  type="date"
                  value={newActionItem.dueDate}
                  onChange={(e) => setNewActionItem({ ...newActionItem, dueDate: e.target.value })}
                  className="form-input"
                />
                <button className="btn-secondary" onClick={addActionItem}>추가</button>
              </div>
              <div className="action-items-list">
                {newMeeting.actionItems?.map((item) => (
                  <div key={item.id} className="action-item">
                    <span>{item.task}</span>
                    <span>{item.assignee}</span>
                    <span>{item.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={addMeeting}>
                <span className="btn-icon">💾</span>
                저장
              </button>
              <button className="btn-secondary" onClick={() => {
                setShowNewForm(false);
                setNewMeeting({
                  title: '',
                  date: format(new Date(), 'yyyy-MM-dd'),
                  participants: [],
                  agenda: [],
                  notes: '',
                  actionItems: []
                });
              }}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMeeting && !showNewForm && (
        <div className="section meeting-detail">
          {isEditing ? (
            <>
              <h3 className="section-title">회의 수정</h3>
              <div className="form-grid">
                <input
                  type="text"
                  value={selectedMeeting.title}
                  onChange={(e) => setSelectedMeeting({ ...selectedMeeting, title: e.target.value })}
                  className="form-input"
                />
                <textarea
                  value={selectedMeeting.notes}
                  onChange={(e) => setSelectedMeeting({ ...selectedMeeting, notes: e.target.value })}
                  className="form-textarea"
                  rows={10}
                />
                <div className="form-actions">
                  <button className="btn-primary" onClick={updateMeeting}>
                    <span className="btn-icon">💾</span>
                    저장
                  </button>
                  <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                    취소
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="meeting-detail-header">
                <h3 className="section-title">{selectedMeeting.title}</h3>
                <div className="meeting-actions">
                  <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                    <span className="btn-icon">✏️</span>
                    수정
                  </button>
                  <button className="btn-delete" onClick={() => deleteMeeting(selectedMeeting.id)}>
                    🗑️
                  </button>
                </div>
              </div>
              <div className="meeting-info">
                <p><strong>📅 날짜:</strong> {new Date(selectedMeeting.date).toLocaleDateString()}</p>
                <div className="participants">
                  <strong>👥 참석자:</strong>
                  <div className="tags-list">
                    {selectedMeeting.participants.map((p, idx) => (
                      <span key={idx} className="tag">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
              {selectedMeeting.agenda.length > 0 && (
                <div className="agenda-section">
                  <h4>📋 안건</h4>
                  <ol className="agenda-list">
                    {selectedMeeting.agenda.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}
              <div className="notes-section">
                <h4>📝 회의 내용</h4>
                <div className="notes-content" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedMeeting.notes}
                </div>
              </div>
              {selectedMeeting.actionItems.length > 0 && (
                <div className="action-items-section">
                  <h4>✅ 액션 아이템</h4>
                  <div className="action-items-grid">
                    {selectedMeeting.actionItems.map((item) => (
                      <div key={item.id} className={`action-item ${item.status}`}>
                        <input
                          type="checkbox"
                          checked={item.status === 'completed'}
                          onChange={() => toggleActionItemStatus(selectedMeeting.id, item.id)}
                        />
                        <span className="action-task">{item.task}</span>
                        <span className="action-assignee">{item.assignee}</span>
                        {item.dueDate && <span className="action-due-date">📅 {new Date(item.dueDate).toLocaleDateString()}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingNotes;