# Work-Util

업무 효율성을 높이는 통합 유틸리티 도구 모음입니다.

## 📋 프로젝트 설명

이 프로젝트는 다양한 업무 자동화 및 유틸리티 기능을 제공하는 React 기반의 웹 애플리케이션입니다. 
업무 관리부터 데이터 처리까지 일상적인 업무에 필요한 도구들을 하나의 플랫폼에서 제공합니다.

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

- **Frontend**: React 18, TypeScript
- **Styling**: CSS3 (모듈화)
- **Routing**: React Router DOM
- **Build Tool**: Create React App
- **Libraries**: 
  - QRCode.js (QR 코드 생성)
  - date-fns (날짜 처리)
  - uuid (고유 ID 생성)

## 📦 설치 및 실행

### 필요 사항
- Node.js 16.x 이상
- npm 또는 yarn

### 설치
```bash
git clone https://github.com/hyeokjin-eun/work-util.git
cd work-util
npm install
```

### 개발 서버 실행
```bash
npm start
```
브라우저에서 `http://localhost:3000`으로 접속하세요.

### 빌드
```bash
npm run build
```

### 타입 체크
```bash
npm run typecheck
```

## 🎯 업무 효율성 원칙

이 도구는 다음 업무 효율성 원칙을 기반으로 설계되었습니다:

- **업무 구조화**: 큰 프로젝트를 작은 단위로 분해하고 유형별 분류
- **시각화**: 칸반 보드와 진행률을 통한 직관적인 현황 파악
- **우선순위 관리**: ABC 분석법을 통한 효과적인 시간 배분
- **추적 시스템**: 마일스톤과 KPI를 통한 성과 측정
- **유연성**: 버퍼 시간과 백업 계획을 통한 리스크 관리

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── TodoList.tsx    # 할일 관리
│   ├── MeetingNotes.tsx # 회의록
│   ├── JsonFormatter.tsx # JSON 포맷터
│   ├── JsonCompare.tsx  # JSON 비교기
│   ├── QrGenerator.tsx  # QR 생성기
│   └── WbsManager.tsx   # WBS 관리
├── styles/             # 스타일 파일
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수
```

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