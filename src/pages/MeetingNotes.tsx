import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import '../styles/MeetingNotes.css';

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
    <div className="meeting-notes-container">
      <div className="meeting-sidebar">
        <div className="sidebar-header">
          <h3>회의 목록</h3>
          <button className="new-meeting-btn" onClick={() => setShowNewForm(true)}>
            + 새 회의
          </button>
        </div>
        <div className="meeting-list">
          {meetings.length === 0 ? (
            <div className="empty-state">회의록이 없습니다.</div>
          ) : (
            meetings.map(meeting => (
              <div
                key={meeting.id}
                className={`meeting-item ${selectedMeeting?.id === meeting.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedMeeting(meeting);
                  setShowNewForm(false);
                  setIsEditing(false);
                }}
              >
                <h4>{meeting.title}</h4>
                <p>{meeting.date}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="meeting-content">
        {showNewForm ? (
          <div className="meeting-form">
            <h2>새 회의 작성</h2>
            <div className="form-group">
              <label>회의 제목</label>
              <input
                type="text"
                value={newMeeting.title || ''}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>회의 날짜</label>
              <input
                type="date"
                value={newMeeting.date || ''}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>참석자</label>
              <div className="input-with-button">
                <input
                  type="text"
                  value={participantInput}
                  onChange={(e) => setParticipantInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                  placeholder="참석자 이름"
                />
                <button onClick={addParticipant}>추가</button>
              </div>
              <div className="tag-list">
                {newMeeting.participants?.map((p, idx) => (
                  <span key={idx} className="tag">{p}</span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>안건</label>
              <div className="input-with-button">
                <input
                  type="text"
                  value={agendaInput}
                  onChange={(e) => setAgendaInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAgenda()}
                  placeholder="안건 내용"
                />
                <button onClick={addAgenda}>추가</button>
              </div>
              <ol className="agenda-list">
                {newMeeting.agenda?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="form-group">
              <label>회의 내용</label>
              <textarea
                value={newMeeting.notes || ''}
                onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                rows={10}
              />
            </div>
            <div className="form-group">
              <label>액션 아이템</label>
              <div className="action-item-form">
                <input
                  type="text"
                  placeholder="할 일"
                  value={newActionItem.task}
                  onChange={(e) => setNewActionItem({ ...newActionItem, task: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="담당자"
                  value={newActionItem.assignee}
                  onChange={(e) => setNewActionItem({ ...newActionItem, assignee: e.target.value })}
                />
                <input
                  type="date"
                  value={newActionItem.dueDate}
                  onChange={(e) => setNewActionItem({ ...newActionItem, dueDate: e.target.value })}
                />
                <button onClick={addActionItem}>추가</button>
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
              <button className="save-btn" onClick={addMeeting}>저장</button>
              <button className="cancel-btn" onClick={() => {
                setShowNewForm(false);
                setNewMeeting({
                  title: '',
                  date: format(new Date(), 'yyyy-MM-dd'),
                  participants: [],
                  agenda: [],
                  notes: '',
                  actionItems: []
                });
              }}>취소</button>
            </div>
          </div>
        ) : selectedMeeting ? (
          <div className="meeting-detail">
            {isEditing ? (
              <div className="meeting-form">
                <h2>회의 수정</h2>
                <div className="form-group">
                  <label>회의 제목</label>
                  <input
                    type="text"
                    value={selectedMeeting.title}
                    onChange={(e) => setSelectedMeeting({ ...selectedMeeting, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>회의 내용</label>
                  <textarea
                    value={selectedMeeting.notes}
                    onChange={(e) => setSelectedMeeting({ ...selectedMeeting, notes: e.target.value })}
                    rows={10}
                  />
                </div>
                <div className="form-actions">
                  <button className="save-btn" onClick={updateMeeting}>저장</button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>취소</button>
                </div>
              </div>
            ) : (
              <>
                <div className="meeting-header">
                  <h2>{selectedMeeting.title}</h2>
                  <div className="meeting-actions">
                    <button onClick={() => setIsEditing(true)}>수정</button>
                    <button onClick={() => deleteMeeting(selectedMeeting.id)}>삭제</button>
                  </div>
                </div>
                <div className="meeting-info">
                  <p><strong>날짜:</strong> {selectedMeeting.date}</p>
                  <div className="participants">
                    <strong>참석자:</strong>
                    {selectedMeeting.participants.map((p, idx) => (
                      <span key={idx} className="tag">{p}</span>
                    ))}
                  </div>
                </div>
                {selectedMeeting.agenda.length > 0 && (
                  <div className="agenda-section">
                    <h3>안건</h3>
                    <ol>
                      {selectedMeeting.agenda.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ol>
                  </div>
                )}
                <div className="notes-section">
                  <h3>회의 내용</h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{selectedMeeting.notes}</p>
                </div>
                {selectedMeeting.actionItems.length > 0 && (
                  <div className="action-items-section">
                    <h3>액션 아이템</h3>
                    {selectedMeeting.actionItems.map((item) => (
                      <div key={item.id} className={`action-item ${item.status}`}>
                        <input
                          type="checkbox"
                          checked={item.status === 'completed'}
                          onChange={() => toggleActionItemStatus(selectedMeeting.id, item.id)}
                        />
                        <span>{item.task}</span>
                        <span className="assignee">{item.assignee}</span>
                        {item.dueDate && <span className="due-date">~{item.dueDate}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="empty-content">
            <p>회의를 선택하거나 새 회의를 작성하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingNotes;