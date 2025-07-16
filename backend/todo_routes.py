from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
from database import db
from app.auth import get_current_user

router = APIRouter()

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: str = "medium"
    status: str = "pending"
    category: Optional[str] = ""
    due_date: Optional[str] = None
    tags: List[str] = []

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[str] = None
    tags: Optional[List[str]] = None
    completed: Optional[bool] = None

class TodoResponse(BaseModel):
    id: int
    title: str
    description: str
    priority: str
    status: str
    category: str
    due_date: Optional[str]
    tags: List[str]
    completed: bool
    created_at: str
    updated_at: str

class TodoStats(BaseModel):
    total_count: int
    completed_count: int
    pending_count: int
    completion_rate: float
    status_counts: dict
    priority_counts: dict

@router.post("/todos", response_model=dict)
async def create_todo(todo: TodoCreate, current_user = Depends(get_current_user)):
    """새 할일 생성"""
    try:
        # 날짜 형식 검증
        if todo.due_date:
            try:
                datetime.strptime(todo.due_date, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="due_date must be in YYYY-MM-DD format"
                )
        
        # 우선순위 검증
        if todo.priority not in ["high", "medium", "low"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="priority must be one of: high, medium, low"
            )
        
        # 상태 검증
        if todo.status not in ["pending", "in_progress", "completed"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="status must be one of: pending, in_progress, completed"
            )
        
        # 할일 생성
        todo_id = db.create_todo(current_user.id, todo.dict())
        
        # 생성된 할일 조회
        created_todo = db.get_todo(current_user.id, todo_id)
        
        return {
            "message": "할일이 성공적으로 생성되었습니다.",
            "todo": created_todo
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할일 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/todos", response_model=List[TodoResponse])
async def get_todos(
    status_filter: Optional[str] = None,
    limit: Optional[int] = None,
    offset: int = 0,
    current_user = Depends(get_current_user)
):
    """할일 목록 조회"""
    try:
        todos = db.get_todos(
            user_id=current_user.id,
            status=status_filter,
            limit=limit,
            offset=offset
        )
        
        return todos
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할일 목록 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/todos/{todo_id}", response_model=TodoResponse)
async def get_todo(todo_id: int, current_user = Depends(get_current_user)):
    """특정 할일 조회"""
    try:
        todo = db.get_todo(current_user.id, todo_id)
        
        if not todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="할일을 찾을 수 없습니다."
            )
        
        return todo
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할일 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.put("/todos/{todo_id}", response_model=dict)
async def update_todo(
    todo_id: int, 
    todo_update: TodoUpdate, 
    current_user = Depends(get_current_user)
):
    """할일 업데이트"""
    try:
        # 할일 존재 확인
        existing_todo = db.get_todo(current_user.id, todo_id)
        if not existing_todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="할일을 찾을 수 없습니다."
            )
        
        # 업데이트 데이터 준비
        update_data = {}
        for field, value in todo_update.dict().items():
            if value is not None:
                update_data[field] = value
        
        # 날짜 형식 검증
        if "due_date" in update_data and update_data["due_date"]:
            try:
                datetime.strptime(update_data["due_date"], "%Y-%m-%d")
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="due_date must be in YYYY-MM-DD format"
                )
        
        # 우선순위 검증
        if "priority" in update_data and update_data["priority"] not in ["high", "medium", "low"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="priority must be one of: high, medium, low"
            )
        
        # 상태 검증
        if "status" in update_data and update_data["status"] not in ["pending", "in_progress", "completed"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="status must be one of: pending, in_progress, completed"
            )
        
        # 상태와 완료 여부 동기화
        if "completed" in update_data:
            if update_data["completed"]:
                update_data["status"] = "completed"
            elif existing_todo["status"] == "completed":
                update_data["status"] = "pending"
        
        if "status" in update_data:
            update_data["completed"] = (update_data["status"] == "completed")
        
        # 할일 업데이트
        success = db.update_todo(current_user.id, todo_id, update_data)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="할일을 찾을 수 없습니다."
            )
        
        # 업데이트된 할일 조회
        updated_todo = db.get_todo(current_user.id, todo_id)
        
        return {
            "message": "할일이 성공적으로 업데이트되었습니다.",
            "todo": updated_todo
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할일 업데이트 중 오류가 발생했습니다: {str(e)}"
        )

@router.delete("/todos/{todo_id}", response_model=dict)
async def delete_todo(todo_id: int, current_user = Depends(get_current_user)):
    """할일 삭제"""
    try:
        success = db.delete_todo(current_user.id, todo_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="할일을 찾을 수 없습니다."
            )
        
        return {"message": "할일이 성공적으로 삭제되었습니다."}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할일 삭제 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/todos/stats", response_model=TodoStats)
async def get_todo_stats(current_user = Depends(get_current_user)):
    """할일 통계 조회"""
    try:
        stats = db.get_todo_stats(current_user.id)
        return stats
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"할일 통계 조회 중 오류가 발생했습니다: {str(e)}"
        )