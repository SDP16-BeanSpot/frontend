import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import PhoneSmsField, { isPhoneSmsVerified } from '../../../components/features/onboarding/PhoneSmsField';
import { findPasswordAccount } from '../../../features/findAccount/mock';

export default function FindPasswordPage() {
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = useMemo(
    () => userId.trim().length > 0 && isPhoneSmsVerified(code),
    [userId, code],
  );

  const handleNext = () => {
    if (!isFormValid) {
      Alert.alert('알림', '아이디와 인증번호를 확인해주세요.');
      return;
    }
    setIsLoading(true);
    // ⚠️ SMS 인증/비밀번호 조회 엔드포인트가 없어 시뮬레이션으로 대체합니다.
    setTimeout(() => {
      setIsLoading(false);
      const account = findPasswordAccount(userId.trim(), phone);
      if (!account) {
        Alert.alert('알림', '일치하는 계정을 찾을 수 없어요.');
        return;
      }
      router.replace({
        pathname: '/onBoarding/findPassword/result',
        params: { userId: account.userId, maskedPassword: account.maskedPassword },
      });
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>비밀번호 찾기를 위해{'\n'}본인인증이 필요해요</Text>
        </View>

        <View style={styles.form}>
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

          <PhoneSmsField phone={phone} onPhoneChange={setPhone} code={code} onCodeChange={setCode} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, isFormValid ? styles.nextButtonActive : styles.nextButtonInactive]}
          onPress={handleNext}
          disabled={!isFormValid || isLoading}
        >
          <Text style={[styles.nextButtonText, isFormValid ? styles.nextButtonTextActive : styles.nextButtonTextInactive]}>
            {isLoading ? '확인 중...' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 24 },
  header: { paddingTop: 20, paddingBottom: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backButtonText: { fontSize: 24, color: '#333333' },
  titleSection: { marginBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: '#333333', lineHeight: 30 },
  form: { flex: 1 },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '500', color: '#333333', marginBottom: 8 },
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
  buttonContainer: { paddingHorizontal: 24, paddingBottom: 34, paddingTop: 16 },
  nextButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  nextButtonActive: { backgroundColor: '#00D664' },
  nextButtonInactive: { backgroundColor: '#E0E0E0' },
  nextButtonText: { fontSize: 16, fontWeight: '600' },
  nextButtonTextActive: { color: '#FFFFFF' },
  nextButtonTextInactive: { color: '#999999' },
});
