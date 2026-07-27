import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { router, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import useKakaoAuth from '../../hooks/useKakaoAuth';
import useAppleAuth from '../../hooks/useAppleAuth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const wrapperWidth = SCREEN_WIDTH * 0.6;

export default function AuthPage() {
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
        {/* Bean 캐릭터 섹션 */}
        <View style={styles.logoSection}>
          <View style={[styles.imageWrapper, { width: wrapperWidth, height: wrapperWidth * 0.68 }]}>
            {/* 1. 로고 이미지 (배경 레이어) */}
            <Image 
              source={require('../../assets/images/beanspotLogo.svg')} 
              style={[styles.logoImage, { width: wrapperWidth * 0.82, height: wrapperWidth * 0.36 }]}
              contentFit="contain"
            />

            {/* 2. 캐릭터 이미지 (위쪽 레이어: absolute로 띄움) */}
            <Image 
              source={require('../../assets/images/paniOnBoarding.svg')} 
              style={[styles.characterImage, { width: wrapperWidth * 0.5, height: wrapperWidth * 0.5 }]}
              contentFit="contain"
            />
          </View>
          <Text style={styles.beanTitle}>Bean</Text>
        </View>

        {/* 설명 텍스트 */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            환경활동 찾기 플랫폼 빈스팟
          </Text>
        </View>

        {/*카카오 버튼 섹션 */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.kakaoButton, loading && styles.kakaoButtonDisabled]}
            onPress={kakaologin}
            disabled={loading}
          >
            <View style={styles.kakaoContent}>
              <Image
                source={require('../../assets/images/kakaoIcon.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.kakaoButtonText}>
                {loading ? '로그인 중...' : '카카오로 시작하기'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* App Store 가이드라인 4.8: 카카오 로그인 제공 시 동등한 대체 로그인 필수.
              Apple 디자인 규정을 지키기 위해 공식 버튼 컴포넌트를 사용합니다. */}
          {isAppleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={12}
              style={styles.appleButton}
              onPress={appleLoading ? undefined : handleAppleLogin}
            />
          )}

          <TouchableOpacity
            style={styles.beanspotButton}
            onPress={() => router.push('/onBoarding/login' as Href)}
          >
            <View style={styles.kakaoContent}>
              <Image
                source={require('../../assets/images/beanspotLogin.svg')} // 이미지 경로
                style={styles.icon}
              />
            <Text style={styles.beanspotButtonText}>
              빈스팟 아이디로 시작하기
            </Text>
          </View>
        </TouchableOpacity>
      </View>

        {/* 하단 링크 */}
        <View style={styles.bottomLinks}>
          <TouchableOpacity onPress={() => router.push('/onBoarding/register' as Href)}>
            <Text style={styles.linkText}>
              아직 계정이 없으신가요? <Text style={styles.linkTextBold}>회원가입</Text>
            </Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

// 스타일은 동일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageWrapper: {
    justifyContent: 'flex-end', // 로고를 아래쪽에 배치
    alignItems: 'center',
    position: 'relative', // 자식 absolute의 기준점
  },
  logoImage: {
    marginBottom: 10,
  },
  characterImage: {
    position: 'absolute',
    top: 0,
    right: 15,
    zIndex: 1,
  },
  beanTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
    letterSpacing: 1,
  },
  descriptionSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonSection: {
    marginBottom: 40,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  kakaoButtonDisabled: {
    opacity: 0.6,
  },
  appleButton: {
    width: '100%',
    height: 54,
    marginBottom: 12,
  },
  kakaoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  kakaoContent:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  beanspotButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  beanspotButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  bottomLinks: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#999999',
  },
  linkTextBold: {
    fontWeight: '600',
    color: '#2AD300',
  },
  icon:{
    width: 20,
    height: 20,
    marginRight: 8,
  }
});
