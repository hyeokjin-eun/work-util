#!/bin/bash

# Work-Util Production Deployment Script
# 실제 nginx 프로덕션 배포용 스크립트
# 사용법: ./deploy-production.sh [option]

set -e  # 에러 발생시 스크립트 중단

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 프로젝트 설정
PROJECT_ROOT="/home/gurwls2399/work-space/work-util"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
WEB_ROOT="/var/www/work-util"
DOMAIN="next-exit.me"

# 배포 모드 설정
DEPLOY_MODE=${1:-"full"}

log_info "🚀 Work-Util Production Deployment (Mode: $DEPLOY_MODE)"

# 백엔드 배포 함수
deploy_backend() {
    log_info "📦 Deploying Backend..."
    
    # 기존 프로세스 종료
    log_info "Stopping existing backend processes..."
    pkill -f "python main.py" || true
    sleep 2
    
    # 백엔드 디렉토리로 이동
    cd "$BACKEND_DIR"
    
    # 가상환경 설정
    if [ ! -d "venv" ]; then
        log_info "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    log_info "Installing dependencies..."
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # 환경설정 파일 생성
    if [ ! -f ".env" ]; then
        log_info "Creating environment configuration..."
        cat > .env << EOF
SECRET_KEY=prod-secret-key-$(date +%s)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./app.db
EOF
    fi
    
    # 백엔드 서버 시작
    log_info "Starting backend server..."
    nohup python main.py > backend.log 2>&1 &
    sleep 3
    
    # 백엔드 상태 확인
    if curl -s http://localhost:8000/api/health > /dev/null; then
        log_success "Backend server running successfully"
    else
        log_error "Backend server failed to start"
        exit 1
    fi
}

