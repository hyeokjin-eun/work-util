# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2025-01-19

### 🎯 홈 화면 커스터마이징 시스템 완성

#### Added
- **홈 화면 레이아웃 설정**: 사용자별 홈 화면 섹션 구성 및 순서 관리
- **빠른 실행 메뉴 이동**: 홈 화면에서 마이페이지 "홈 화면 사용자 지정"으로 이동
- **HomeScreenCustomization 페이지**: 완전한 홈 화면 커스터마이징 인터페이스
- **useHomeScreenLayout 훅**: 홈 화면 레이아웃 상태 관리
- **user_preferences 테이블**: 사용자별 설정 저장을 위한 새 데이터베이스 테이블
- **홈 화면 레이아웃 API**: `/api/user/home-screen-layout` 엔드포인트 추가

#### Fixed
- **422 에러 해결**: API 호출 시 Content-Type 헤더 누락 문제 수정
- **WBS API 500 에러**: 데이터베이스 스키마와 코드 모델 불일치 해결
  - `duration`/`level`/`order_index` → `estimated_hours`/`actual_hours` 필드 변경
- **API 헤더 처리**: `api.ts`에서 undefined 헤더 처리 개선
- **모바일 반응형**: 할일 관리 페이지 모바일 UI 최적화

#### Changed
- **테마 설정 제거**: 색상 커스터마이징, 전역 설정 기능 완전 제거
- **API 모달 제거**: 성공/에러 알림 모달 삭제하여 UI 간소화
- **데이터 로딩 최적화**: 사용자 설정 기반 조건부 데이터 로딩
- **CustomSelect 통합**: 홈 화면 커스터마이징에 일관된 UI 컴포넌트 적용
- **TodoList UI 표준화**: 모든 화면 크기에서 동일한 UI 구성
- **액션 카드 스타일링**: 파란 테두리 제거로 깔끔한 디자인
- **백그라운드 애니메이션**: header와 welcome-banner 크기 통일

#### Documentation
- **통합 데이터베이스 스키마**: 6개 테이블 전체 구조 문서화
- **테이블 관계 정리**: Foreign Key 관계 및 인덱스 정보 추가
- **API 엔드포인트 업데이트**: 새로운 홈 화면 레이아웃 API 문서화
- **최근 작업 내역**: v1.2.2 완료 작업 상세 기록

### 🛠️ 기술적 개선사항

#### Database
- **user_preferences 테이블 추가**: 사용자별 설정 저장
- **wbs_tasks 스키마 수정**: 필드명 정규화 및 데이터 타입 최적화
- **인덱스 최적화**: 성능 향상을 위한 인덱스 추가

#### Frontend
- **컴포넌트 재사용성 향상**: CustomSelect 전역 적용
- **CSS 반응형 개선**: 모바일 우선 설계 적용
- **상태 관리 최적화**: 홈 화면 레이아웃 전용 훅 분리

#### Backend
- **API 응답 정규화**: 일관된 응답 형식 적용
- **에러 처리 개선**: 명확한 에러 메시지 및 상태 코드

## [1.2.1] - 2025-01-18

### Added
- **데스크톱 레이아웃 시스템**: 화면 크기별 적응형 인터페이스
- **SmartWork 배포 패키지**: macOS DMG 배포판 생성
- **빠른 실행 메뉴 사용자 지정**: 드래그 앤 드롭, 체크박스 토글 기능
- **QuickActionCustomizer 컴포넌트**: 완전한 사용자 지정 모달
- **useQuickActions 훅**: 빠른 실행 메뉴 상태 관리
- **아이콘 유틸리티 시스템**: SVG 아이콘 중앙 관리

### Changed
- **Functions.tsx**: 모든 유틸리티 기능 중앙 집중 관리
- **ServiceIntroPage.tsx**: 브랜딩 및 기능 소개 강화
- **TaskItem.tsx, Widget.tsx**: 재사용 가능한 UI 컴포넌트
- **Calendar.css**: 전용 스타일 파일로 분리

## [1.2.0] - 2025-01-17

### Added
- **완전한 통합 업무 관리 시스템**: 실시간 데이터 연결
- **통합 대시보드**: 할일, 회의록, WBS 통계 실시간 표시
- **캘린더 시스템**: 월별 뷰, 통합 이벤트 표시
- **마이페이지 고도화**: 사용자 통계, 생산성 점수, 비밀번호 변경
- **WBS 계층 구조**: 최대 5레벨 작업 계층 지원

### Fixed
- **JWT 토큰 자동 갱신**: 만료 시 자동 리프레시
- **비밀번호 변경 기능**: 모달 UI 및 보안 검증
- **사용자별 데이터 분리**: 토큰 기반 데이터 필터링

## [1.1.2] - 2025-01-16

### Added
- **할일 관리 시스템**: SQLite 데이터베이스 완전 통합
- **JWT 인증 시스템**: AuthContext와 백엔드 API 연동
- **맞춤형 UI 컴포넌트**: 우선순위 선택, 달력, 상태 관리

### Fixed
- **날짜 필드 매핑**: API 응답 데이터 형식 통일
- **카테고리/태그 UI**: 색상 코딩 및 시각적 표현 개선
- **DatePicker 동적 위치**: 화면 공간에 따른 자동 조정

## [1.1.1] - 2025-01-16

### Added
- **JSON 비교기**: 실시간 JSON 데이터 비교 및 차이점 시각화
- **QR 생성기**: 다양한 템플릿과 설정을 통한 QR 코드 생성
- **TypeScript 타입 안전성**: 모든 기능에 대한 타입 정의 강화

### Changed
- **모바일 최적화**: 반응형 디자인 개선
- **자동 배포 시스템**: 프로덕션 배포 스크립트 안정화

## [1.0.0] - 2024-07-14

### Added
- **6개 핵심 유틸리티**: 할일 관리, 회의록, JSON 도구, QR 생성, WBS 관리
- **JWT 인증 시스템**: 안전한 사용자 관리
- **모바일 최적화**: 반응형 디자인 완성
- **자동 배포 시스템**: 프로덕션 배포 스크립트
- **HTTPS 배포**: next-exit.me 도메인 운영

### Technical Stack
- **Frontend**: React + TypeScript
- **Backend**: Python FastAPI
- **Database**: SQLite
- **Deployment**: Nginx + Let's Encrypt SSL

---

## Legend

- 🎯 **Major Feature**: 주요 기능 추가
- 🛠️ **Technical**: 기술적 개선
- 🐛 **Bug Fix**: 버그 수정
- 📚 **Documentation**: 문서화
- 🔒 **Security**: 보안 개선
- ⚡ **Performance**: 성능 개선
- 🎨 **UI/UX**: 사용자 경험 개선