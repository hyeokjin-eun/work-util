from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from app.database import get_db
from app.auth import get_current_user
from app.models import User
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

Base = declarative_base()

# WBS 프로젝트 모델
class WBSProject(Base):
    __tablename__ = "wbs_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String(20), default="planning")  # planning, in_progress, completed, on_hold
    progress = Column(Float, default=0.0)
    user_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 관계 설정
    tasks = relationship("WBSTask", back_populates="project", cascade="all, delete-orphan")

# WBS 작업 모델
class WBSTask(Base):
    __tablename__ = "wbs_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    duration = Column(Integer)  # 소요 시간(일)
    progress = Column(Float, default=0.0)
    status = Column(String(20), default="not_started")  # not_started, in_progress, completed, blocked
    priority = Column(String(10), default="medium")  # low, medium, high
    assignee = Column(String(100))
    
    # 계층 구조
    parent_id = Column(Integer, ForeignKey("wbs_tasks.id"))
    level = Column(Integer, default=1)
    order_index = Column(Integer, default=0)
    
    # 프로젝트 연결
    project_id = Column(Integer, ForeignKey("wbs_projects.id"))
    
    # 관계 설정
    project = relationship("WBSProject", back_populates="tasks")
    parent = relationship("WBSTask", remote_side=[id])
    children = relationship("WBSTask")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic 모델들
class WBSTaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration: Optional[int] = None
    progress: float = 0.0
    status: str = "not_started"
    priority: str = "medium"
    assignee: Optional[str] = None
    parent_id: Optional[int] = None
    level: int = 1
    order_index: int = 0

class WBSTaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration: Optional[int] = None
    progress: Optional[float] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee: Optional[str] = None
    parent_id: Optional[int] = None
    level: Optional[int] = None
    order_index: Optional[int] = None

class WBSTaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    duration: Optional[int]
    progress: float
    status: str
    priority: str
    assignee: Optional[str]
    parent_id: Optional[int]
    level: int
    order_index: int
    project_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class WBSProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str = "planning"

class WBSProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    progress: Optional[float] = None

class WBSProjectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    status: str
    progress: float
    user_id: int
    created_at: datetime
    updated_at: datetime
    tasks: List[WBSTaskResponse] = []
    
    class Config:
        from_attributes = True

router = APIRouter()

# WBS 프로젝트 목록 조회
@router.get("/projects")
async def get_wbs_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        projects = db.query(WBSProject).filter(
            WBSProject.user_id == current_user.id
        ).order_by(WBSProject.updated_at.desc()).all()
        
        result = []
        for project in projects:
            result.append({
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "start_date": project.start_date.isoformat() if project.start_date else None,
                "end_date": project.end_date.isoformat() if project.end_date else None,
                "status": project.status,
                "progress": project.progress,
                "user_id": project.user_id,
                "created_at": project.created_at.isoformat(),
                "updated_at": project.updated_at.isoformat(),
                "tasks": []
            })
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"WBS 프로젝트 목록 조회 중 오류가 발생했습니다: {str(e)}"
        )

# WBS 프로젝트 생성
@router.post("/projects")
async def create_wbs_project(
    project: WBSProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_project = WBSProject(
            title=project.title,
            description=project.description,
            start_date=project.start_date,
            end_date=project.end_date,
            status=project.status,
            user_id=current_user.id
        )
        
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        
        return {
            "id": db_project.id,
            "title": db_project.title,
            "description": db_project.description,
            "start_date": db_project.start_date.isoformat() if db_project.start_date else None,
            "end_date": db_project.end_date.isoformat() if db_project.end_date else None,
            "status": db_project.status,
            "progress": db_project.progress,
            "user_id": db_project.user_id,
            "created_at": db_project.created_at.isoformat(),
            "updated_at": db_project.updated_at.isoformat(),
            "tasks": []
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"WBS 프로젝트 생성 중 오류가 발생했습니다: {str(e)}"
        )

# WBS 프로젝트 상세 조회
@router.get("/projects/{project_id}")
async def get_wbs_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        project = db.query(WBSProject).filter(
            WBSProject.id == project_id,
            WBSProject.user_id == current_user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="WBS 프로젝트를 찾을 수 없습니다."
            )
        
        return {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "start_date": project.start_date.isoformat() if project.start_date else None,
            "end_date": project.end_date.isoformat() if project.end_date else None,
            "status": project.status,
            "progress": project.progress,
            "user_id": project.user_id,
            "created_at": project.created_at.isoformat(),
            "updated_at": project.updated_at.isoformat(),
            "tasks": []
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"WBS 프로젝트 조회 중 오류가 발생했습니다: {str(e)}"
        )

# WBS 프로젝트 수정
@router.put("/projects/{project_id}")
async def update_wbs_project(
    project_id: int,
    project_update: WBSProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db_project = db.query(WBSProject).filter(
            WBSProject.id == project_id,
            WBSProject.user_id == current_user.id
        ).first()
        
        if not db_project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="WBS 프로젝트를 찾을 수 없습니다."
            )
        
        update_data = project_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_project, field, value)
        
        db_project.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_project)
        
        return {
            "id": db_project.id,
            "title": db_project.title,
            "description": db_project.description,
            "start_date": db_project.start_date.isoformat() if db_project.start_date else None,
            "end_date": db_project.end_date.isoformat() if db_project.end_date else None,
            "status": db_project.status,
            "progress": db_project.progress,
            "user_id": db_project.user_id,
            "created_at": db_project.created_at.isoformat(),
            "updated_at": db_project.updated_at.isoformat(),
            "tasks": []
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"WBS 프로젝트 수정 중 오류가 발생했습니다: {str(e)}"
        )

