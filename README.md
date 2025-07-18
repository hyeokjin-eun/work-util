# SmartWork - 생산성 향상을 위한 통합 업무 관리 시스템

업무 효율성을 높이는 통합 유틸리티 도구 모음입니다.

## 📦 버전 관리 (Version Management)

### 🏷️ 현재 버전
- **v1.2.1** (2025-07-18) - 데스크톱 레이아웃 및 SmartWork 배포 패키지 개발 중
- **v1.2.0** (2025-07-17) - 완전한 통합 업무 관리 시스템 구현 완료

### 📋 버전 히스토리

#### v1.2.1 (2025-07-18) - 진행 중
- 🖥️ **데스크톱 레이아웃 최적화**: 화면 크기별 적응형 인터페이스 구현
- 📱 **SmartWork 배포 패키지**: macOS DMG 배포판 생성
- 🛠️ **기능 페이지 통합**: Functions.tsx로 모든 유틸리티 기능 중앙 집중 관리
- 🎨 **서비스 소개 페이지**: ServiceIntroPage.tsx로 브랜딩 및 기능 소개 강화
- 📋 **작업 아이템 컴포넌트**: TaskItem.tsx, Widget.tsx 재사용 가능한 UI 컴포넌트
- 🔄 **Dashboard 리팩토링**: 기존 대시보드 통합 및 최적화
- 📅 **캘린더 스타일링**: 전용 CSS 파일로 스타일 분리
- ⚡ **빠른 실행 메뉴 사용자 지정**: 드래그 앤 드롭으로 메뉴 순서 변경 및 표시/숨김 설정

**새로 추가된 기능:**
- 홈 화면 빠른 실행 메뉴 완전 사용자 지정
- 드래그 앤 드롭으로 메뉴 순서 변경
- 체크박스로 메뉴 표시/숨김 설정
- 사용자 설정 자동 저장 (백엔드 API 연동)
- 8개 기본 액션 (할일, 회의록, JSON 도구, WBS, 캘린더, 유틸리티 등)

**진행 중인 작업:**
- 데스크톱 레이아웃 시스템 (DesktopLayout.tsx, DesktopNav.tsx)
- 화면 크기 감지 훅 (useScreenSize.ts)
- SmartWork 브랜딩 및 배포 자동화
- 반응형 디자인 검증 및 최적화

#### v1.2.0 (2025-07-17)
- 🔥 **완전한 통합 업무 관리 시스템 구현**
- 📊 **대시보드 실시간 데이터 연결**: 할일, 회의록, WBS 통계 실시간 표시
- 📅 **캘린더 시스템 완성**: 월별 뷰, 할일/회의/프로젝트 일정 통합 표시
- 👤 **마이페이지 고도화**: 사용자 통계, 생산성 점수, 비밀번호 변경 기능
- 🏗️ **WBS 계층 구조 완성**: 최대 5레벨 작업 계층, 모바일 최적화
- 🎨 **UI/UX 대폭 개선**: 일관된 디자인 시스템, 반응형 레이아웃
- 🔐 **보안 강화**: JWT 토큰 자동 갱신, 비밀번호 변경 기능
- 🌐 **완전한 배포 시스템**: nginx + SSL/HTTPS, 자동 배포 스크립트

**주요 신규 기능:**
- 실시간 통합 대시보드 (할일 완료율, 프로젝트 진행률, 회의록 활동)
- 캘린더 이벤트 시스템 (날짜별 할일/회의/프로젝트 표시)
- 마이페이지 사용자 통계 (생산성 점수, 활동 요약)
- WBS 작업 계층 구조 (부모-자식 관계, 레벨별 시각화)
- 비밀번호 변경 및 프로필 관리
- 완전한 데이터 연동 및 실시간 업데이트

#### v1.1.2 (2025-07-16)
- 🎨 **UI/UX 대폭 개선**: 전체적인 사용자 경험 향상
- 🔧 **날짜 필드 매핑 수정**: 생성일자, 마감일자 정상 표시
- 🏷️ **카테고리/태그 UI 개선**: 직관적인 시각적 표현
- 📱 **DatePicker 동적 위치 조정**: 화면 공간에 따른 자동 위치 변경
- 🔽 **카테고리 접기/펼치기 기능**: 새 할일 추가 페이지 UI 최적화
- ⚡ **빠른 추가 API 연결**: 실제 데이터베이스 저장 기능 완성
- 🎯 **우선순위 UI 통일**: 빠른 추가와 새 할일 추가 인터페이스 일관성
- 🖱️ **버튼 크기 안정화**: 로딩 상태 변경 시 크기 변화 방지
- 🌈 **고정 헤더 애니메이션**: 배경 애니메이션 범위 확대 및 최적화
- 🎭 **z-index 계층 관리**: 드롭다운 메뉴 표시 순서 개선

**주요 개선사항:**
- 할일 등록 시 생성일자/마감일자 정상 표시
- 카테고리별 색상 코딩 및 태그 시각화
- 화면 크기에 따른 달력 위치 자동 조정
- 빠른 추가 기능 완전 동작
- 일관된 UI/UX 경험 제공

#### v1.1.1 (2025-07-16)
- ✅ **할일 관리 시스템 완성**: SQLite 데이터베이스와 완전 통합
- 🔐 **JWT 인증 시스템 통합**: AuthContext와 백엔드 API 완전 연동
- 🗃️ **사용자별 데이터 분리**: 각 사용자의 할일이 개별적으로 관리
- 🚀 **할일 CRUD 기능**: 생성, 조회, 수정, 삭제 완전 구현
- 🎨 **맞춤형 UI 컴포넌트**: 우선순위 선택, 달력, 상태 관리 UI
- 🔧 **API 엔드포인트**: RESTful API 설계 및 구현
- 📱 **반응형 디자인**: 모바일 최적화된 할일 관리 인터페이스
- 🌐 **프로덕션 배포**: next-exit.me 도메인에 안정적 배포

