# LoopIn Client

Tauri + React + TypeScript + Tailwind CSS 기반의 데스크톱 애플리케이션

## 🏛️ 아키텍처 구조

### 1. 디렉토리 구조
```
src/
├── components/            # 재사용 가능한 컴포넌트
│   ├── common/           # 공통 컴포넌트 (Button, Card 등)
│   └── layout/           # 레이아웃 컴포넌트 (Header, Layout 등)
├── pages/                # 페이지 컴포넌트
│   └── dashboard/        # 대시보드 페이지
├── store/                # Redux 상태 관리
│   └── slices/           # Redux Toolkit slices
├── lib/                  # 유틸리티 및 설정
├── types/                # TypeScript 타입 정의
└── router/               # 라우터 설정
```

### 2. 핵심 아키텍처 패턴

#### A. Layered Architecture
```
┌─────────────────┐
│   Components    │ ← UI Layer (Tailwind CSS)
├─────────────────┤
│     Store       │ ← State Management Layer (Redux)
├─────────────────┤
│   API Layer     │ ← Data Access Layer
├─────────────────┤
│   Backend API   │ ← External Services
└─────────────────┘
```

#### B. Component Architecture
- **Atomic Design 패턴 적용**
- 재사용 가능한 컴포넌트들을 `components/common/`에 배치
- 도메인별 컴포넌트들을 `components/layout/` 등에 배치
- **Tailwind CSS**를 사용한 유틸리티 퍼스트 스타일링

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Desktop**: Tauri 2.0
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## 🚀 Setup and Development

### 1. Prerequisites
- Node.js (v18 or higher)
- Rust (for Tauri development)
- Keycloak server (for authentication)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
- Copy `.env_example` to `.env`
- Configure Keycloak settings in `.env`

### 4. Development
```bash
npm run dev
```

### 5. Build
```bash
npm run build
```

## 📁 주요 파일 설명

### Components
- `components/common/Button.tsx` - 재사용 가능한 버튼 컴포넌트
- `components/common/Card.tsx` - 카드 레이아웃 컴포넌트
- `components/layout/Header.tsx` - 헤더 컴포넌트
- `components/layout/Layout.tsx` - 메인 레이아웃 컴포넌트

### Pages
- `pages/dashboard/DashboardPage.tsx` - 대시보드 페이지

### State Management
- `store/index.ts` - Redux store 설정
- `store/slices/authSlice.ts` - 인증 관련 상태 관리

### API Layer
- `lib/api.ts` - 백엔드 API 통신 클라이언트

### Types
- `types/index.ts` - TypeScript 타입 정의

### Router
- `router/index.tsx` - 라우터 설정

## 🎨 Styling Guidelines

- **Tailwind CSS**를 사용한 유틸리티 퍼스트 방식
- 컴포넌트별로 className을 통해 스타일 적용
- 반응형 디자인을 위한 Tailwind 브레이크포인트 활용
- 일관된 색상 팔레트와 타이포그래피 사용

## 🔧 개발 가이드라인

1. **컴포넌트 작성**: 재사용 가능한 컴포넌트는 `components/common/`에 배치
2. **페이지 작성**: 새로운 페이지는 `pages/` 디렉토리에 배치
3. **상태 관리**: Redux Toolkit을 사용하여 전역 상태 관리
4. **스타일링**: Tailwind CSS 클래스를 사용하여 스타일 적용
5. **타입 정의**: TypeScript 타입은 `types/` 디렉토리에 정의

## 📝 Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) 확장 프로그램
