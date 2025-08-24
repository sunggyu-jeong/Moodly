<div align="center">

<img width="144" height="144" alt="Image" src="https://github.com/user-attachments/assets/c80f8bfb-2fc6-4dab-a7b2-b2c44b86f87c" />

# Moodly

**하루의 감정을 기록하는 감성 일기 앱, Moodly**

<p>
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.79.1-61DAFB?logo=react&logoColor=black"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white"/>
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-BaaS-3ECF8E?logo=supabase&logoColor=white"/>
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green.svg"/>
  <img alt="Contributors" src="https://img.shields.io/badge/contributors-2-orange.svg"/>
</p>

</div>

---

## ✨ Introduction
**Moodly**는 바쁜 일상 속에서 자신의 감정을 쉽게 기록하고 되돌아볼 수 있도록 돕는 모바일 감성 일기 애플리케이션입니다. React Native를 기반으로 제작되어 iOS와 Android 환경을 모두 지원하며, 사용자의 소중한 기록을 안전하게 관리하고 시각적으로 풍부한 경험을 제공하는 것을 목표로 합니다.

## 🚀 Key Features
Moodly는 사용자의 감정 기록 여정을 돕기 위한 다양한 핵심 기능을 제공합니다.

| 기능 | 설명 |
|:---:|---|
| **간편 로그인** | Google, Apple 소셜 로그인을 통해 복잡한 과정 없이 서비스를 시작할 수 있습니다. |
| **감정 기록** | 매일의 감정을 이모티콘과 간단한 텍스트, 사진으로 손쉽게 기록하고 관리합니다. |
| **월별 통계** | 월별 감정 흐름을 한눈에 파악할 수 있는 캘린더와 통계 기능을 제공합니다. |
| **OTA 업데이트** | 앱 스토어 심사 없이 새로운 기능을 빠르게 사용자에게 배포하고 버그를 수정합니다. |

## 🛠️ Tech Stack
Moodly는 최신 기술 트렌드를 적극적으로 반영하여 안정적이고 확장성 있는 서비스를 구축했습니다.

| 구분 | 기술 | 설명 |
| --- | --- | --- |
| **Core** | `React Native`, `TypeScript` | 크로스플랫폼 개발 및 타입 안정성을 통한 코드 품질 확보 |
| **State Management** | `Redux Toolkit`, `React Query` | 전역 상태의 예측 가능한 관리 및 서버 상태 관리 효율화 |
| **Backend & DB** | `Supabase` | BaaS를 통한 빠른 백엔드 구축 |
| **Navigation**| `React Navigation` | Stack, Bottom Tab 등 네이티브 앱 수준의 화면 전환 구현 |
| **Styling** | `NativeWind`, `Tailwind CSS` | Utility-First CSS 프레임워크를 통한 일관성 있고 빠른 UI 개발 |
| **UI & Animation** | `Reanimated`, `Moti`, `Gorhom BottomSheet` | 부드러운 인터랙션과 동적인 UI/UX 경험 제공 |
| **Code Quality** | `ESLint`, `Prettier`, `husky` | 일관된 코드 스타일 유지 및 코드 품질 자동 검사 |
| **Deployment** | `Hot Updater` | 코드 푸시를 통한 신속한 OTA(Over-the-Air) 업데이트 |

## 🏛️ Architecture
Moodly는 유지보수성과 확장성을 높이기 위해 **피처 슬라이스 디자인(Feature-Sliced Design)** 패턴을 기반으로 설계되었습니다. 각 기능은 독립적인 모듈로 구성되어 코드의 응집도를 높이고, 공유 로직은 `shared` 레이어에서 관리하여 중복을 최소화합니다. UI 컴포넌트는 **아토믹 디자인(Atomic Design)** 원칙을 적용하여 재사용성을 극대화했습니다.

```
/src
├── app/             # App 진입점, 전역 설정, 라우팅, Provider 등
├── processes/       # 여러 페이지에 걸친 복합적인 사용자 시나리오 (e.g., 인증 플로우)
├── pages/           # 화면 단위 컴포넌트, 위젯과 피처를 조합
├── widgets/         # 여러 피처/엔티티를 조합한 독립적인 UI 블록 (e.g., 헤더, 피드 리스트)
├── features/        # 비즈니스 로직을 담은 기능 단위 (e.g., 감정 기록하기, 로그인)
├── entities/        # 핵심 비즈니스 모델 및 관련 UI (e.g., User, Diary)
└── shared/          # 공통 UI 컴포넌트, Hooks, API, 유틸리티 함수 등
```

## 🧑‍💻 Our Team

| 역할 | 이름 | GitHub |
| :---: | :---: | :---: |
| **Full-Stack Developer** |정성규 | `https://github.com/sunggyu-jeong` |
| **UI/UX Designer** |사승연 | `https://github.com/saseungg` |
