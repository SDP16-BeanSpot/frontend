import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useRegister } from '../../hooks/useRegister';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterPage() {
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 아이디 중복확인 상태: null=미확인, true=사용가능, false=사용불가
  const [idAvailable, setIdAvailable] = useState<boolean | null>(null);
  const [idCheckMessage, setIdCheckMessage] = useState('');

  const { register, checkingId, loading } = useRegister();

  const handleUserIdChange = (value: string) => {
    setUserId(value);
    // 아이디를 다시 수정하면 중복확인 무효화 (재확인 필요)
    setIdAvailable(null);
    setIdCheckMessage('');
  };

  const handleCheckDuplicate = async () => {
    if (!userId.trim()) return;
    const result = await checkingId(userId.trim());
    if (result) {
      setIdAvailable(result.available);
      setIdCheckMessage(result.message);
    }
  };

  const handleRegister = async () => {
    if (idAvailable !== true) {
      Alert.alert('알림', '아이디 중복확인을 먼저 진행해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    // Figma 회원가입 플로우엔 별도 '이름' 입력칸이 없어 닉네임을 name 으로도 함께 전송합니다.
    // (백엔드 Req 스키마는 name 을 필수로 요구함)
    const result = await register({
      userId: userId.trim(),
      password,
      nickname: nickname.trim(),
      name: nickname.trim(),
    });

    if (result.ok) {
      router.replace({
        pathname: '/onBoarding/id_verification',
        params: { nickname: nickname.trim() },
      });
    } else {
      Alert.alert('회원가입 실패', result.error ?? '잠시 후 다시 시도해주세요.');
    }
  };

  const isFormValid =
    nickname.trim().length > 0 &&
    idAvailable === true &&
    password.length > 0 &&
    password === confirmPassword;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>회원가입</Text>
        </View>

        <Text style={styles.sectionTitle}>기본 정보를 입력해주세요</Text>

        <View style={styles.form}>
          {/* 닉네임 */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={styles.input}
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChangeText={setNickname}
              maxLength={14}
              autoCapitalize="none"
            />
            <Text style={styles.hint}>최대 14글자까지 가능</Text>
          </View>

          {/* 아이디 (닉네임 입력 후 노출) */}
          {nickname.length > 0 && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>아이디</Text>
              <View style={styles.idRow}>
                <TextInput
                  style={[styles.input, styles.idInput]}
                  placeholder="아이디를 입력하세요"
                  value={userId}
                  onChangeText={handleUserIdChange}
                  maxLength={14}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.checkButton} onPress={handleCheckDuplicate}>
                  <Text style={styles.checkButtonText}>중복 확인</Text>
                </TouchableOpacity>
              </View>
              {idCheckMessage ? (
                <Text style={[styles.hint, idAvailable ? styles.hintOk : styles.hintError]}>
                  {idCheckMessage}
                </Text>
              ) : (
                <Text style={styles.hint}>최대 14글자까지 가능</Text>
              )}
            </View>
          )}

          {/* 비밀번호 (아이디 중복확인 통과 후 노출) */}
          {idAvailable === true && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호</Text>
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
          )}

          {/* 비밀번호 재확인 */}
          {password.length > 0 && (
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
          )}

          {password.length > 0 && (
            <TouchableOpacity
              style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
              onPress={handleRegister}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.nextButtonText}>다음</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 24, color: '#333333' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333333', marginLeft: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 24 },
  form: { flex: 1, paddingBottom: 40 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#333333', marginBottom: 8 },
  input: {
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    backgroundColor: '#F5F5F5',
  },
  idRow: { flexDirection: 'row', gap: 8 },
  idInput: { flex: 1 },
  checkButton: {
    backgroundColor: '#00D664',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  checkButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  hint: { fontSize: 11, color: '#999999', marginTop: 6, textAlign: 'right' },
  hintOk: { color: '#00D664' },
  hintError: { color: '#FF5252' },
  nextButton: {
    backgroundColor: '#00D664',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  nextButtonDisabled: { backgroundColor: '#E0E0E0' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
