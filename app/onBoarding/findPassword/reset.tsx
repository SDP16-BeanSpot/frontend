import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

export default function FindPasswordResetPage() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = useMemo(
    () => password.length > 0 && password === confirmPassword,
    [password, confirmPassword],
  );

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsLoading(true);
    // ⚠️ 비밀번호 변경 엔드포인트가 없어 시뮬레이션으로 대체합니다.
    setTimeout(() => {
      setIsLoading(false);
      router.replace({
        pathname: '/onBoarding/findPassword/complete',
        params: { userId, password },
      });
    }, 1000);
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
          <Text style={styles.title}>새 비밀번호를{'\n'}입력해주세요</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>새 비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              maxLength={14}
              autoCapitalize="none"
            />
            <Text style={styles.hint}>특수문자 1글자 이상, 최대 14글자</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>비밀번호 재확인</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 다시 입력해주세요."
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              maxLength={14}
              autoCapitalize="none"
            />
            <Text style={styles.hint}>특수문자 1글자 이상, 최대 14글자</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, isFormValid ? styles.nextButtonActive : styles.nextButtonInactive]}
          onPress={handleSubmit}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.nextButtonText, isFormValid ? styles.nextButtonTextActive : styles.nextButtonTextInactive]}>
              변경하기
            </Text>
          )}
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
  hint: { fontSize: 12, color: '#999999', marginTop: 6 },
  buttonContainer: { paddingHorizontal: 24, paddingBottom: 34, paddingTop: 16 },
  nextButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  nextButtonActive: { backgroundColor: '#00D664' },
  nextButtonInactive: { backgroundColor: '#E0E0E0' },
  nextButtonText: { fontSize: 16, fontWeight: '600' },
  nextButtonTextActive: { color: '#FFFFFF' },
  nextButtonTextInactive: { color: '#999999' },
});
