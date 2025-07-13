# Work-Util Backend API

JWT 인증을 포함한 Work-Util 애플리케이션의 백엔드 서버입니다.

## 기능

- JWT 기반 사용자 인증
- 회원가입 및 로그인
- 보호된 라우트
- SQLite 데이터베이스
- CORS 설정으로 프론트엔드 연동 지원

## 설치 및 실행

### 1. 가상환경 생성 및 활성화
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 또는
venv\Scripts\activate  # Windows
```

### 2. 패키지 설치
```bash
pip install -r requirements.txt
```

### 3. 환경변수 설정
`.env` 파일에서 SECRET_KEY를 변경하세요:
```
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./app.db
```

### 4. 서버 실행
```bash
python main.py
```
또는
```bash
uvicorn main:app --reload
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 보호된 라우트 (JWT 토큰 필요)
- `GET /api/protected/profile` - 사용자 프로필
- `GET /api/protected/dashboard` - 대시보드

### 기타
- `GET /` - API 상태 확인
- `GET /api/health` - 헬스 체크
- `GET /docs` - Swagger API 문서

## 사용 예시

### 회원가입
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword"
  }'
```

### 로그인
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpassword"
  }'
```

### 보호된 라우트 접근
```bash
curl -X GET "http://localhost:8000/api/protected/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 프로젝트 구조

```
backend/
├── app/
│   ├── __init__.py
│   ├── auth.py          # JWT 인증 로직
│   ├── config.py        # 설정 파일
│   ├── database.py      # 데이터베이스 연결
│   ├── models.py        # SQLAlchemy 모델
│   └── protected.py     # 보호된 라우트
├── main.py              # FastAPI 애플리케이션
├── requirements.txt     # 패키지 의존성
├── .env                 # 환경변수
└── README.md
```