#### v1.1.0 (2025-01-16)
- ✅ **JSON 비교기 완성**: 실시간 JSON 데이터 비교 및 차이점 시각화
- 🎨 **QR 생성기 완성**: 다양한 템플릿과 설정을 통한 QR 코드 생성
- 🔧 **TypeScript 타입 안전성**: 모든 기능에 대한 타입 정의 강화
- 📱 **모바일 최적화**: 반응형 디자인 개선
- 🚀 **자동 배포 시스템**: 프로덕션 배포 스크립트 안정화
- 🌐 **HTTPS 배포**: next-exit.me 도메인 운영 지속

#### v1.0.0 (2024-07-14)
- ✅ **완전한 기능 구현**: 6개 핵심 유틸리티 완성
- 🎨 **UI/UX 통합**: 일관된 디자인 시스템 적용
- 🔐 **JWT 인증 시스템**: 안전한 사용자 관리
- 📱 **모바일 최적화**: 반응형 디자인 완성
- 🚀 **자동 배포 시스템**: 프로덕션 배포 스크립트 완성
- 🌐 **HTTPS 배포**: next-exit.me 도메인 운영
- 🔧 **캐시 최적화**: HTML 캐시 방지 및 정적 자원 캐싱

**주요 기능:**
- 할일 관리 (우선순위, 마감일, 상태 관리)
- 회의록 메모 (구조화된 회의록 및 액션 아이템)
- JSON 포맷터 (들여쓰기, 정렬, 통계)
- JSON 비교기 (차이점 시각화)
- QR 생성기 (커스터마이징, 템플릿)
- WBS 관리 (프로젝트 구조화, 칸반 보드)

**기술 스택:**
- Frontend: React + TypeScript
- Backend: Python FastAPI
- Database: SQLite
- Deployment: Nginx + Let's Encrypt SSL

### 🎯 다음 버전 계획

#### v1.2.1 (진행 중)
- 🖥️ **데스크톱 레이아웃 최적화**: 화면 크기별 적응형 인터페이스
- 📱 **SmartWork 배포 패키지**: macOS DMG 배포판 생성
- 🛠️ **기능 페이지 통합**: 모든 유틸리티 기능 중앙 집중 관리
- 🎨 **서비스 소개 페이지**: 브랜딩 및 기능 소개 강화
- 📋 **작업 아이템 컴포넌트**: 재사용 가능한 작업 관리 UI

#### v1.3.0 (계획)
- 👥 **팀 협업**: 다중 사용자 프로젝트 공유
- 📱 **PWA 지원**: 오프라인 모드 및 앱 설치
- 🔍 **전체 검색**: 통합 검색 기능
- 📈 **고급 분석**: 생산성 분석 대시보드

### 🌟 버전별 브랜치 관리

```bash
# 메인 개발 브랜치
main                    # 최신 개발 버전

# 릴리스 브랜치
v1.0.0                 # 첫 번째 안정 버전
v1.1.0                 # 현재 안정 버전 (JSON 비교기 & QR 생성기)
v1.2.0                 # 다음 릴리스 (개발 중)
v1.3.0                 # 미래 릴리스 (계획)

# 기능 개발 브랜치
feature/dashboard      # 대시보드 개선
feature/notifications  # 알림 시스템
feature/dark-mode     # 다크 모드
```

## 📋 프로젝트 설명

이 프로젝트는 React 기반의 프론트엔드와 Python FastAPI 기반의 백엔드로 구성된 풀스택 웹 애플리케이션입니다.
업무 관리부터 데이터 처리까지 일상적인 업무에 필요한 도구들을 하나의 플랫폼에서 제공하며, JWT 인증을 통한 사용자 관리 기능을 포함합니다.

## 🚀 주요 기능

### 1. 할일 관리 (Todo Management) ⭐ **NEW**
- ✅ **완전한 CRUD 기능**: 생성, 조회, 수정, 삭제 완전 구현
- 🔐 **사용자별 데이터 분리**: JWT 인증을 통한 개인 할일 관리
- 🎯 **우선순위 관리**: 높음/보통/낮음 3단계 우선순위 설정
- 📅 **마감일 관리**: 달력 UI를 통한 직관적인 마감일 설정
- 🔄 **상태 관리**: 대기중/진행중/완료 상태 추적
- 📂 **카테고리 분류**: 업무 카테고리별 할일 분류
- 🏷️ **태그 시스템**: 태그를 통한 할일 분류 및 검색
- 📊 **통계 및 분석**: 완료율, 우선순위별 통계 제공
- 🎨 **맞춤형 UI**: 우선순위별 색상 코딩, 반응형 디자인
- 🔍 **필터링 및 정렬**: 상태별, 우선순위별, 마감일별 정렬

### 2. 회의록 메모 (Meeting Notes)
- 📝 구조화된 회의록 작성
- 👥 참석자 관리
- 📋 안건 및 액션 아이템 추적
- 🔍 회의록 검색 및 관리

### 3. JSON 포맷터 (JSON Formatter)
- 🎨 JSON 데이터 예쁘게 정리
- ⚙️ 들여쓰기 크기 조절
- 🔤 키 정렬 옵션
- 📊 JSON 구조 통계 제공

### 4. JSON 비교기 (JSON Compare)
- 🔍 두 JSON 데이터 실시간 비교
- 📈 변경사항 시각화 (추가/삭제/수정 구분)
- 🎯 차이점 자동 감지 및 표시
- 📋 상세 비교 보고서 생성
- ⚡ 실시간 디바운싱 비교 (1초 지연)

