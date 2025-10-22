# Moodly

바쁜 일상 속에서 자신의 감정을 쉽게 기록하고 되돌아볼 수 있도록 돕는 모바일 감성 일기 애플리케이션입니다. React Native를 기반으로 iOS와 Android 환경을 모두 지원하며, 사용자의 기록을 안전하게 관리하고 시각적으로 풍부한 경험을 제공하는 것을 목표로 합니다.

## 기술 스택

  * **Core:** React Native, TypeScript
  * **State Management:** Redux Toolkit, React Query
  * **Backend & DB:** Supabase
  * **Navigation:** React Navigation
  * **Styling:** NativeWind, Tailwind CSS
  * **UI & Animation:** Reanimated, Moti, Gorhom BottomSheet
  * **Code Quality:** ESLint, Prettier, husky
  * **Deployment:** EAS Update
  * **CI/CD:** Github Action

## 주요 기능

  * **간편 로그인:** Google, Apple 소셜 로그인을 통해 복잡한 인증 과정 없이 서비스를 시작합니다.
  * **감정 기록:** 매일의 감정을 이모티콘과 간단한 텍스트로 손쉽게 기록하고 관리합니다.
  * **월별 통계:** 월별 감정 흐름을 한눈에 파악할 수 있는 캘린더 기능을 제공합니다.
  * **OTA 업데이트:** 앱 스토어 심사 없이 새로운 기능이나 수정 사항을 신속하게 사용자에게 배포합니다.

## 프로젝트 목표

React Native 환경에서 피처 슬라이스 디자인(Feature-Sliced Design) 패턴과 아토믹 디자인(Atomic Design) 원칙을 적용하여, 유지보수성과 확장성이 높은 모바일 애플리케이션을 구축합니다. Supabase를 BaaS로 활용하여 백엔드 개발 리소스를 최소화하고, NativeWind, Reanimated 등을 통해 네이티브 수준의 부드러운 UI/UX를 구현합니다.

## 설치 및 실행

```bash
# 1. 프로젝트 의존성 설치
pnpm install

# 2. Metro 번들러 실행
pnpm expo start

# 3. (별도 터미널) 애플리케이션 실행
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## 폴더 구조

프로젝트는 유지보수성과 확장성을 고려하여 피처 슬라이스 디자인(FSD) 패턴을 기반으로 설계되었습니다.

```plaintext
/src
├── app/         # App 진입점, 전역 설정, 라우팅, Provider
├── processes/   # 여러 페이지에 걸친 복합적인 사용자 시나리오 (e.g., 인증)
├── pages/       # 화면 단위 컴포넌트, 위젯과 피처를 조합
├── widgets/     # 여러 피처/엔티티를 조합한 독립적인 UI 블록
├── features/    # 비즈니스 로직을 담은 기능 단위 (e.g., 감정 기록)
├── entities/    # 핵심 비즈니스 모델 및 관련 UI (e.g., User, Diary)
└── shared/      # 공통 UI 컴포넌트, Hooks, API, 유틸리티 함수
```

## Our Team

| 역할 | 이름 | GitHub |
| :---: | :---: | :---: |
| **Full-Stack Developer** |정성규 | `https://github.com/sunggyu-jeong` |
| **UI/UX Designer** |사승연 | `https://github.com/saseungg` |