# WBS 프로젝트 삭제
@router.delete("/projects/{project_id}")
async def delete_wbs_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_project = db.query(WBSProject).filter(
        WBSProject.id == project_id,
        WBSProject.user_id == current_user.id
    ).first()
    
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="WBS 프로젝트를 찾을 수 없습니다."
        )
    
    db.delete(db_project)
    db.commit()
    
    return {"message": "WBS 프로젝트가 성공적으로 삭제되었습니다."}

# WBS 작업 목록 조회
@router.get("/projects/{project_id}/tasks")
async def get_wbs_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # 프로젝트 소유권 확인
        project = db.query(WBSProject).filter(
            WBSProject.id == project_id,
            WBSProject.user_id == current_user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="WBS 프로젝트를 찾을 수 없습니다."
            )
        
        tasks = db.query(WBSTask).filter(
            WBSTask.project_id == project_id
        ).order_by(WBSTask.level, WBSTask.order_index).all()
        
        result = []
        for task in tasks:
            result.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "start_date": task.start_date.isoformat() if task.start_date else None,
                "end_date": task.end_date.isoformat() if task.end_date else None,
                "duration": task.duration,
                "progress": task.progress,
                "status": task.status,
                "priority": task.priority,
                "assignee": task.assignee,
                "parent_id": task.parent_id,
                "level": task.level,
                "order_index": task.order_index,
                "project_id": task.project_id,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat()
            })
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"WBS 작업 목록 조회 중 오류가 발생했습니다: {str(e)}"
        )

# WBS 작업 생성
@router.post("/projects/{project_id}/tasks")
async def create_wbs_task(
    project_id: int,
    task: WBSTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # 프로젝트 소유권 확인
        project = db.query(WBSProject).filter(
            WBSProject.id == project_id,
            WBSProject.user_id == current_user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="WBS 프로젝트를 찾을 수 없습니다."
            )
        
        db_task = WBSTask(
            title=task.title,
            description=task.description,
            start_date=task.start_date,
            end_date=task.end_date,
            duration=task.duration,
            progress=task.progress,
            status=task.status,
            priority=task.priority,
            assignee=task.assignee,
            parent_id=task.parent_id,
            level=task.level,
            order_index=task.order_index,
            project_id=project_id
        )
        
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        
        return {
            "id": db_task.id,
            "title": db_task.title,
            "description": db_task.description,
            "start_date": db_task.start_date.isoformat() if db_task.start_date else None,
            "end_date": db_task.end_date.isoformat() if db_task.end_date else None,
            "duration": db_task.duration,
            "progress": db_task.progress,
            "status": db_task.status,
            "priority": db_task.priority,
            "assignee": db_task.assignee,
            "parent_id": db_task.parent_id,
            "level": db_task.level,
            "order_index": db_task.order_index,
            "project_id": db_task.project_id,
            "created_at": db_task.created_at.isoformat(),
            "updated_at": db_task.updated_at.isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"WBS 작업 생성 중 오류가 발생했습니다: {str(e)}"
        )

# WBS 작업 수정
@router.put("/projects/{project_id}/tasks/{task_id}")
async def update_wbs_task(
    project_id: int,
    task_id: int,
    task_update: WBSTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # 프로젝트 소유권 확인
        project = db.query(WBSProject).filter(
            WBSProject.id == project_id,
            WBSProject.user_id == current_user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="WBS 프로젝트를 찾을 수 없습니다."
            )
        
        db_task = db.query(WBSTask).filter(
            WBSTask.id == task_id,
            WBSTask.project_id == project_id
        ).first()
        
        if not db_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="WBS 작업을 찾을 수 없습니다."
            )
        
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)
        
        db_task.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_task)
        
        return {
            "id": db_task.id,
            "title": db_task.title,
            "description": db_task.description,
            "start_date": db_task.start_date.isoformat() if db_task.start_date else None,
            "end_date": db_task.end_date.isoformat() if db_task.end_date else None,
            "duration": db_task.duration,
            "progress": db_task.progress,
            "status": db_task.status,
            "priority": db_task.priority,
            "assignee": db_task.assignee,
            "parent_id": db_task.parent_id,
            "level": db_task.level,
            "order_index": db_task.order_index,
            "project_id": db_task.project_id,
            "created_at": db_task.created_at.isoformat(),
            "updated_at": db_task.updated_at.isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"WBS 작업 수정 중 오류가 발생했습니다: {str(e)}"
        )

# WBS 작업 삭제
@router.delete("/projects/{project_id}/tasks/{task_id}")
async def delete_wbs_task(
    project_id: int,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 프로젝트 소유권 확인
    project = db.query(WBSProject).filter(
        WBSProject.id == project_id,
        WBSProject.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="WBS 프로젝트를 찾을 수 없습니다."
        )
    
    db_task = db.query(WBSTask).filter(
        WBSTask.id == task_id,
        WBSTask.project_id == project_id
    ).first()
    
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="WBS 작업을 찾을 수 없습니다."
        )
    
    db.delete(db_task)
    db.commit()
    
    return {"message": "WBS 작업이 성공적으로 삭제되었습니다."}