### 5. QR 생성기 (QR Generator)
- 📱 실시간 QR 코드 생성
- 🎨 색상 및 크기 커스터마이징
- 📋 빠른 입력 템플릿 (URL, 이메일, WiFi, 전화, SMS)
- 📐 오류 정정 수준 설정 (L/M/Q/H)
- 💾 PNG/JPEG 다운로드 지원
- 📋 클립보드 복사 기능
### 6. WBS 관리 (Work Breakdown Structure)
- 📊 프로젝트 구조화 및 관리
- 🎯 업무 분류 (창작/행정/소통)
- 📈 칸반 보드 및 진행률 추적
- 🏆 KPI 및 마일스톤 관리
- 📋 프로젝트 템플릿 (소프트웨어/마케팅/연구)

## 🛠️ 기술 스택

### Frontend
- **Framework**: React 18, TypeScript
- **Styling**: CSS3 (모듈화), 반응형 디자인
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Libraries**: 
  - qrcode (QR 코드 생성)
  - diff (JSON 비교)
  - react-calendar (캘린더 컴포넌트)
  - react-markdown (마크다운 렌더링)
  - axios (HTTP 클라이언트)

### Backend
- **Framework**: FastAPI (Python)
- **Authentication**: JWT (JSON Web Token)
- **Database**: SQLite with SQLAlchemy ORM
- **Security**: bcrypt 비밀번호 해싱
- **API Documentation**: Swagger/OpenAPI

## 📦 설치 및 실행

### 필요 사항
- Node.js 16.x 이상
- Python 3.8 이상
- npm 또는 yarn

### 프로젝트 구조
```
work-util/
├── frontend/          # React 프론트엔드
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── backend/           # FastAPI 백엔드
│   ├── app/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
└── README.md
```

### Frontend 설치 및 실행
```bash
cd frontend
npm install
npm start
```
브라우저에서 `http://localhost:3000`으로 접속하세요.

### Backend 설치 및 실행
```bash
cd backend
pip install -r requirements.txt
python main.py
```
API 서버는 `http://localhost:8000`에서 실행됩니다.
Swagger 문서는 `http://localhost:8000/docs`에서 확인하세요.

### 빌드
```bash
# Frontend 빌드
cd frontend
npm run build

# Frontend 타입 체크
npm run typecheck
```

## 🎯 업무 효율성 원칙

이 도구는 다음 업무 효율성 원칙을 기반으로 설계되었습니다:

- **업무 구조화**: 큰 프로젝트를 작은 단위로 분해하고 유형별 분류
- **시각화**: 칸반 보드와 진행률을 통한 직관적인 현황 파악
- **우선순위 관리**: ABC 분석법을 통한 효과적인 시간 배분
- **추적 시스템**: 마일스톤과 KPI를 통한 성과 측정
- **유연성**: 버퍼 시간과 백업 계획을 통한 리스크 관리

## 📁 상세 구조

### Frontend (React)
```
frontend/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── TodoList.tsx    # 할일 관리
│   │   ├── MeetingNotes.tsx # 회의록
│   │   ├── JsonFormatter.tsx # JSON 포맷터
│   │   ├── JsonCompare.tsx  # JSON 비교기
│   │   ├── QrGenerator.tsx  # QR 생성기
│   │   └── WbsManager.tsx   # WBS 관리
│   ├── styles/             # 스타일 파일
│   ├── types/              # TypeScript 타입 정의
│   └── utils/              # 유틸리티 함수
└── public/                 # 정적 파일
```

### Backend (FastAPI)
```
backend/
├── app/
│   ├── auth.py             # JWT 인증 로직
│   ├── config.py           # 설정 파일
│   ├── database.py         # 데이터베이스 연결
│   ├── models.py           # SQLAlchemy 모델
│   └── protected.py        # 보호된 라우트
├── main.py                 # FastAPI 애플리케이션
├── requirements.txt        # Python 패키지 의존성
└── .env                    # 환경변수
```

## 🔐 API 엔드포인트

### 인증 (Authentication)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인  
- `GET /api/auth/me` - 현재 사용자 정보
- `PUT /api/auth/change-password` - 비밀번호 변경

### 할일 관리 (Todo Management) ⭐ **NEW**
> **모든 할일 API는 JWT 토큰이 필요합니다**

- `GET /api/todos` - 할일 목록 조회
  - Query Parameters: `status_filter`, `limit`, `offset`
- `POST /api/todos` - 새 할일 생성
- `GET /api/todos/{todo_id}` - 특정 할일 조회
- `PUT /api/todos/{todo_id}` - 할일 수정
- `DELETE /api/todos/{todo_id}` - 할일 삭제
- `GET /api/todos/stats` - 할일 통계 조회

### 보호된 라우트 (JWT 토큰 필요)
- `GET /api/protected/profile` - 사용자 프로필
- `GET /api/protected/dashboard` - 대시보드
- `GET /api/health` - 시스템 상태 확인

## 🗃️ 데이터베이스 스키마

