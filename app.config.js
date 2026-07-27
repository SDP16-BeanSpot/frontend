const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY || "";

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: "BeanSpot",
  slug: "BeanSpot",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "beanspot",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.hyeonggyu.BeanSpot",
    // App Store 심사 가이드라인 4.8: 카카오(서드파티 소셜 로그인)를 제공하므로
    // 동등한 대체 로그인(Sign in with Apple)을 함께 제공해야 합니다.
    usesAppleSignIn: true,
    infoPlist: {
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [`kakao${kakaoNativeAppKey}`],
        },
      ],
      LSApplicationQueriesSchemes: [
        "kakaokompassauth",
        "kakaolink",
        "kakaoplus",
      ],
      ITSAppUsesNonExemptEncryption: false,
      NSLocationWhenInUseUsageDescription:
        "사용자의 현재 위치를 지도에 표시하기 위해 위치 권한이 필요합니다.",
      NSCameraUsageDescription:
        "프로필 사진과 공고 포스터를 촬영하기 위해 카메라 권한이 필요합니다.",
      NSPhotoLibraryUsageDescription:
        "프로필 사진과 공고 포스터를 등록하기 위해 사진 접근 권한이 필요합니다.",
      // 백엔드가 HTTP(비암호화)라 개발 단계에서 임의 로드 허용.
      // 운영 배포 시 HTTPS 전환 후 이 설정을 제거하세요.
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.hyeonggyu.beanspot",
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION", "CAMERA"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-dev-client",
    "expo-secure-store",
    [
      "expo-build-properties",
      {
        android: {
          // 백엔드가 HTTP(비암호화)라 개발 단계에서 cleartext 허용.
          // 운영 배포 시 HTTPS 전환 후 false 로 바꾸세요.
          usesCleartextTraffic: true,
          extraMavenRepos: [
            "https://devrepo.kakao.com/nexus/content/groups/public/",
          ],
        },
      },
    ],
    "expo-font",
    "expo-apple-authentication",
    [
      "expo-image-picker",
      {
        photosPermission:
          "프로필 사진과 공고 포스터를 등록하기 위해 사진 접근 권한이 필요합니다.",
        cameraPermission:
          "프로필 사진과 공고 포스터를 촬영하기 위해 카메라 권한이 필요합니다.",
        // 사진만 사용하므로 동영상 녹음용 마이크 권한(RECORD_AUDIO)은 제외
        microphonePermission: false,
      },
    ],
    [
      "@react-native-kakao/core",
      {
        nativeAppKey: kakaoNativeAppKey,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "2c958556-7640-420c-a9b2-6b3f201d651a",
    },
  },
};

export default config;
