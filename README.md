# Work-Util

업무 효율성을 높이는 통합 유틸리티 도구 모음입니다.

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

## 🚀 **완전 자동 배포 가이드**

> **이 가이드를 따라하면 처음부터 끝까지 완전히 배포할 수 있습니다**

### ⚙️ **사전 요구사항**
- Ubuntu/CentOS 서버
- nginx, python3, node.js 설치됨
- next-exit.me 도메인이 서버 IP로 설정됨
- Let's Encrypt SSL 인증서 발급됨

### 🔄 **1단계: 백엔드 서버 배포**
```bash
# 프로젝트 디렉토리로 이동
cd /home/gurwls2399/work-space/work-util/backend

# 기존 프로세스 종료 (재배포시)
pkill -f "python main.py" || true

# Python 가상환경 설정
python3 -m venv venv
source venv/bin/activate

# 의존성 설치 (호환성 확인된 버전)
pip install --upgrade pip
pip install -r requirements.txt

# 환경설정 확인
cp .env.example .env 2>/dev/null || true
echo "SECRET_KEY=prod-secret-key-$(date +%s)" > .env
echo "ALGORITHM=HS256" >> .env
echo "ACCESS_TOKEN_EXPIRE_MINUTES=30" >> .env
echo "DATABASE_URL=sqlite:///./app.db" >> .env

# 백그라운드 서버 실행
nohup python main.py > backend.log 2>&1 &
sleep 3

# 백엔드 동작 확인
curl -s http://localhost:8000/api/health
echo "✅ 백엔드 서버 실행 완료"
```

### 🎨 **2단계: 프론트엔드 빌드 및 배포**
```bash
# 프론트엔드 디렉토리로 이동  
cd /home/gurwls2399/work-space/work-util/frontend

# 기존 빌드 정리
rm -rf build node_modules 2>/dev/null || true

# 의존성 설치 및 빌드
npm install
npm run build

# 웹 서버 디렉토리 설정
rm -rf /var/www/work-util 2>/dev/null || true
mkdir -p /var/www/work-util
cp -r build/* /var/www/work-util/

# 권한 설정
chmod -R 755 /var/www/work-util
chown -R nginx:nginx /var/www/work-util 2>/dev/null || chown -R www-data:www-data /var/www/work-util

echo "✅ 프론트엔드 빌드 및 배포 완료"
```

### 🌐 **3단계: Nginx 설정**
```bash
# 기존 설정 백업
cp /etc/nginx/conf.d/work-util.conf /etc/nginx/conf.d/work-util.conf.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# 새 설정 적용
cat > /etc/nginx/conf.d/work-util.conf << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name next-exit.me;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name next-exit.me;
    
    ssl_certificate /etc/letsencrypt/live/next-exit.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/next-exit.me/privkey.pem;
    
    # 프론트엔드 정적 파일 서빙
    location / {
        root /var/www/work-util;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # 캐시 설정
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # 백엔드 API 프록시
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS 헤더
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # API 문서
    location /docs {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # OpenAPI JSON
    location /openapi.json {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 설정 검사 및 적용
nginx -t && systemctl reload nginx

# SELinux 설정 (필요시)
setenforce 0 2>/dev/null || true

echo "✅ Nginx 설정 완료"
```

### ✅ **4단계: 배포 검증**
```bash
echo "🔍 배포 검증 시작..."

# 백엔드 API 확인
echo "백엔드 API 테스트:"
curl -s http://localhost:8000/api/health || echo "❌ 백엔드 연결 실패"

# 프론트엔드 확인  
echo "프론트엔드 테스트:"
curl -s -I http://localhost | grep "HTTP" || echo "❌ 프론트엔드 연결 실패"

# HTTPS 확인
echo "HTTPS 테스트:"
curl -s -I https://next-exit.me | grep "HTTP" || echo "❌ HTTPS 연결 실패"

# 프로세스 확인
echo "실행 중인 서비스:"
ps aux | grep -E "(python main.py|nginx)" | grep -v grep

echo "🎉 배포 검증 완료!"
echo "접속 URL: https://next-exit.me"
```

### 🔧 **재배포 원라이너 (빠른 업데이트)**
```bash
# 전체 재배포 (한번에 실행)
cd /home/gurwls2399/work-space/work-util && \
pkill -f "python main.py" || true && \
cd backend && source venv/bin/activate && pip install -r requirements.txt && nohup python main.py > backend.log 2>&1 & \
cd ../frontend && npm run build && rm -rf /var/www/work-util/* && cp -r build/* /var/www/work-util/ && chmod -R 755 /var/www/work-util && \
systemctl reload nginx && \
echo "✅ 재배포 완료: https://next-exit.me"
```

### 🚨 **문제 해결**
```bash
# 백엔드 로그 확인
tail -f /home/gurwls2399/work-space/work-util/backend/backend.log

# Nginx 로그 확인  
tail -f /var/log/nginx/error.log

# 포트 확인
netstat -tlnp | grep -E ":80|:443|:8000"

# 프로세스 재시작
pkill -f "python main.py" && cd /home/gurwls2399/work-space/work-util/backend && source venv/bin/activate && nohup python main.py > backend.log 2>&1 &
```

### 📊 **현재 서비스 상태**
- 🌐 **URL**: https://next-exit.me
- 🔐 **인증**: JWT 기반 로그인/회원가입
- 📋 **기능**: 할일관리, 회의록, JSON도구, QR생성기, WBS관리
- 🔄 **자동 HTTPS**: HTTP → HTTPS 리다이렉트
- 📈 **모니터링**: 로그 기반 상태 확인

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