# 프론트엔드 배포 함수
deploy_frontend() {
    log_info "🎨 Deploying Frontend..."
    
    cd "$FRONTEND_DIR"
    
    # 빌드 파일 정리
    log_info "Cleaning previous builds..."
    rm -rf build node_modules 2>/dev/null || true
    
    # 의존성 설치
    log_info "Installing npm dependencies..."
    npm install
    
    # 프로덕션 빌드
    log_info "Building for production..."
    npm run build
    
    # 웹 서버에 배포
    log_info "Deploying to web server..."
    sudo rm -rf "$WEB_ROOT" 2>/dev/null || true
    sudo mkdir -p "$WEB_ROOT"
    sudo cp -r build/* "$WEB_ROOT/"
    
    # 권한 설정
    sudo chmod -R 755 "$WEB_ROOT"
    sudo chown -R nginx:nginx "$WEB_ROOT" 2>/dev/null || sudo chown -R www-data:www-data "$WEB_ROOT"
    
    log_success "Frontend deployed successfully"
}

# Nginx 설정 함수
configure_nginx() {
    log_info "🌐 Configuring Nginx..."
    
    # 기존 설정 백업
    sudo cp /etc/nginx/conf.d/work-util.conf /etc/nginx/conf.d/work-util.conf.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    
    # Nginx 설정 적용
    sudo tee /etc/nginx/conf.d/work-util.conf > /dev/null << EOF
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Frontend static files
    location / {
        root $WEB_ROOT;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
        
        # No cache for HTML files
        location ~* \.(html|htm)$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
    }

    # API documentation
    location /docs {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # OpenAPI specification
    location /openapi.json {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    # Nginx 설정 테스트 및 적용
    if sudo nginx -t; then
        sudo systemctl reload nginx
        log_success "Nginx configuration updated successfully"
    else
        log_error "Nginx configuration failed"
        exit 1
    fi
}

# 배포 검증 함수
verify_deployment() {
    log_info "🔍 Verifying deployment..."
    
    # 백엔드 API 확인
    if curl -s http://localhost:8000/api/health | grep -q "healthy"; then
        log_success "✅ Backend API: OK"
    else
        log_error "❌ Backend API: Failed"
    fi
    
    # HTTP 리다이렉트 확인
    if curl -s -I http://$DOMAIN | grep -q "301"; then
        log_success "✅ HTTP → HTTPS redirect: OK"
    else
        log_warning "⚠️  HTTP redirect: Check needed"
    fi
    
    # HTTPS 연결 확인
    if curl -s -I https://$DOMAIN | grep -q "200"; then
        log_success "✅ HTTPS connection: OK"
    else
        log_warning "⚠️  HTTPS connection: Check needed"
    fi
    
    # 서비스 프로세스 확인
    log_info "Running services:"
    ps aux | grep -E "(python main.py|nginx)" | grep -v grep || log_warning "No processes found"
    
    log_success "🎉 Deployment verification completed!"
    log_info "🌐 Access URL: https://$DOMAIN"
}

# 상태 확인 함수
check_status() {
    log_info "📊 System Status Check..."
    
    echo "=== Process Status ==="
    ps aux | grep -E "(python main.py|nginx)" | grep -v grep || echo "No processes running"
    
    echo -e "\n=== Port Usage ==="
    netstat -tlnp | grep -E ":80|:443|:8000" || echo "No related ports in use"
    
    echo -e "\n=== Backend Health ==="
    curl -s http://localhost:8000/api/health 2>/dev/null || echo "Backend not responding"
    
    echo -e "\n=== Recent Logs ==="
    echo "Backend logs (last 10 lines):"
    tail -n 10 "$BACKEND_DIR/backend.log" 2>/dev/null || echo "No backend logs"
    
    echo -e "\nNginx error logs (last 5 lines):"
    sudo tail -n 5 /var/log/nginx/error.log 2>/dev/null || echo "No nginx error logs"
}

# 로그 보기 함수
show_logs() {
    case "$2" in
        "backend")
            log_info "Showing backend logs..."
            tail -f "$BACKEND_DIR/backend.log"
            ;;
        "nginx")
            log_info "Showing nginx error logs..."
            sudo tail -f /var/log/nginx/error.log
            ;;
        *)
            log_info "Available logs: backend, nginx"
            echo "Usage: $0 logs [backend|nginx]"
            ;;
    esac
}

# 서비스 중지 함수
stop_services() {
    log_info "🛑 Stopping services..."
    
    if pkill -f "python main.py"; then
        log_success "Backend stopped"
    else
        log_warning "Backend was not running"
    fi
    
    log_info "Note: Nginx not stopped (may be used by other services)"
    log_info "To stop nginx: sudo systemctl stop nginx"
}

# 원라이너 재배포
quick_deploy() {
    log_info "⚡ Quick redeploy (reusing existing environment)..."
    
    # 백엔드 재시작
    cd "$BACKEND_DIR"
    pkill -f "python main.py" || true
    source venv/bin/activate
    nohup python main.py > backend.log 2>&1 &
    sleep 3
    
    # 프론트엔드 리빌드
    cd "$FRONTEND_DIR"
    npm run build
    sudo rm -rf "$WEB_ROOT"/*
    sudo cp -r build/* "$WEB_ROOT/"
    sudo chmod -R 755 "$WEB_ROOT"
    
    # Nginx 리로드
    sudo systemctl reload nginx
    
    verify_deployment
}

# 메인 실행 로직
case $DEPLOY_MODE in
    "full")
        deploy_backend
        deploy_frontend
        configure_nginx
        verify_deployment
        ;;
    "backend")
        deploy_backend
        verify_deployment
        ;;
    "frontend")
        deploy_frontend
        configure_nginx
        verify_deployment
        ;;
    "quick")
        quick_deploy
        ;;
    "status")
        check_status
        ;;
    "logs")
        show_logs "$@"
        ;;
    "stop")
        stop_services
        ;;
    *)
        echo "Work-Util Production Deployment Script"
        echo "======================================"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  full      - Full deployment (backend + frontend + nginx)"
        echo "  backend   - Deploy backend only"
        echo "  frontend  - Deploy frontend only"
        echo "  quick     - Quick redeploy (reuse existing environment)"
        echo "  status    - Check system status"
        echo "  logs      - Show logs (logs backend|nginx)"
        echo "  stop      - Stop services"
        echo ""
        echo "Examples:"
        echo "  $0 full           # Complete deployment"
        echo "  $0 quick          # Fast redeploy"
        echo "  $0 logs backend   # View backend logs"
        echo "  $0 status         # Check all services"
        echo ""
        echo "🌐 Production URL: https://$DOMAIN"
        exit 1
        ;;
esac

log_success "✅ Operation completed successfully!"