### 사용자 테이블 (users)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    hashed_password TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 할일 테이블 (todos) ⭐ **NEW**
```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',  -- 'high', 'medium', 'low'
    status TEXT NOT NULL DEFAULT 'pending',   -- 'pending', 'in_progress', 'completed'
    category TEXT DEFAULT '',
    due_date DATE,
    tags TEXT DEFAULT '',                      -- 콤마로 구분된 태그 목록
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

### 데이터베이스 인덱스
```sql
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_due_date ON todos(due_date);
```

## 🧪 테스트 계정 및 사용법

### 📝 테스트 계정 정보
> **프로덕션 환경에서 테스트할 수 있는 계정입니다**

| 계정 | 사용자명 | 비밀번호 | 용도 |
|------|----------|----------|------|
| 테스트 계정 | `testuser` | `password123` | 일반 기능 테스트 |
| 관리자 계정 | `admin` | `admin123` | 관리 기능 테스트 |

### 🔗 접속 및 테스트 가이드

#### 1. 웹사이트 접속
```
URL: https://next-exit.me
```

#### 2. 로그인 과정
1. 메인 페이지에서 로그인 버튼 클릭
2. 테스트 계정으로 로그인: `testuser` / `password123`
3. 홈 페이지로 자동 리다이렉트

#### 3. 할일 관리 기능 테스트
1. **홈 페이지에서 "할일 관리" 클릭**
2. **새 할일 추가 테스트**:
   - "✨ 새 할일 추가" 버튼 클릭
   - 제목, 설명, 우선순위, 마감일 설정
   - 저장 후 목록에서 확인
3. **할일 상태 변경 테스트**:
   - 할일 항목의 상태 드롭다운 변경
   - 대기중 → 진행중 → 완료 상태 변경
4. **필터링 및 정렬 테스트**:
   - 상태별 필터링 (전체/대기중/진행중/완료)
   - 정렬 옵션 변경 (우선순위/마감일/생성일/가나다순)

#### 4. API 테스트 (개발자용)
```bash
# 로그인 후 토큰 획득
curl -X POST https://next-exit.me/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'

# 할일 목록 조회
curl -X GET https://next-exit.me/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 새 할일 생성
curl -X POST https://next-exit.me/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title": "테스트 할일", "description": "API 테스트", "priority": "high"}'
```

### 🔍 기능 검증 체크리스트

#### 인증 시스템
- [ ] 회원가입 기능 동작
- [ ] 로그인/로그아웃 기능 동작
- [ ] JWT 토큰 기반 인증 동작
- [ ] 비인증 사용자 리다이렉트 동작

#### 할일 관리 시스템
- [ ] 할일 생성 기능 동작
- [ ] 할일 목록 조회 기능 동작
- [ ] 할일 수정 기능 동작
- [ ] 할일 삭제 기능 동작
- [ ] 상태 변경 기능 동작
- [ ] 필터링 기능 동작
- [ ] 정렬 기능 동작
- [ ] 우선순위 설정 기능 동작
- [ ] 마감일 설정 기능 동작
- [ ] 사용자별 데이터 분리 동작

#### UI/UX 확인
- [ ] 반응형 디자인 동작
- [ ] 우선순위별 색상 코딩 동작
- [ ] 로딩 상태 표시 동작
- [ ] 에러 처리 동작
- [ ] 마감일 표시 및 알림 동작

## 🔧 v1.2.1 진행 중인 작업 내역

### 📋 현재 진행 중인 작업 (2025-07-18)

#### 1. 데스크톱 레이아웃 시스템 구현
- **DesktopLayout.tsx**: 데스크톱 환경용 최적화된 레이아웃 컴포넌트
- **DesktopNav.tsx**: 데스크톱 전용 내비게이션 시스템
- **useScreenSize.ts**: 화면 크기 감지 및 반응형 훅
- **적응형 인터페이스**: 화면 크기별 최적화된 UI 제공

#### 2. SmartWork 배포 패키지 생성
- **macOS DMG 파일**: 독립 실행형 애플리케이션 패키지
- **배포 최적화**: 프로덕션 환경용 빌드 설정
- **브랜딩**: SmartWork 제품명으로 통합

#### 3. 기능 페이지 통합 및 개선
- **Functions.tsx**: 모든 유틸리티 기능 중앙 관리 페이지
- **ServiceIntroPage.tsx**: 서비스 소개 및 브랜딩 페이지
- **TaskItem.tsx**: 재사용 가능한 작업 아이템 컴포넌트
- **Widget.tsx**: 모듈화된 위젯 시스템

#### 4. UI/UX 개선사항
- **Calendar.css**: 캘린더 전용 스타일링
- **ServiceIntroPage.css**: 서비스 소개 페이지 스타일
- **Dashboard 페이지 리팩토링**: 기존 대시보드 통합 및 최적화

### 📝 미완료 작업 항목

#### 높은 우선순위
- [ ] 데스크톱 레이아웃 컴포넌트 통합 테스트
- [ ] SmartWork DMG 배포 자동화 스크립트
- [ ] 기능 페이지 라우팅 연결 완료
- [ ] 반응형 디자인 검증

#### 중간 우선순위
- [ ] 서비스 소개 페이지 컨텐츠 완성
- [ ] 작업 아이템 컴포넌트 재사용성 검증
- [ ] 위젯 시스템 확장성 테스트
- [ ] 캘린더 스타일링 통합

#### 낮은 우선순위
- [ ] 배포 패키지 서명 및 인증
- [ ] 다국어 지원 확장
- [ ] 접근성 개선
- [ ] 성능 최적화 리뷰

## 🔧 v1.2.0 상세 구현 내역

### 📋 주요 작업 내역 (2025-07-17)

#### 1. 통합 대시보드 시스템 구현
- **실시간 데이터 연결**: 할일, 회의록, WBS 프로젝트 API 병렬 호출
- **통계 계산 로직**: 완료율, 진행률, 생산성 점수 자동 계산
- **시각적 차트**: 실제 데이터 기반 막대 차트 및 진행률 표시
- **빠른 실행 메뉴**: 각 기능으로의 직접 접근 링크
- **활동 요약**: 프로젝트 현황 실시간 업데이트

#### 2. 캘린더 시스템 완성
- **월별 캘린더 뷰**: 모든 월 정상 표시 및 월 변경 네비게이션
- **통합 이벤트 표시**: 할일 마감일, 회의 일정, 프로젝트 마감일 통합
- **이벤트 타입별 색상 구분**: 
  - 🟢 완료된 할일 (초록색)
  - 🟡 미완료 할일/회의 (주황색)
  - 🔵 프로젝트 (파란색)
- **날짜별 이벤트 표시**: 각 날짜에 최대 3개 이벤트 점으로 표시
- **타임존 문제 해결**: 로컬 날짜 직접 생성으로 정확한 날짜 매칭

#### 3. 마이페이지 고도화
- **사용자 프로필 통계**: 실제 데이터 기반 활동 통계
- **생산성 점수 계산**: 할일 완료율 + 활동 점수 알고리즘
- **비밀번호 변경 기능**: 모달 UI, 보안 검증, 실시간 피드백
- **가입일 표시**: 사용자 계정 생성 시점 표시
- **활동 요약**: 전체 할일, 회의록, WBS 프로젝트 통계

#### 4. WBS 계층 구조 완성
- **다단계 작업 계층**: 최대 5레벨 부모-자식 관계 구현
- **레벨별 시각화**: 들여쓰기 및 색상으로 계층 구조 표현
- **작업 추가 시 레벨 계산**: 부모 작업 기준 자동 레벨 설정
- **모바일 최적화**: 계층 구조의 모바일 친화적 표현
- **API 응답 모델 수정**: Pydantic 모델 오류 해결

#### 5. 보안 및 인증 강화
- **JWT 토큰 자동 갱신**: 만료 시 자동 리프레시 토큰 사용
- **비밀번호 변경 API**: 현재 비밀번호 검증 및 새 비밀번호 설정
- **토큰 기반 API 호출**: 모든 데이터 API에 JWT 토큰 인증
- **사용자별 데이터 분리**: 토큰 기반 사용자 데이터 필터링

#### 6. UI/UX 통합 개선
- **일관된 디자인 시스템**: 모든 페이지 통일된 스타일
- **반응형 레이아웃**: 데스크톱/모바일 최적화
- **로딩 상태 관리**: 데이터 로딩 중 사용자 피드백
- **에러 처리**: 네트워크 오류 및 API 에러 적절한 처리

### 🗄️ 최종 데이터베이스 스키마

#### Users 테이블
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Todos 테이블
```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium',
    due_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Meetings 테이블
