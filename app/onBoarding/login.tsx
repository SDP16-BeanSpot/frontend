// app/auth/login.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getProfile, login } from '../../features/auth/api';
import { ApiError, setAutoLoginEnabled } from '../../features/shared/apiClient';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoLogin, setAutoLogin] = useState(true);

  // 모든 필드가 입력되었는지 확인
  const isFormValid = useMemo(() => {
    return userId.trim().length > 0 && password.trim().length > 0;
  }, [userId, password]);

  // 비밀번호 표시/숨기기 토글
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // 로그인 처리
  const handleLogin = async () => {
    if (!userId || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ userId: userId.trim(), password });
      // 로그인 응답에 role 이 없을 수 있어 프로필 조회로 역할(관리자 여부)을 확보
      await getProfile().catch(() => {});
      await setAutoLoginEnabled(autoLogin);
      router.replace('/(tabs)/home');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : '로그인에 실패했습니다.';
      Alert.alert('오류', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* 타이틀 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>로그인</Text>
        </View>

        {/* 입력 폼 */}
        <View style={styles.form}>
          {/* 아이디 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              style={styles.input}
              placeholder="아이디를 입력하세요"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* 비밀번호 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye' : 'eye-off'}
                  size={24}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.autoLoginRow}
            onPress={() => setAutoLogin(!autoLogin)}
            hitSlop={8}
          >
            <Ionicons
              name={autoLogin ? 'checkbox' : 'square-outline'}
              size={20}
              color={autoLogin ? '#00D664' : '#CCCCCC'}
            />
            <Text style={styles.autoLoginText}>자동 로그인</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 고정 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            isFormValid ? styles.nextButtonActive : styles.nextButtonInactive
          ]}
          onPress={handleLogin}
          disabled={!isFormValid || isLoading}
        >
          <Text style={[
            styles.nextButtonText,
            isFormValid ? styles.nextButtonTextActive : styles.nextButtonTextInactive
          ]}>
            {isLoading ? '로그인 중...' : '다음'}
          </Text>
        </TouchableOpacity>

        <View style={styles.linkRow}>
          <TouchableOpacity onPress={() => router.push('/onBoarding/findId' as any)}>
            <Text style={styles.linkText}>아이디 찾기</Text>
          </TouchableOpacity>
          <Text style={styles.linkDivider}>|</Text>
          <TouchableOpacity onPress={() => router.push('/onBoarding/findPassword' as any)}>
            <Text style={styles.linkText}>비밀번호 찾기</Text>
          </TouchableOpacity>
          <Text style={styles.linkDivider}>|</Text>
          <TouchableOpacity onPress={() => router.push('/onBoarding/register')}>
            <Text style={styles.linkText}>회원가입</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  
  // 헤더
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
  },

  // 타이틀
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },

  // 폼
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  
  // 비밀번호 입력
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50, // 눈 아이콘 공간
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },

  // 자동 로그인
  autoLoginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  autoLoginText: {
    fontSize: 14,
    color: '#666666',
  },

  // 하단 버튼
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 16,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  linkText: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '500',
  },
  linkDivider: {
    fontSize: 12,
    color: '#E0E0E0',
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonActive: {
    backgroundColor: '#00D664',
  },
  nextButtonInactive: {
    backgroundColor: '#E0E0E0',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextActive: {
    color: '#FFFFFF',
  },
  nextButtonTextInactive: {
    color: '#999999',
  },
});
