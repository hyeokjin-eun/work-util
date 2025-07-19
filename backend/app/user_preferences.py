from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
import json
from app.database import get_db
from app.models import UserPreferences
from app.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class QuickActionRequest(BaseModel):
    actions: list

class PreferenceRequest(BaseModel):
    preference_key: str
    preference_value: Any

@router.get("/user/quick-actions")
async def get_quick_actions(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's quick actions preferences"""
    try:
        user_id = current_user.id
        
        # Get quick actions preference
        preference = db.query(UserPreferences).filter(
            UserPreferences.user_id == user_id,
            UserPreferences.preference_key == "quick_actions"
        ).first()
        
        if preference:
            return json.loads(preference.preference_value)
        else:
            # Return empty array if no preference exists
            return []
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get quick actions: {str(e)}")

@router.put("/user/quick-actions")
async def update_quick_actions(
    request: QuickActionRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's quick actions preferences"""
    try:
        user_id = current_user.id
        
        # Check if preference exists
        preference = db.query(UserPreferences).filter(
            UserPreferences.user_id == user_id,
            UserPreferences.preference_key == "quick_actions"
        ).first()
        
        preference_value = json.dumps(request.actions)
        
        if preference:
            # Update existing preference
            preference.preference_value = preference_value
        else:
            # Create new preference
            preference = UserPreferences(
                user_id=user_id,
                preference_key="quick_actions",
                preference_value=preference_value
            )
            db.add(preference)
        
        db.commit()
        
        return {"message": "Quick actions updated successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update quick actions: {str(e)}")

@router.get("/user/preferences/{preference_key}")
async def get_user_preference(
    preference_key: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific user preference"""
    try:
        user_id = current_user.id
        
        preference = db.query(UserPreferences).filter(
            UserPreferences.user_id == user_id,
            UserPreferences.preference_key == preference_key
        ).first()
        
        if preference:
            return {"preference_value": json.loads(preference.preference_value)}
        else:
            raise HTTPException(status_code=404, detail="Preference not found")
            
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid preference data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get preference: {str(e)}")

@router.put("/user/preferences/{preference_key}")
async def update_user_preference(
    preference_key: str,
    request: PreferenceRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a specific user preference"""
    try:
        user_id = current_user.id
        
        # Check if preference exists
        preference = db.query(UserPreferences).filter(
            UserPreferences.user_id == user_id,
            UserPreferences.preference_key == preference_key
        ).first()
        
        preference_value = json.dumps(request.preference_value)
        
        if preference:
            # Update existing preference
            preference.preference_value = preference_value
        else:
            # Create new preference
            preference = UserPreferences(
                user_id=user_id,
                preference_key=preference_key,
                preference_value=preference_value
            )
            db.add(preference)
        
        db.commit()
        
        return {"message": f"Preference '{preference_key}' updated successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update preference: {str(e)}")

@router.delete("/user/preferences/{preference_key}")
async def delete_user_preference(
    preference_key: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a specific user preference"""
    try:
        user_id = current_user.id
        
        preference = db.query(UserPreferences).filter(
            UserPreferences.user_id == user_id,
            UserPreferences.preference_key == preference_key
        ).first()
        
        if preference:
            db.delete(preference)
            db.commit()
            return {"message": f"Preference '{preference_key}' deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Preference not found")
            
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete preference: {str(e)}")

# Home Screen Layout APIs
class HomeScreenLayoutRequest(BaseModel):
    layout: dict

@router.get("/user/home-screen-layout")
async def get_home_screen_layout(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's home screen layout preferences"""
    try:
        user_id = current_user.id
        
        # Get home screen layout preference
        preference = db.query(UserPreferences).filter(
            UserPreferences.user_id == user_id,
            UserPreferences.preference_key == "home_screen_layout"
        ).first()
        
        if preference:
            return json.loads(preference.preference_value)
        else:
            # Return default layout if no preference exists
            return {
                "sections": [
                    {
                        "id": "welcome",
                        "type": "welcome",
                        "title": "환영 배너",
                        "description": "현재 시간과 날짜를 표시합니다",
                        "enabled": True,
                        "order": 1,
                        "settings": {
                            "showTime": True,
                            "showDate": True,
                            "showGreeting": True
                        }
                    },
                    {
                        "id": "stats",
                        "type": "stats",
                        "title": "통계 현황",
                        "description": "할일, 완료율, 프로젝트 등 주요 통계를 표시합니다",
                        "enabled": True,
                        "order": 2,
                        "settings": {
                            "layout": "grid",
                            "showAnimations": True,
                            "showTodos": True,
                            "showProjects": True,
                            "showCompletion": True
                        }
                    },
                    {
                        "id": "progress",
                        "type": "progress",
                        "title": "진행률 표시",
                        "description": "전체 진행률을 바 형태로 표시합니다",
                        "enabled": True,
                        "order": 3,
                        "settings": {
                            "showPercentage": True,
                            "showDetails": True,
                            "animateProgress": True
                        }
                    },
                    {
                        "id": "quickActions",
                        "type": "quickActions",
                        "title": "빠른 실행",
                        "description": "자주 사용하는 기능들에 빠르게 접근할 수 있습니다",
                        "enabled": True,
                        "order": 4,
                        "settings": {
                            "layout": "grid",
                            "showIcons": True,
                            "showDescriptions": True,
                            "maxItems": 8
                        }
                    },
                    {
                        "id": "activity",
                        "type": "activity",
                        "title": "활동 현황",
                        "description": "최근 활동과 프로젝트 현황을 표시합니다",
                        "enabled": True,
                        "order": 5,
                        "settings": {
                            "showChart": True,
                            "showStats": True,
                            "showRecentActivity": True
                        }
                    }
                ]
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get home screen layout: {str(e)}")

@router.put("/user/home-screen-layout")
async def update_home_screen_layout(
    request: HomeScreenLayoutRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's home screen layout preferences"""
    try:
        user_id = current_user.id
        
        # Check if preference exists
        preference = db.query(UserPreferences).filter(
            UserPreferences.user_id == user_id,
            UserPreferences.preference_key == "home_screen_layout"
        ).first()
        
        preference_value = json.dumps(request.layout)
        
        if preference:
            # Update existing preference
            preference.preference_value = preference_value
        else:
            # Create new preference
            preference = UserPreferences(
                user_id=user_id,
                preference_key="home_screen_layout",
                preference_value=preference_value
            )
            db.add(preference)
        
        db.commit()
        
        return {"message": "Home screen layout updated successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update home screen layout: {str(e)}")