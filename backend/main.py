from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth import router as auth_router
from app.protected import router as protected_router
from app.user_preferences import router as preferences_router
from app.database import engine, Base
from app.models import User, UserPreferences  # Import models to ensure they're registered
from todo_routes import router as todo_router
from meeting_routes import router as meeting_router
from wbs_routes import router as wbs_router
import os
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Work-Util Backend API",
    description="JWT 인증을 포함한 Work-Util 백엔드 서버",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["인증"])
app.include_router(protected_router, prefix="/api/protected", tags=["보호된 라우트"])
app.include_router(preferences_router, prefix="/api", tags=["사용자 설정"])
app.include_router(todo_router, prefix="/api", tags=["할일 관리"])
app.include_router(meeting_router, prefix="/api", tags=["회의록 관리"])
app.include_router(wbs_router, prefix="/api/wbs", tags=["WBS 관리"])

@app.get("/")
async def root():
    return {"message": "Work-Util Backend API", "status": "running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/health")
async def health_check_simple():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)