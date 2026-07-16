import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import PhoneSmsField, { isPhoneSmsVerified } from '../../../components/features/onboarding/PhoneSmsField';
import { findAccountsByPhone } from '../../../features/findAccount/mock';

export default function FindIdPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = useMemo(() => isPhoneSmsVerified(code), [code]);

  const handleNext = () => {
    if (!isFormValid) {
      Alert.alert('알림', '인증번호를 확인해주세요.');
      return;
    }
    setIsLoading(true);
    // ⚠️ SMS 인증/아이디 조회 엔드포인트가 없어 시뮬레이션으로 대체합니다.
    setTimeout(() => {
      setIsLoading(false);
      const accounts = findAccountsByPhone(phone);
      router.replace({
        pathname: '/onBoarding/findId/result',
        params: { accounts: JSON.stringify(accounts) },
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
          <Text style={styles.title}>아이디 찾기를 위해{'\n'}본인인증이 필요해요</Text>
        </View>

        <View style={styles.form}>
          <PhoneSmsField phone={phone} onPhoneChange={setPhone} code={code} onCodeChange={setCode} />
        </View>

        <TouchableOpacity style={styles.signupLink} onPress={() => router.push('/onBoarding/register' as any)}>
          <Text style={styles.signupText}>
            계정이 없나요? <Text style={styles.signupLinkText}>회원가입 바로가기</Text>
          </Text>
        </TouchableOpacity>
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
  signupLink: { alignItems: 'center', paddingBottom: 20 },
  signupText: { fontSize: 13, color: '#999999' },
  signupLinkText: { color: '#00D664', fontWeight: '700' },
  buttonContainer: { paddingHorizontal: 24, paddingBottom: 34, paddingTop: 16 },
  nextButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  nextButtonActive: { backgroundColor: '#00D664' },
  nextButtonInactive: { backgroundColor: '#E0E0E0' },
  nextButtonText: { fontSize: 16, fontWeight: '600' },
  nextButtonTextActive: { color: '#FFFFFF' },
  nextButtonTextInactive: { color: '#999999' },
});
