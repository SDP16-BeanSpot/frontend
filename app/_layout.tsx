import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { initializeKakaoSDK } from '@react-native-kakao/core';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ChatProvider } from '../features/chat/ChatContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// 카카오 인증 SDK 초기화. 이걸 빼먹으면 로그인이 sdkNotInitialized 로 실패합니다.
// (지도 SDK 는 별개라 app/(tabs)/map 에서 따로 초기화합니다.)
//
// effect 가 아니라 모듈 최상단에서 호출합니다. React 의 effect 는 자식이 먼저 실행돼서,
// 여기에 두지 않으면 온보딩 화면의 useKakaoAuth 가 초기화보다 먼저 SDK 를 건드립니다.
const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
if (kakaoNativeAppKey) {
  initializeKakaoSDK(kakaoNativeAppKey).catch((error: unknown) => {
    console.error('카카오 SDK 초기화 실패:', error);
  });
} else {
  console.warn('EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY 가 없어 카카오 로그인을 쓸 수 없습니다.');
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide the splash screen since we are not waiting for fonts in this test
    SplashScreen.hideAsync();
  }, []);

  return <RootLayoutNav colorScheme={colorScheme} />;
}

function RootLayoutNav({ colorScheme }: { colorScheme: string | null | undefined }) {
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ChatProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="posting/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="search" options={{ headerShown: false }} />
            <Stack.Screen name="admin/announcementCreate" options={{ headerShown: false }} />
            <Stack.Screen name="admin/reports/index" options={{ headerShown: false }} />
            <Stack.Screen name="admin/reports/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GestureHandlerRootView>
      </ChatProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
