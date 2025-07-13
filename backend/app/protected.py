from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.models import User

router = APIRouter()

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "message": "보호된 프로필 정보",
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at
        }
    }

@router.get("/dashboard")
async def get_dashboard(current_user: User = Depends(get_current_user)):
    return {
        "message": f"{current_user.username}님의 대시보드",
        "data": {
            "todos": [],
            "meetings": [],
            "recent_activity": []
        }
    }