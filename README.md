📚 SDP BeanSpot Frontend
빈스팟(Beanspot)은 분산된 환경 관련 공고들을 한 곳에 모아 제공하는 공고 큐레이션 플랫폼입니다. 사용자가 직관적으로 환경 공고를 탐색하고, 지도 및 캘린더 기능을 통해 편리하게 일정을 관리할 수 있는 클라이언트 환경을 제공합니다.

👨‍💻 Developers
심형규

💻 기술 스택
Framework: React Native (CLI)

Language: TypeScript

State management: Zustand, TanStack Query

Network: Axios

Styling: StyleSheet, Styled-components

🚀 Getting Started (Local Development)
React Native CLI 환경에서 iOS 및 Android 네이티브 앱을 빌드하고 실행하기 위한 환경을 구성합니다.

1. 개발 환경 세팅
운영체제에 맞게 Node.js, Watchman, JDK, Android Studio(안드로이드), Xcode(iOS, Mac 전용)를 설치해야 합니다.
자세한 설정은 React Native 환경 설정 공식 문서의 React Native CLI Quickstart 탭을 참고해 주세요.

2. 환경 변수 설정
프로젝트 실행을 위해 루트 디렉토리에 .env 파일을 생성하고 필요한 설정값을 입력합니다. (react-native-config 등 사용 기준)

text
# API Server
API_BASE_URL=http://localhost:8080/api

# Map & Third-party APIs
MAP_API_KEY=your_api_key_here
3. 패키지 설치 및 실행
터미널을 열고 아래 명령어를 순서대로 입력하여 패키지 설치 후 앱을 구동합니다.

bash
# 1. 의존성 패키지 설치
npm install

# 2. iOS 네이티브 의존성 설치 (Mac 환경 전용)
cd ios && pod install && cd ..

# 3. Metro Bundler 실행 (새 터미널 창)
npm start

# 4. 앱 빌드 및 실행 (기기 또는 에뮬레이터/시뮬레이터)
npm run android   # 안드로이드 실행
npm run ios       # iOS 실행
📂 프로젝트 구조
text
├── android/                     # Android 네이티브 빌드 파일 및 설정
├── ios/                         # iOS 네이티브 빌드 파일 및 설정
├── src/
│   ├── assets/                  # 이미지, 폰트 등 정적 리소스
│   ├── components/              # 재사용 가능한 공통 UI 컴포넌트
│   ├── constants/               # 앱 내 공통 상수 및 테마 설정
│   ├── hooks/                   # 커스텀 훅 (비즈니스 로직 분리)
│   ├── navigation/              # 화면 라우팅 및 네비게이션 설정
│   ├── screens/                 # 화면 단위 컴포넌트 (지도, 캘린더 등)
│   ├── services/                # API 통신 및 네트워크 로직
│   ├── store/                   # 전역 상태 관리 (Zustand 등)
│   └── types/                   # TypeScript 타입 및 인터페이스 정의
├── .env                         # 프론트엔드 환경 변수 파일
├── index.js                     # 앱 엔트리 포인트 (네이티브 연동)
├── App.tsx                      # 최상위 리액트 네이티브 컴포넌트
├── package.json                 # 의존성 패키지 및 스크립트 설정
└── tsconfig.json                # TypeScript 컴파일러 설정
