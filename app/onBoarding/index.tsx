import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { router, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import useKakaoAuth from '../../hooks/useKakaoAuth';

export default function AuthPage() {
  const { user, loading, error, kakaologin } = useKakaoAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Bean 캐릭터 섹션 */}
        <View style={styles.logoSection}>
          {/* 임시 Bean 캐릭터 */}
          <View style={styles.beanCharacter}>
            <View style={styles.beanBody} />
            <View style={styles.beanFace}>
              <View style={styles.eye} />
              <View style={styles.eye} />
              <View style={styles.mouth} />
            </View>
            <View style={styles.beanLeaf} />
          </View>
          
          <Text style={styles.beanTitle}>Bean</Text>
        </View>

        {/* 설명 텍스트 */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            도심에서 도시민을 연결하는
          </Text>
          <Text style={styles.description}>
            도시텃밭 중개 플랫폼
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
                source={require('../../assets/images/beanspotLogo.svg')} // 이미지 경로
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
  beanCharacter: {
    position: 'relative',
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  beanBody: {
    width: 80,
    height: 100,
    backgroundColor: '#8B4513',
    borderRadius: 40,
    position: 'absolute',
    left: 20,
    top: 10,
  },
  beanFace: {
    width: 60,
    height: 60,
    backgroundColor: '#D2691E',
    borderRadius: 30,
    position: 'absolute',
    left: 30,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eye: {
    width: 8,
    height: 8,
    backgroundColor: '#000000',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  mouth: {
    width: 20,
    height: 10,
    backgroundColor: '#000000',
    borderRadius: 10,
    marginTop: 5,
  },
  beanLeaf: {
    width: 30,
    height: 15,
    backgroundColor: '#228B22',
    borderRadius: 8,
    position: 'absolute',
    right: 10,
    top: 5,
    transform: [{ rotate: '45deg' }],
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 0.1,
    shadowRadius: 4,
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
    backgroundColor: '#2AD300',
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
