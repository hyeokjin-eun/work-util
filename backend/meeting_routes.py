from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.auth import get_current_user
from app.models import User
from database import Database
import json

router = APIRouter()

# Pydantic Models
class MeetingCreate(BaseModel):
    title: str = Field(..., max_length=200)
    date: str = Field(..., description="회의 날짜 (YYYY-MM-DD)")
    time: str = Field(..., description="회의 시간 (HH:MM)")
    location: str = Field(default="", max_length=100)
    attendees: List[str] = Field(default_factory=list)
    agenda: str = Field(default="", max_length=2000)
    content: str = Field(default="", max_length=10000)
    decisions: str = Field(default="", max_length=5000)
    action_items: str = Field(default="", max_length=5000)

class MeetingUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = Field(None, max_length=100)
    attendees: Optional[List[str]] = None
    agenda: Optional[str] = Field(None, max_length=2000)
    content: Optional[str] = Field(None, max_length=10000)
    decisions: Optional[str] = Field(None, max_length=5000)
    action_items: Optional[str] = Field(None, max_length=5000)

class MeetingResponse(BaseModel):
    id: int
    title: str
    date: str
    time: str
    location: str
    attendees: List[str]
    agenda: str
    content: str
    decisions: str
    action_items: str
    created_at: str
    updated_at: str

class MeetingListResponse(BaseModel):
    id: int
    title: str
    date: str
    time: str
    location: str
    attendees: List[str]
    agenda: str
    created_at: str
    updated_at: str

class MeetingStats(BaseModel):
    total_meetings: int
    this_month_meetings: int
    upcoming_meetings: int
    recent_meetings: int

# Initialize database
db = Database()

@router.post("/meetings", response_model=dict)
async def create_meeting(meeting: MeetingCreate, current_user: User = Depends(get_current_user)):
    """새 회의록 생성"""
    try:
        # 참석자 리스트를 JSON 문자열로 변환
        attendees_json = json.dumps(meeting.attendees, ensure_ascii=False)
        
        meeting_data = {
            "title": meeting.title,
            "date": meeting.date,
            "time": meeting.time,
            "location": meeting.location,
            "attendees": attendees_json,
            "agenda": meeting.agenda,
            "content": meeting.content,
            "decisions": meeting.decisions,
            "action_items": meeting.action_items
        }
        
        meeting_id = db.create_meeting(current_user.id, meeting_data)
        
        return {
            "message": "회의록이 성공적으로 생성되었습니다.",
            "meeting_id": meeting_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"회의록 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/meetings", response_model=List[MeetingListResponse])
async def get_meetings(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user)
):
    """회의록 목록 조회"""
    try:
        meetings = db.get_meetings(current_user.id, limit=limit, offset=offset)
        
        # 참석자 JSON 문자열을 리스트로 변환
        for meeting in meetings:
            if meeting.get('attendees'):
                try:
                    meeting['attendees'] = json.loads(meeting['attendees'])
                except json.JSONDecodeError:
                    meeting['attendees'] = []
            else:
                meeting['attendees'] = []
        
        return meetings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"회의록 목록 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/meetings/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(meeting_id: int, current_user: User = Depends(get_current_user)):
    """특정 회의록 상세 조회"""
    try:
        meeting = db.get_meeting(current_user.id, meeting_id)
        
        if not meeting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="회의록을 찾을 수 없습니다."
            )
        
        # 참석자 JSON 문자열을 리스트로 변환
        if meeting.get('attendees'):
            try:
                meeting['attendees'] = json.loads(meeting['attendees'])
            except json.JSONDecodeError:
                meeting['attendees'] = []
        else:
            meeting['attendees'] = []
        
        return meeting
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"회의록 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.put("/meetings/{meeting_id}", response_model=dict)
async def update_meeting(
    meeting_id: int,
    meeting_update: MeetingUpdate,
    current_user: User = Depends(get_current_user)
):
    """회의록 수정"""
    try:
        # 기존 회의록 존재 여부 확인
        existing_meeting = db.get_meeting(current_user.id, meeting_id)
        if not existing_meeting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="회의록을 찾을 수 없습니다."
            )
        
        # 업데이트 데이터 준비
        update_data = {}
        for field, value in meeting_update.dict(exclude_unset=True).items():
            if field == "attendees" and value is not None:
                # 참석자 리스트를 JSON 문자열로 변환
                update_data[field] = json.dumps(value, ensure_ascii=False)
            else:
                update_data[field] = value
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="수정할 데이터가 없습니다."
            )
        
        success = db.update_meeting(current_user.id, meeting_id, update_data)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="회의록 수정에 실패했습니다."
            )
        
        return {"message": "회의록이 성공적으로 수정되었습니다."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"회의록 수정 중 오류가 발생했습니다: {str(e)}"
        )

@router.delete("/meetings/{meeting_id}", response_model=dict)
async def delete_meeting(meeting_id: int, current_user: User = Depends(get_current_user)):
    """회의록 삭제"""
    try:
        # 기존 회의록 존재 여부 확인
        existing_meeting = db.get_meeting(current_user.id, meeting_id)
        if not existing_meeting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="회의록을 찾을 수 없습니다."
            )
        
        success = db.delete_meeting(current_user.id, meeting_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="회의록 삭제에 실패했습니다."
            )
        
        return {"message": "회의록이 성공적으로 삭제되었습니다."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"회의록 삭제 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/meetings/stats", response_model=MeetingStats)
async def get_meeting_stats(current_user: User = Depends(get_current_user)):
    """회의록 통계 조회"""
    try:
        stats = db.get_meeting_stats(current_user.id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"회의록 통계 조회 중 오류가 발생했습니다: {str(e)}"
        )