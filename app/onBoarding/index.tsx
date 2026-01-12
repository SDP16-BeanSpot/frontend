import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { router, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useKakaoAuth from '../../hooks/useKakaoAuth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const wrapperWidth = SCREEN_WIDTH * 0.6; // wrapper 너비를 화면 너비의 60%로 설정

export default function AuthPage() {
  const { user, loading, error, kakaologin } = useKakaoAuth();
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
            style={styles.kakaoButton}
            onPress={kakaologin} // 인증 함수 연결! (hooks에서 받아오기)
          >
            <View style={styles.kakaoContent}>
              <Image
                source={require('../../assets/images/chat.png')}
                style={styles.icon}
              />
              <Text style={styles.kakaoButtonText}>
                카카오로 시작하기
              </Text>
            </View>
          </TouchableOpacity>

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
