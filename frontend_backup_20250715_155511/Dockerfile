# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 환경변수 설정
ENV REACT_APP_API_URL=http://localhost/api

# 개발 서버 실행
EXPOSE 3000
CMD ["npm", "start"]