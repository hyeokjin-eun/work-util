# Work-Util 배포 가이드

JWT 인증이 연결된 Work-Util 애플리케이션을 nginx로 배포하는 방법입니다.

## 🚀 배포 개요

- **프론트엔드**: React 애플리케이션 (정적 파일로 빌드)
- **백엔드**: FastAPI 서버 (JWT 인증 포함)
- **웹서버**: Nginx (리버스 프록시)
- **인증**: JWT 토큰 기반 로그인/회원가입

## 📋 배포 전 준비사항

### 1. 시스템 요구사항
```bash
# Node.js 설치 확인
node --version  # v16+ 필요
npm --version

# Python 설치 확인
python3 --version  # v3.8+ 필요

# Nginx 설치 확인
nginx -v
```

### 2. 프로젝트 준비
```bash
# 프로젝트 클론
git clone <repository-url>
cd work-util
```

## 🔧 백엔드 배포

### 1. Python 가상환경 설정
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# 의존성 설치
pip install -r requirements.txt
```

### 2. 환경변수 설정
```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 수정 (보안을 위해 SECRET_KEY 변경 필수!)
nano .env
```

### 3. 백엔드 서버 실행
```bash
# 개발 모드
python main.py

# 또는 프로덕션 모드
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 4. 백엔드 서비스 등록 (systemd)
```bash
# 서비스 파일 생성
sudo nano /etc/systemd/system/work-util-backend.service
```

```ini
[Unit]
Description=Work-Util Backend API
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/work-util/backend
Environment=PATH=/path/to/work-util/backend/venv/bin
ExecStart=/path/to/work-util/backend/venv/bin/python main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# 서비스 활성화
sudo systemctl daemon-reload
sudo systemctl enable work-util-backend
sudo systemctl start work-util-backend
sudo systemctl status work-util-backend
```

## 🎨 프론트엔드 배포

### 1. 의존성 설치 및 빌드
```bash
cd frontend

# 의존성 설치
npm install

# 프로덕션 빌드
npm run build
```

### 2. 빌드 파일 복사
```bash
# nginx 웹 디렉토리에 복사
sudo mkdir -p /var/www/work-util
sudo cp -r build/* /var/www/work-util/
sudo chown -R www-data:www-data /var/www/work-util
```

## 🌐 Nginx 설정

### 1. Nginx 설정 파일 복사
```bash
# 설정 파일 복사
sudo cp nginx-direct.conf /etc/nginx/sites-available/work-util

# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/work-util /etc/nginx/sites-enabled/

# 기본 사이트 비활성화 (선택사항)
sudo rm /etc/nginx/sites-enabled/default
```

### 2. Nginx 설정 테스트 및 재시작
```bash
# 설정 파일 문법 검사
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 🔐 보안 설정

### 1. 방화벽 설정
```bash
# UFW 방화벽 설정
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8000  # 백엔드 포트 (내부 접근만 허용 권장)
```

### 2. SSL 인증서 (선택사항)
```bash
# Let's Encrypt 설치
sudo apt install certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com
```

## 📱 접속 확인

### 1. 서비스 접속
- **메인 애플리케이션**: `http://your-server-ip/`
- **API 문서**: `http://your-server-ip/docs`
- **회원가입**: `http://your-server-ip/register`
- **로그인**: `http://your-server-ip/login`

### 2. 테스트 계정 생성
```bash
# 브라우저에서 /register 접속하여 테스트 계정 생성
# 또는 curl 명령어 사용
curl -X POST "http://your-server-ip/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword"
  }'
```

## 🔍 문제 해결

### 1. 로그 확인
```bash
# 백엔드 로그
sudo journalctl -u work-util-backend -f

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. 일반적인 문제들

#### CORS 오류
- `nginx-direct.conf`에서 CORS 헤더 확인
- 백엔드 CORS 설정 확인

#### 인증 토큰 오류
- 브라우저 개발자 도구에서 localStorage 확인
- JWT 토큰 만료 시간 확인

#### API 연결 오류
- 백엔드 서버 상태 확인: `sudo systemctl status work-util-backend`
- 포트 8000 접근 가능 여부 확인

## 🔄 업데이트 배포

### 1. 백엔드 업데이트
```bash
cd backend
git pull
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart work-util-backend
```

### 2. 프론트엔드 업데이트
```bash
cd frontend
git pull
npm install
npm run build
sudo cp -r build/* /var/www/work-util/
```

## 📊 모니터링

### 1. 서비스 상태 모니터링
```bash
# 백엔드 서비스 상태
sudo systemctl status work-util-backend

# Nginx 상태
sudo systemctl status nginx

# 포트 사용 확인
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :8000
```

### 2. 성능 모니터링
```bash
# CPU 및 메모리 사용량
htop

# 디스크 사용량
df -h
```

이제 Work-Util 애플리케이션이 JWT 인증과 함께 완전히 배포되었습니다! 🎉