```sql
CREATE TABLE meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    participants TEXT,
    agenda TEXT,
    content TEXT,
    conclusion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### WBS_Projects 테이블
```sql
CREATE TABLE wbs_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### WBS_Tasks 테이블
```sql
CREATE TABLE wbs_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    parent_id INTEGER,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES wbs_projects(id),
    FOREIGN KEY (parent_id) REFERENCES wbs_tasks(id)
);
```

### 🚀 API 엔드포인트 완성

#### 인증 API
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보
- `PUT /api/auth/change-password` - 비밀번호 변경
- `POST /api/auth/refresh` - 토큰 갱신

#### 할일 관리 API
- `GET /api/todos` - 할일 목록 조회
- `POST /api/todos` - 새 할일 생성
- `GET /api/todos/{id}` - 할일 상세 조회
- `PUT /api/todos/{id}` - 할일 수정
- `DELETE /api/todos/{id}` - 할일 삭제

#### 회의록 API
- `GET /api/meetings` - 회의록 목록 조회
- `POST /api/meetings` - 새 회의록 생성
- `GET /api/meetings/{id}` - 회의록 상세 조회
- `PUT /api/meetings/{id}` - 회의록 수정
- `DELETE /api/meetings/{id}` - 회의록 삭제

#### WBS 관리 API
- `GET /api/wbs/projects` - WBS 프로젝트 목록 조회
- `POST /api/wbs/projects` - 새 WBS 프로젝트 생성
- `GET /api/wbs/projects/{id}` - WBS 프로젝트 상세 조회
- `PUT /api/wbs/projects/{id}` - WBS 프로젝트 수정
- `DELETE /api/wbs/projects/{id}` - WBS 프로젝트 삭제
- `GET /api/wbs/projects/{id}/tasks` - WBS 작업 목록 조회
- `POST /api/wbs/projects/{id}/tasks` - 새 WBS 작업 생성
- `PUT /api/wbs/tasks/{id}` - WBS 작업 수정
- `DELETE /api/wbs/tasks/{id}` - WBS 작업 삭제

#### 사용자 설정 API ⭐ **NEW**
> **사용자 개인 설정 및 빠른 실행 메뉴 사용자 지정**

- `GET /api/user/quick-actions` - 빠른 실행 메뉴 설정 조회
- `PUT /api/user/quick-actions` - 빠른 실행 메뉴 설정 저장
- `GET /api/user/preferences/{preference_key}` - 특정 사용자 설정 조회
- `PUT /api/user/preferences/{preference_key}` - 특정 사용자 설정 저장
- `DELETE /api/user/preferences/{preference_key}` - 특정 사용자 설정 삭제

### 🛠️ 주요 해결 과제

#### 1. 캘린더 날짜 타임존 문제
- **문제**: `toISOString()` 사용 시 UTC 변환으로 날짜 불일치
- **해결**: 로컬 날짜 직접 생성 (`YYYY-MM-DD` 형식)

#### 2. 비밀번호 변경 API 연동 문제
- **문제**: 필드명 불일치 (`current_password` vs `currentPassword`)
- **해결**: 백엔드 스키마에 맞는 필드명 사용

#### 3. WBS 계층 구조 구현
- **문제**: 다단계 부모-자식 관계 및 레벨 계산
- **해결**: 재귀적 레벨 계산 및 시각적 들여쓰기

#### 4. API 응답 모델 오류
- **문제**: Pydantic 모델 직렬화 오류
- **해결**: 일반 딕셔너리 반환으로 변경

#### 5. 실시간 데이터 연동
- **문제**: 하드코딩된 Mock 데이터
- **해결**: 실제 API 호출 및 Promise.all 병렬 처리

### 📊 성능 및 보안 최적화

