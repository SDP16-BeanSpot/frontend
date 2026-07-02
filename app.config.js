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
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
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
