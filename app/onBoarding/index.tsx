import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { router, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import useKakaoAuth from '../../hooks/useKakaoAuth';
import useAppleAuth from '../../hooks/useAppleAuth';

// Figma "로그인_방식선택" (node 1400:17424) 기준 360pt 프레임에서:
// 컨텐츠 컬럼 320pt(좌우 각 20pt 여백), 로고 박스 200pt.
// 화면 크기에 비례시키되, 태블릿 등 큰 화면에서 과도하게 안 커지도록 상한을 둠.
const FIGMA_FRAME_WIDTH = 360;
const CONTENT_MAX_WIDTH = 400;

export default function AuthPage() {
  const { width: screenWidth } = useWindowDimensions();
  const horizontalPadding = Math.max(20, screenWidth * (20 / FIGMA_FRAME_WIDTH));
  const logoSize = Math.min(screenWidth * (200 / FIGMA_FRAME_WIDTH), 220);

  const { user, loading, error, kakaologin } = useKakaoAuth();
  const {
    isAvailable: isAppleAvailable,
    error: appleError,
    loading: appleLoading,
    appleLogin,
    checkAvailability,
  } = useAppleAuth();

  // Apple 로그인은 iOS 이면서 기기가 지원할 때만 노출
  useEffect(() => {
    checkAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로그인 성공 시 홈으로 이동
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/home');
    }
  }, [user]);

  // 에러 알림
  useEffect(() => {
    if (error) {
      Alert.alert('로그인 실패', error);
    }
  }, [error]);

  useEffect(() => {
    if (appleError) {
      Alert.alert('로그인 실패', appleError);
    }
  }, [appleError]);

  const handleAppleLogin = async () => {
    const ok = await appleLogin();
    if (ok) router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerWrapper}>
        <View
          style={[
            styles.contentColumn,
            { maxWidth: CONTENT_MAX_WIDTH, paddingHorizontal: horizontalPadding },
          ]}
        >
          {/* Bean 캐릭터 섹션 */}
          <View style={styles.logoSection}>
            <Image
              source={require('../../assets/images/onboardingLogo.png')}
              style={{ width: logoSize, height: logoSize }}
              contentFit="contain"
            />
            <Text style={styles.description}>환경활동 찾기 플랫폼 빈스팟</Text>
          </View>

          {/* 로그인 버튼 섹션 */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[styles.button, styles.kakaoButton, loading && styles.buttonDisabled]}
              onPress={kakaologin}
              disabled={loading}
            >
              <Image
                source={require('../../assets/images/kakaoIcon.png')}
                style={styles.icon}
                contentFit="contain"
              />
              <Text style={styles.buttonText}>
                {loading ? '로그인 중...' : '카카오로 시작하기'}
              </Text>
            </TouchableOpacity>

            {/* App Store 가이드라인 4.8: 카카오 로그인 제공 시 동등한 대체 로그인 필수.
                Apple 디자인 규정을 지키기 위해 공식 버튼 컴포넌트를 사용합니다.
                버튼 문구("Sign in with Apple")는 Apple 이 기기 시스템 언어에 맞춰
                자동으로 현지화합니다 — 커스텀 텍스트 지정은 Apple 정책상 지원하지
                않으며, 임의로 바꾸면 심사에서 반려될 수 있습니다. 기기 언어가
                한국어면 "Apple로 로그인"으로 자동 표시됩니다. */}
            {isAppleAvailable && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={16}
                style={styles.appleButton}
                onPress={appleLoading ? undefined : handleAppleLogin}
              />
            )}

            <TouchableOpacity
              style={[styles.button, styles.beanspotButton]}
              onPress={() => router.push('/onBoarding/login' as Href)}
            >
              <Image
                source={require('../../assets/images/beanspotLogin.svg')}
                style={styles.icon}
                contentFit="contain"
              />
              <Text style={styles.buttonText}>빈스팟 아이디로 시작하기</Text>
            </TouchableOpacity>
          </View>

          {/* 하단 링크 */}
          <View style={styles.bottomLinks}>
            <TouchableOpacity onPress={() => router.push('/onBoarding/register' as Href)}>
              <Text style={styles.linkText}>
                계정이 없으신가요? <Text style={styles.linkTextBold}>회원가입하기</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentColumn: {
    width: '100%',
    alignItems: 'center',
    gap: 60,
  },
  logoSection: {
    alignItems: 'center',
    gap: 12,
  },
  description: {
    fontSize: 14,
    color: '#4B4B4B',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: -0.35,
  },
  buttonSection: {
    width: '100%',
    gap: 8,
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  beanspotButton: {
    backgroundColor: '#F7F7F8',
  },
  appleButton: {
    width: '100%',
    height: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F1F1F',
    letterSpacing: -0.4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  bottomLinks: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 12,
    color: '#7B7B7B',
    letterSpacing: -0.3,
  },
  linkTextBold: {
    fontWeight: '500',
    color: '#22A900',
    textDecorationLine: 'underline',
  },
});