#### 성능 최적화
- **병렬 API 호출**: Promise.all을 통한 동시 데이터 로드
- **로딩 상태 관리**: 사용자 경험 향상
- **메모리 효율성**: 불필요한 리렌더링 방지
- **nginx 캐싱**: 정적 파일 효율적 캐싱

#### 보안 강화
- **JWT 토큰 관리**: 자동 갱신 및 만료 처리
- **사용자 데이터 분리**: 토큰 기반 접근 제어
- **입력 검증**: 클라이언트/서버 양쪽 검증
- **HTTPS 강제**: 모든 통신 암호화

## 🔧 v1.1.2 상세 구현 내역

### 📋 주요 작업 내역 (2025-07-16)

#### 1. 할일 관리 시스템 UI/UX 대폭 개선
- **날짜 필드 매핑 수정**: 
  - API 응답 데이터 (`created_at`, `due_date`)를 프론트엔드 형식 (`createdAt`, `dueDate`)으로 변환
  - 할일 등록 시 생성일자, 마감일자 정상 표시
- **카테고리/태그 UI 개선**:
  - 카테고리별 색상 코딩 및 아이콘 적용 (업무💼, 개인👤, 학습📚, 건강🏃, 금융💰, 기타📝)
  - 태그 배지 스타일링 및 여러 태그 표시
  - 태그 유무에 따른 레이아웃 일관성 유지
- **DatePicker 동적 위치 조정**:
  - 화면 공간에 따른 자동 위치 계산 (`calculateDropdownPosition`)
  - 위/아래 동적 표시 및 애니메이션 개선
  - 창 크기 변경 및 스크롤 시 실시간 위치 재계산

#### 2. 새 할일 추가 페이지 최적화
- **카테고리 접기/펼치기 기능**:
  - 기본 접힌 상태로 UI 간소화
  - 선택된 카테고리 표시 및 자동 닫기
  - 슬라이드 애니메이션 효과
- **로딩 UI 개선**:
  - 버튼 크기 고정 (`height: 56px`)
  - 로딩 스피너 제거하여 안정적인 UI 제공
  - 텍스트 기반 로딩 상태 표시

#### 3. 빠른 추가 기능 완전 구현
- **API 연결 수정**:
  - 로컬 상태 업데이트에서 실제 API 호출로 변경
  - `/api/todos` POST 요청으로 데이터베이스 저장
  - 등록 후 할일 목록 자동 새로고침
- **우선순위 UI 통일**:
  - 새 할일 추가 페이지와 동일한 라디오 버튼 UI
  - DatePicker 컴포넌트 적용
  - 일관된 사용자 경험 제공
- **로딩 상태 관리**:
  - `isSubmitting` 상태로 버튼 비활성화
  - 안정적인 로딩 UI 제공

#### 4. 고정 헤더 애니메이션 최적화
- **배경 애니메이션 범위 확대**:
  - 애니메이션 크기를 900% x 900%로 확대
  - 더 역동적인 배경 효과 제공
  - 글자 크기 app-title 기준 통일 (28px)
- **z-index 계층 관리**:
  - 드롭다운 메뉴 표시 순서 개선
  - 모달 내 달력 z-index 최적화
  - 고정 헤더 위로 나오는 달력 처리

#### 5. 전체적인 안정성 개선
- **버튼 크기 안정화**:
  - 로딩 상태 변경 시 크기 변화 방지
  - 고정 높이 및 flexbox 레이아웃 적용
- **에러 처리 강화**:
  - 네트워크 오류 및 인증 실패 처리
  - 사용자 친화적인 에러 메시지
- **성능 최적화**:
  - 불필요한 리렌더링 방지
  - 메모리 효율적인 이벤트 핸들러

## 🔧 v1.1.1 상세 구현 내역

### 📋 주요 작업 내역 (2025-07-16)

#### 1. 백엔드 시스템 구현
- **SQLite 데이터베이스 통합**: 기존 SQLAlchemy 사용자 시스템과 연동
- **할일 관리 API 구현**: RESTful API 설계 및 구현
  - `database.py`: SQLite 기반 할일 CRUD 클래스 구현
  - `todo_routes.py`: FastAPI 라우터 및 엔드포인트 구현
  - `main.py`: 할일 API 라우터 등록 및 서버 설정
- **JWT 인증 통합**: 기존 인증 시스템과 할일 API 연동
- **데이터 검증**: Pydantic 모델을 통한 입력 데이터 검증
- **에러 처리**: 적절한 HTTP 상태 코드와 에러 메시지 반환

#### 2. 프론트엔드 시스템 구현
- **AuthContext 개선**: Mock 인증에서 실제 JWT 인증으로 전환
- **할일 관리 컴포넌트**: 
  - `TodoList.tsx`: 할일 목록 조회 및 관리 컴포넌트
  - `AddTodo.tsx`: 새 할일 추가 전용 페이지
  - `CustomSelect.tsx`: 맞춤형 드롭다운 컴포넌트
  - `DatePicker.tsx`: 커스텀 달력 컴포넌트
- **UI/UX 개선**: 
  - 우선순위별 색상 코딩
  - 반응형 디자인
  - 로딩 상태 및 에러 처리
  - 마감일 표시 및 상태 알림

#### 3. 인증 시스템 통합
- **토큰 관리 통합**: localStorage의 `access_token` 사용 통일
- **AuthContext 실제 API 연동**: `/api/auth/login` 엔드포인트 호출
- **인증 상태 관리**: `isLoading` 상태를 통한 적절한 타이밍 관리
- **자동 리다이렉트 해결**: 토큰 없을 시 로그인 페이지로 자동 이동

#### 4. 데이터베이스 설계
```sql
-- 사용자별 할일 데이터 분리
user_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE

-- 성능 최적화를 위한 인덱스 설계
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_due_date ON todos(due_date);
```

