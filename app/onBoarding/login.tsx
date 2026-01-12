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

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 모든 필드가 입력되었는지 확인
  const isFormValid = useMemo(() => {
    return phoneNumber.trim().length > 0 && password.trim().length > 0;
  }, [phoneNumber, password]);

  // 비밀번호 표시/숨기기 토글
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // 로그인 처리
  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('알림', '휴대폰 번호와 비밀번호를 입력해주세요.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('알림', '비밀번호는 8자리 이상 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('로그인 시도:', { phoneNumber, password });
      
      // 실제 로그인 API 호출 (시뮬레이션)
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('성공', '로그인되었습니다!', [
          { text: '확인', onPress: () => router.replace('../(tabs)/home') }
        ]);
      }, 2000);
      
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      Alert.alert('오류', '로그인에 실패했습니다.');
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
          {/* 휴대폰 번호 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>휴대폰 번호</Text>
            <TextInput
              style={styles.input}
              placeholder="휴대폰 번호 (-없이 숫자만 입력)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={11}
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
              <Ionicons name="eye" size={24} color="black" />
              <Ionicons name="eye-off" size={24} color="black" />
                <Text style={styles.eyeIcon}>
                  {isPasswordVisible ? 'eye' : 'eye-off'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 비밀번호 안내 메시지 */}
          <View style={styles.passwordHintContainer}>
            <Text style={styles.passwordHint}>
              비밀번호를 5자리이상은{' '}
              <Text style={styles.passwordHintBold}>8자리 이상</Text>
            </Text>
          </View>
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
  eyeIcon: {
    fontSize: 20,
    color: '#666666',
  },

  // 비밀번호 안내
  passwordHintContainer: {
    marginTop: 8,
  },
  passwordHint: {
    fontSize: 14,
    color: '#666666',
  },
  passwordHintBold: {
    fontWeight: '600',
    color: '#00D664',
  },

  // 하단 버튼
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 16,
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
