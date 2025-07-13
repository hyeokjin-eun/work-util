#!/bin/bash

# Work-Util 배포 스크립트

echo "🚀 Work-Util 애플리케이션 배포를 시작합니다..."

# 개발 환경 실행
dev() {
    echo "📦 개발 환경으로 실행합니다..."
    docker-compose up --build
}

# 프로덕션 환경 실행
prod() {
    echo "🏭 프로덕션 환경으로 실행합니다..."
    docker-compose -f docker-compose.prod.yml up --build -d
}

# 서비스 중지
stop() {
    echo "🛑 서비스를 중지합니다..."
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
}

# 전체 정리 (컨테이너, 이미지, 볼륨 삭제)
clean() {
    echo "🧹 전체 정리를 시작합니다..."
    docker-compose down -v --rmi all
    docker-compose -f docker-compose.prod.yml down -v --rmi all
    docker system prune -f
}

# 백엔드만 다시 빌드
backend() {
    echo "🔧 백엔드만 다시 빌드합니다..."
    docker-compose up --build backend
}

# 프론트엔드만 다시 빌드
frontend() {
    echo "🎨 프론트엔드만 다시 빌드합니다..."
    docker-compose up --build frontend
}

# 로그 확인
logs() {
    echo "📋 로그를 확인합니다..."
    docker-compose logs -f
}

# 상태 확인
status() {
    echo "📊 서비스 상태를 확인합니다..."
    docker-compose ps
}

case "$1" in
    dev)
        dev
        ;;
    prod)
        prod
        ;;
    stop)
        stop
        ;;
    clean)
        clean
        ;;
    backend)
        backend
        ;;
    frontend)
        frontend
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    *)
        echo "사용법: $0 {dev|prod|stop|clean|backend|frontend|logs|status}"
        echo ""
        echo "명령어:"
        echo "  dev      - 개발 환경으로 실행"
        echo "  prod     - 프로덕션 환경으로 실행"
        echo "  stop     - 서비스 중지"
        echo "  clean    - 전체 정리 (컨테이너, 이미지, 볼륨 삭제)"
        echo "  backend  - 백엔드만 다시 빌드"
        echo "  frontend - 프론트엔드만 다시 빌드"
        echo "  logs     - 로그 확인"
        echo "  status   - 서비스 상태 확인"
        exit 1
        ;;
esac