#### 5. API 설계 원칙
- **RESTful 설계**: 표준 HTTP 메서드 사용
- **JWT 보안**: 모든 할일 API에 JWT 토큰 필수
- **사용자 데이터 분리**: 토큰의 사용자 정보로 데이터 접근 제한
- **입력 검증**: Pydantic 모델을 통한 데이터 유효성 검사
- **에러 처리**: 일관된 에러 응답 형식

### 🛠️ 기술적 구현 세부사항

#### 백엔드 아키텍처
```python
# database.py - SQLite 할일 관리 클래스
class Database:
    def create_todo(self, user_id: int, todo_data: Dict[str, Any]) -> int
    def get_todos(self, user_id: int, status: Optional[str] = None) -> List[Dict[str, Any]]
    def update_todo(self, user_id: int, todo_id: int, update_data: Dict[str, Any]) -> bool
    def delete_todo(self, user_id: int, todo_id: int) -> bool
    def get_todo_stats(self, user_id: int) -> Dict[str, Any]

# todo_routes.py - FastAPI 라우터 구현
@router.post("/todos", response_model=dict)
@router.get("/todos", response_model=List[TodoResponse])
@router.get("/todos/{todo_id}", response_model=TodoResponse)
@router.put("/todos/{todo_id}", response_model=dict)
@router.delete("/todos/{todo_id}", response_model=dict)
@router.get("/todos/stats", response_model=TodoStats)
```

#### 프론트엔드 아키텍처
```typescript
// AuthContext.tsx - 실제 JWT 인증 구현
const login = async (username: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await response.json()
  localStorage.setItem('access_token', data.access_token)
  setToken(data.access_token)
  setUser(data.user)
}

// TodoList.tsx - 할일 목록 관리 컴포넌트
const { token, user, isLoading } = useAuth()
const loadTodos = async () => {
  const response = await fetch('/api/todos', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const todosData = await response.json()
  setTodos(todosData)
}
```

#### 데이터 플로우
1. **사용자 로그인** → JWT 토큰 생성 → localStorage 저장
2. **할일 API 호출** → Authorization 헤더에 토큰 첨부
3. **백엔드 인증** → JWT 토큰 검증 → 사용자 ID 추출
4. **데이터베이스 쿼리** → 사용자 ID로 할일 필터링
5. **응답 반환** → 해당 사용자의 할일만 반환

### 🐛 해결된 주요 문제들

#### 1. 자동 리다이렉트 문제
- **문제**: 할일 관리 페이지 접근 시 즉시 로그인 페이지로 리다이렉트
- **원인**: AuthContext의 mock 인증과 실제 API 인증 불일치
- **해결**: AuthContext를 실제 JWT 인증으로 전환, 토큰 키 통일

#### 2. 토큰 관리 불일치
- **문제**: AuthContext는 `token`, TodoList는 `access_token` 사용
- **원인**: 개발 과정에서 토큰 키 네이밍 불일치
- **해결**: 모든 컴포넌트에서 `access_token` 사용으로 통일

#### 3. 인증 타이밍 문제
- **문제**: AuthContext 로딩 중에 API 호출로 인한 인증 실패
- **원인**: `isLoading` 상태 확인 없이 즉시 API 호출
- **해결**: `isLoading` 완료 후 API 호출하도록 useEffect 수정

#### 4. 사용자 데이터 분리
- **문제**: 모든 사용자의 할일이 섞여서 조회됨
- **원인**: JWT 토큰의 사용자 정보 활용 미흡
- **해결**: 모든 할일 API에서 `current_user.id`로 데이터 필터링

### 💡 성능 최적화 및 보안

#### 성능 최적화
- **데이터베이스 인덱스**: 자주 조회되는 컬럼에 인덱스 생성
- **API 페이지네이션**: `limit`, `offset` 파라미터 지원
- **프론트엔드 최적화**: 로딩 상태 관리, 에러 바운더리
- **정적 자원 캐싱**: Nginx를 통한 CSS/JS 파일 캐싱

#### 보안 강화
- **JWT 토큰 인증**: 모든 할일 API에 토큰 필수
- **사용자 데이터 분리**: 타 사용자 데이터 접근 불가
- **입력 데이터 검증**: Pydantic을 통한 서버 사이드 검증
- **SQL 인젝션 방지**: SQLAlchemy ORM 사용

## 🚀 **자동 배포 스크립트**

> **새로운 배포 스크립트를 사용하여 간편하게 배포하세요!**

### 📦 **deploy-production.sh 사용법**

가장 간단하고 안전한 배포 방법:

```bash
# 프로젝트 디렉토리로 이동
cd /home/gurwls2399/work-space/work-util

# 스크립트 실행 권한 부여 (최초 1회)
chmod +x deploy-production.sh

# 전체 배포 (백엔드 + 프론트엔드 + Nginx)
./deploy-production.sh full

# 빠른 재배포 (기존 환경 재사용)
./deploy-production.sh quick

# 백엔드만 배포
./deploy-production.sh backend

# 프론트엔드만 배포  
./deploy-production.sh frontend
```

### 🔧 **배포 스크립트 명령어**

| 명령어 | 설명 | 사용 예시 |
|--------|------|----------|
| `full` | 전체 배포 (처음 배포시) | `./deploy-production.sh full` |
| `quick` | 빠른 재배포 (코드 수정 후) | `./deploy-production.sh quick` |
| `backend` | 백엔드만 배포 | `./deploy-production.sh backend` |
| `frontend` | 프론트엔드만 배포 | `./deploy-production.sh frontend` |
| `status` | 서비스 상태 확인 | `./deploy-production.sh status` |
| `logs` | 로그 확인 | `./deploy-production.sh logs backend` |
| `stop` | 서비스 중지 | `./deploy-production.sh stop` |

### ⚡ **빠른 시작 (권장)**

