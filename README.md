# Work-Util

업무 효율성을 높이는 통합 유틸리티 도구 모음입니다.

## 📦 버전 관리 (Version Management)

### 🏷️ 현재 버전
- **v1.0.0** (2024-07-14) - 안정된 첫 번째 릴리스

### 📋 버전 히스토리

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

#### v1.1.0 (계획)
- 📊 **대시보드 개선**: 통합 분석 화면
- 🔔 **알림 시스템**: 마감일 및 이벤트 알림
- 📤 **데이터 내보내기**: CSV, PDF 내보내기 기능
- 🌙 **다크 모드**: 사용자 테마 선택 기능

#### v1.2.0 (계획)
- 👥 **팀 협업**: 다중 사용자 프로젝트 공유
- 📱 **PWA 지원**: 오프라인 모드 및 앱 설치
- 🔍 **전체 검색**: 통합 검색 기능
- 📈 **고급 분석**: 생산성 분석 대시보드

### 🌟 버전별 브랜치 관리

```bash
# 메인 개발 브랜치
main                    # 최신 개발 버전

# 릴리스 브랜치
v1.0.0                 # 현재 안정 버전
v1.1.0                 # 다음 릴리스 (개발 중)
v1.2.0                 # 미래 릴리스 (계획)

# 기능 개발 브랜치
feature/dashboard      # 대시보드 개선
feature/notifications  # 알림 시스템
feature/dark-mode     # 다크 모드
```

## 📋 프로젝트 설명

이 프로젝트는 React 기반의 프론트엔드와 Python FastAPI 기반의 백엔드로 구성된 풀스택 웹 애플리케이션입니다.
업무 관리부터 데이터 처리까지 일상적인 업무에 필요한 도구들을 하나의 플랫폼에서 제공하며, JWT 인증을 통한 사용자 관리 기능을 포함합니다.

## 🚀 주요 기능

### 1. 할일 관리 (Todo Management)
- ✅ 우선순위별 작업 관리 (A/B/C 등급)
- 📅 마감일 설정 및 추적
- 🔄 상태별 필터링 (대기중/진행중/완료)
- 📊 진행률 시각화

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
- 🔍 두 JSON 데이터 비교
- 📈 변경사항 시각화
- 🎯 차이점만 필터링
- 📋 상세 비교 보고서

### 5. QR 생성기 (QR Generator)
- 📱 다양한 형식의 QR 코드 생성
- 🎨 색상 및 크기 커스터마이징
- 📋 빠른 입력 템플릿 (URL, 이메일, WiFi 등)
- 💾 다운로드 및 클립보드 복사

### 6. WBS 관리 (Work Breakdown Structure)
- 📊 프로젝트 구조화 및 관리
- 🎯 업무 분류 (창작/행정/소통)
- 📈 칸반 보드 및 진행률 추적
- 🏆 KPI 및 마일스톤 관리
- 📋 프로젝트 템플릿 (소프트웨어/마케팅/연구)

## 🛠️ 기술 스택

### Frontend
- **Framework**: React 18, TypeScript
- **Styling**: CSS3 (모듈화)
- **Routing**: React Router DOM
- **Build Tool**: Create React App
- **Libraries**: 
  - QRCode.js (QR 코드 생성)
  - date-fns (날짜 처리)
  - uuid (고유 ID 생성)

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

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인  
- `GET /api/auth/me` - 현재 사용자 정보

### 보호된 라우트 (JWT 토큰 필요)
- `GET /api/protected/profile` - 사용자 프로필
- `GET /api/protected/dashboard` - 대시보드

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
- 🔐 **인증**: JWT 기반 로그인/회원가입
- 📋 **기능**: 할일관리, 회의록, JSON도구, QR생성기, WBS관리
- 🔄 **자동 HTTPS**: HTTP → HTTPS 리다이렉트
- 📈 **모니터링**: 로그 기반 상태 확인
- 🚀 **배포**: `deploy-production.sh` 스크립트 사용

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