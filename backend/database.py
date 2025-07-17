import sqlite3
import os
from datetime import datetime
from typing import List, Optional, Dict, Any

class Database:
    def __init__(self, db_path: str = "work_util.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """데이터베이스 초기화 및 테이블 생성"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # 사용자 테이블 (이미 존재하면 패스)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    email TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # 할일 테이블 생성
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS todos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT,
                    priority TEXT NOT NULL DEFAULT 'medium',
                    status TEXT NOT NULL DEFAULT 'pending',
                    category TEXT DEFAULT '',
                    due_date DATE,
                    tags TEXT DEFAULT '',
                    completed BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            """)
            
            # 회의록 테이블 생성
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS meetings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    date TEXT NOT NULL,
                    time TEXT NOT NULL,
                    location TEXT DEFAULT '',
                    attendees TEXT DEFAULT '',
                    agenda TEXT DEFAULT '',
                    content TEXT DEFAULT '',
                    decisions TEXT DEFAULT '',
                    action_items TEXT DEFAULT '',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            """)
            
            # WBS 프로젝트 테이블 생성
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS wbs_projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT DEFAULT '',
                    start_date TIMESTAMP,
                    end_date TIMESTAMP,
                    status TEXT DEFAULT 'planning',
                    progress REAL DEFAULT 0.0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            """)
            
            # WBS 작업 테이블 생성
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS wbs_tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    project_id INTEGER NOT NULL,
                    parent_id INTEGER,
                    title TEXT NOT NULL,
                    description TEXT DEFAULT '',
                    start_date TIMESTAMP,
                    end_date TIMESTAMP,
                    status TEXT DEFAULT 'pending',
                    priority TEXT DEFAULT 'medium',
                    progress REAL DEFAULT 0.0,
                    estimated_hours REAL DEFAULT 0.0,
                    actual_hours REAL DEFAULT 0.0,
                    assignee TEXT DEFAULT '',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (project_id) REFERENCES wbs_projects (id) ON DELETE CASCADE,
                    FOREIGN KEY (parent_id) REFERENCES wbs_tasks (id) ON DELETE CASCADE
                )
            """)
            
            # 인덱스 생성
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_wbs_projects_user_id ON wbs_projects(user_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_wbs_projects_status ON wbs_projects(status)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_wbs_tasks_project_id ON wbs_tasks(project_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_wbs_tasks_parent_id ON wbs_tasks(parent_id)")
            
            conn.commit()
    
    def create_todo(self, user_id: int, todo_data: Dict[str, Any]) -> int:
        """새 할일 생성"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # 태그를 JSON 문자열로 변환
            tags_str = ','.join(todo_data.get('tags', []))
            
            cursor.execute("""
                INSERT INTO todos (
                    user_id, title, description, priority, status, 
                    category, due_date, tags, completed, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, (
                user_id,
                todo_data['title'],
                todo_data.get('description', ''),
                todo_data.get('priority', 'medium'),
                todo_data.get('status', 'pending'),
                todo_data.get('category', ''),
                todo_data.get('due_date'),
                tags_str,
                todo_data.get('completed', False)
            ))
            
            todo_id = cursor.lastrowid
            conn.commit()
            return todo_id
    
    def get_todos(self, user_id: int, status: Optional[str] = None, 
                  limit: Optional[int] = None, offset: int = 0) -> List[Dict[str, Any]]:
        """사용자의 할일 목록 조회"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            query = """
                SELECT id, title, description, priority, status, category, 
                       due_date, tags, completed, created_at, updated_at
                FROM todos 
                WHERE user_id = ?
            """
            params = [user_id]
            
            if status:
                query += " AND status = ?"
                params.append(status)
            
            query += " ORDER BY created_at DESC"
            
            if limit:
                query += " LIMIT ? OFFSET ?"
                params.extend([limit, offset])
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            todos = []
            for row in rows:
                todo = dict(row)
                # 태그 문자열을 리스트로 변환
                todo['tags'] = row['tags'].split(',') if row['tags'] else []
                todos.append(todo)
            
            return todos
    
    def get_todo(self, user_id: int, todo_id: int) -> Optional[Dict[str, Any]]:
        """특정 할일 조회"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, title, description, priority, status, category, 
                       due_date, tags, completed, created_at, updated_at
                FROM todos 
                WHERE id = ? AND user_id = ?
            """, (todo_id, user_id))
            
            row = cursor.fetchone()
            if row:
                todo = dict(row)
                todo['tags'] = row['tags'].split(',') if row['tags'] else []
                return todo
            
            return None
    
    def update_todo(self, user_id: int, todo_id: int, update_data: Dict[str, Any]) -> bool:
        """할일 업데이트"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # 업데이트할 필드들
            fields = []
            values = []
            
            for field in ['title', 'description', 'priority', 'status', 'category', 'due_date', 'completed']:
                if field in update_data:
                    fields.append(f"{field} = ?")
                    values.append(update_data[field])
            
            # 태그 처리
            if 'tags' in update_data:
                fields.append("tags = ?")
                values.append(','.join(update_data['tags']))
            
            if not fields:
                return False
            
            # updated_at 추가
            fields.append("updated_at = CURRENT_TIMESTAMP")
            values.extend([todo_id, user_id])
            
            query = f"UPDATE todos SET {', '.join(fields)} WHERE id = ? AND user_id = ?"
            
            cursor.execute(query, values)
            conn.commit()
            
            return cursor.rowcount > 0
    
    def delete_todo(self, user_id: int, todo_id: int) -> bool:
        """할일 삭제"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            cursor.execute("DELETE FROM todos WHERE id = ? AND user_id = ?", (todo_id, user_id))
            conn.commit()
            
            return cursor.rowcount > 0
    
    def get_todo_stats(self, user_id: int) -> Dict[str, Any]:
        """할일 통계 조회"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # 전체 개수
            cursor.execute("SELECT COUNT(*) FROM todos WHERE user_id = ?", (user_id,))
            total_count = cursor.fetchone()[0]
            
            # 완료된 개수
            cursor.execute("SELECT COUNT(*) FROM todos WHERE user_id = ? AND completed = TRUE", (user_id,))
            completed_count = cursor.fetchone()[0]
            
            # 상태별 개수
            cursor.execute("""
                SELECT status, COUNT(*) 
                FROM todos 
                WHERE user_id = ? 
                GROUP BY status
            """, (user_id,))
            status_counts = dict(cursor.fetchall())
            
            # 우선순위별 개수
            cursor.execute("""
                SELECT priority, COUNT(*) 
                FROM todos 
                WHERE user_id = ? 
                GROUP BY priority
            """, (user_id,))
            priority_counts = dict(cursor.fetchall())
            
            # 완료율
            completion_rate = (completed_count / total_count * 100) if total_count > 0 else 0
            
            return {
                'total_count': total_count,
                'completed_count': completed_count,
                'pending_count': total_count - completed_count,
                'completion_rate': round(completion_rate, 1),
                'status_counts': status_counts,
                'priority_counts': priority_counts
            }
    
    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """사용자명으로 사용자 조회 (기존 SQLAlchemy 사용자 테이블에서)"""
        try:
            # 기존 SQLAlchemy 데이터베이스에서 사용자 조회
            from app.database import SessionLocal
            from app.models import User
            
            db = SessionLocal()
            user = db.query(User).filter(User.username == username).first()
            db.close()
            
            if user:
                return {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "password_hash": user.hashed_password
                }
            return None
        except Exception as e:
            print(f"사용자 조회 실패: {e}")
            return None
    
    # 회의록 관련 메서드들
    def create_meeting(self, user_id: int, meeting_data: Dict[str, Any]) -> int:
        """새 회의록 생성"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO meetings (
                    user_id, title, date, time, location, attendees, 
                    agenda, content, decisions, action_items, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, (
                user_id,
                meeting_data['title'],
                meeting_data['date'],
                meeting_data['time'],
                meeting_data.get('location', ''),
                meeting_data.get('attendees', ''),
                meeting_data.get('agenda', ''),
                meeting_data.get('content', ''),
                meeting_data.get('decisions', ''),
                meeting_data.get('action_items', '')
            ))
            
            meeting_id = cursor.lastrowid
            conn.commit()
            return meeting_id
    
    def get_meetings(self, user_id: int, limit: Optional[int] = None, offset: int = 0) -> List[Dict[str, Any]]:
        """사용자의 회의록 목록 조회"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            query = """
                SELECT id, title, date, time, location, attendees, 
                       agenda, created_at, updated_at
                FROM meetings 
                WHERE user_id = ?
                ORDER BY date DESC, time DESC
            """
            params = [user_id]
            
            if limit:
                query += " LIMIT ? OFFSET ?"
                params.extend([limit, offset])
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            meetings = []
            for row in rows:
                meeting = dict(row)
                meetings.append(meeting)
            
            return meetings
    
    def get_meeting(self, user_id: int, meeting_id: int) -> Optional[Dict[str, Any]]:
        """특정 회의록 조회"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, title, date, time, location, attendees, 
                       agenda, content, decisions, action_items, created_at, updated_at
                FROM meetings 
                WHERE id = ? AND user_id = ?
            """, (meeting_id, user_id))
            
            row = cursor.fetchone()
            if row:
                meeting = dict(row)
                return meeting
            
            return None
    
    def update_meeting(self, user_id: int, meeting_id: int, update_data: Dict[str, Any]) -> bool:
        """회의록 업데이트"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # 업데이트할 필드들
            fields = []
            values = []
            
            for field in ['title', 'date', 'time', 'location', 'attendees', 'agenda', 'content', 'decisions', 'action_items']:
                if field in update_data:
                    fields.append(f"{field} = ?")
                    values.append(update_data[field])
            
            if not fields:
                return False
            
            # updated_at 추가
            fields.append("updated_at = CURRENT_TIMESTAMP")
            values.extend([meeting_id, user_id])
            
            query = f"UPDATE meetings SET {', '.join(fields)} WHERE id = ? AND user_id = ?"
            
            cursor.execute(query, values)
            conn.commit()
            
            return cursor.rowcount > 0
    
    def delete_meeting(self, user_id: int, meeting_id: int) -> bool:
        """회의록 삭제"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            cursor.execute("DELETE FROM meetings WHERE id = ? AND user_id = ?", (meeting_id, user_id))
            conn.commit()
            
            return cursor.rowcount > 0
    
    def get_meeting_stats(self, user_id: int) -> Dict[str, Any]:
        """회의록 통계 조회"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # 전체 회의록 수
            cursor.execute("SELECT COUNT(*) FROM meetings WHERE user_id = ?", (user_id,))
            total_meetings = cursor.fetchone()[0]
            
            # 이번 달 회의록 수
            cursor.execute("""
                SELECT COUNT(*) FROM meetings 
                WHERE user_id = ? AND date >= date('now', 'start of month')
            """, (user_id,))
            this_month_meetings = cursor.fetchone()[0]
            
            # 다가오는 회의록 수 (오늘 이후)
            cursor.execute("""
                SELECT COUNT(*) FROM meetings 
                WHERE user_id = ? AND date >= date('now')
            """, (user_id,))
            upcoming_meetings = cursor.fetchone()[0]
            
            # 최근 회의록 수 (지난 7일)
            cursor.execute("""
                SELECT COUNT(*) FROM meetings 
                WHERE user_id = ? AND date >= date('now', '-7 days')
            """, (user_id,))
            recent_meetings = cursor.fetchone()[0]
            
            return {
                'total_meetings': total_meetings,
                'this_month_meetings': this_month_meetings,
                'upcoming_meetings': upcoming_meetings,
                'recent_meetings': recent_meetings
            }

# 데이터베이스 인스턴스
db = Database()