```bash
# 1. 전체 배포 (최초 배포)
./deploy-production.sh full

# 2. 코드 수정 후 빠른 재배포
./deploy-production.sh quick

# 3. 상태 확인
./deploy-production.sh status
```

### 📊 **모니터링 및 관리**

```bash
# 서비스 상태 확인
./deploy-production.sh status

# 백엔드 로그 실시간 확인
./deploy-production.sh logs backend

# Nginx 로그 실시간 확인  
./deploy-production.sh logs nginx

# 서비스 중지
./deploy-production.sh stop
```

### 🛠️ **수동 배포 가이드 (참고용)**

배포 스크립트 사용을 권장하지만, 수동 배포가 필요한 경우:

<details>
<summary>수동 배포 단계별 가이드 (클릭하여 펼치기)</summary>

#### ⚙️ **사전 요구사항**
- Ubuntu/CentOS 서버
- nginx, python3, node.js 설치됨
- next-exit.me 도메인이 서버 IP로 설정됨
- Let's Encrypt SSL 인증서 발급됨

#### 🔄 **1단계: 백엔드 서버 배포**
```bash
cd /home/gurwls2399/work-space/work-util/backend
pkill -f "python main.py" || true
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "SECRET_KEY=prod-secret-key-$(date +%s)" > .env
echo "ALGORITHM=HS256" >> .env
echo "ACCESS_TOKEN_EXPIRE_MINUTES=30" >> .env
echo "DATABASE_URL=sqlite:///./app.db" >> .env
nohup python main.py > backend.log 2>&1 &
sleep 3
curl -s http://localhost:8000/api/health
```

#### 🎨 **2단계: 프론트엔드 빌드 및 배포**
```bash
cd /home/gurwls2399/work-space/work-util/frontend
rm -rf build node_modules 2>/dev/null || true
npm install
npm run build
sudo rm -rf /var/www/work-util 2>/dev/null || true
sudo mkdir -p /var/www/work-util
sudo cp -r build/* /var/www/work-util/
sudo chmod -R 755 /var/www/work-util
sudo chown -R nginx:nginx /var/www/work-util 2>/dev/null || sudo chown -R www-data:www-data /var/www/work-util
```

#### 🌐 **3단계: Nginx 설정**
```bash
sudo cp /etc/nginx/conf.d/work-util.conf /etc/nginx/conf.d/work-util.conf.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

sudo tee /etc/nginx/conf.d/work-util.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name next-exit.me;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name next-exit.me;
    
    ssl_certificate /etc/letsencrypt/live/next-exit.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/next-exit.me/privkey.pem;
    
    location / {
        root /var/www/work-util;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    location /docs {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /openapi.json {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo nginx -t && sudo systemctl reload nginx
```

#### ✅ **4단계: 배포 검증**
```bash
curl -s http://localhost:8000/api/health
curl -s -I http://localhost | grep "HTTP"
curl -s -I https://next-exit.me | grep "HTTP"
ps aux | grep -E "(python main.py|nginx)" | grep -v grep
```

</details>

### 🚨 **문제 해결**

```bash
# 로그 확인
./deploy-production.sh logs backend    # 백엔드 로그
./deploy-production.sh logs nginx      # Nginx 로그

# 서비스 상태 확인
./deploy-production.sh status

# 서비스 재시작
./deploy-production.sh stop
./deploy-production.sh quick

# 수동 프로세스 재시작
pkill -f "python main.py"
cd /home/gurwls2399/work-space/work-util/backend
source venv/bin/activate
nohup python main.py > backend.log 2>&1 &
```

## 📜 **프로젝트 스크립트**

프로젝트 루트에 있는 배포 및 관리 스크립트들:

| 스크립트 | 용도 | 설명 |
|---------|------|------|
| `deploy.sh` | Docker 배포 | Docker Compose 기반 개발/프로덕션 배포 |
| `deploy-nginx.sh` | Nginx 관리 | Nginx 설정 및 관리 (메뉴 방식) |
| `deploy-production.sh` | **실제 배포** | **실제 운영용 nginx 배포 (권장)** |

### 🎯 **권장 사용법**

```bash
# 운영 배포 (가장 많이 사용)
./deploy-production.sh quick

# 개발 환경 (Docker)
./deploy.sh dev

# Nginx 고급 관리 (필요시)
sudo ./deploy-nginx.sh
```

### 📊 **현재 서비스 상태**

- 🌐 **URL**: https://next-exit.me
- 🔐 **인증**: JWT 기반 로그인/회원가입, 토큰 자동 갱신
- 📋 **기능**: 
  - ✅ 할일관리 (우선순위, 마감일, 상태 관리)
  - ✅ 회의록 (작성, 수정, 삭제)
  - ✅ WBS 관리 (프로젝트, 작업 계층 구조)
  - ✅ 캘린더 (월별 뷰, 통합 이벤트 표시)
  - ✅ 대시보드 (실시간 통계, 차트)
  - ✅ 마이페이지 (프로필, 통계, 비밀번호 변경)
  - ✅ JSON도구 (포맷터, 비교기)
  - ✅ QR생성기 (커스터마이징)
- 🔄 **자동 HTTPS**: HTTP → HTTPS 리다이렉트
- 📈 **모니터링**: 로그 기반 상태 확인
- 🚀 **배포**: `deploy-production.sh` 스크립트 사용
- 📊 **데이터베이스**: SQLite with SQLAlchemy ORM
- 🎨 **UI/UX**: 완전 반응형 디자인, 일관된 사용자 경험

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

문의사항이나 제안이 있으시면 GitHub Issues를 통해 연락주세요.

## 🙏 감사의 말

이 프로젝트는 일상적인 업무 효율성을 높이기 위한 목적으로 개발되었습니다. 
모든 피드백과 기여를 환영합니다!