import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CODE_LENGTH = 6;
const TIMER_SECONDS = 150; // 2:30

interface PhoneSmsFieldProps {
  phone: string;
  onPhoneChange: (v: string) => void;
  code: string;
  onCodeChange: (v: string) => void;
}

const formatPhone = (text: string) => {
  const numbers = text.replace(/[^0-9]/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * 전화번호 + SMS 확인 + 인증번호(6자리) + 타이머 위젯.
 * ⚠️ 백엔드에 SMS 발송/검증 엔드포인트가 없어 시뮬레이션으로 동작합니다
 *    (id_verification.tsx 와 동일한 패턴).
 */
const PhoneSmsField = ({ phone, onPhoneChange, code, onCodeChange }: PhoneSmsFieldProps) => {
  const [sent, setSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendSms = () => {
    if (phone.replace(/[^0-9]/g, '').length < 10) return;
    setSent(true);
    onCodeChange('');
    startTimer();
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>전화번호</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="010-0000-0000"
            value={phone}
            onChangeText={(v) => onPhoneChange(formatPhone(v))}
            keyboardType="phone-pad"
            maxLength={13}
          />
          <TouchableOpacity style={styles.smsBtn} onPress={handleSendSms}>
            <Text style={styles.smsBtnText}>SMS 확인</Text>
          </TouchableOpacity>
        </View>
      </View>

      {sent && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>인증번호</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="숫자 6자리"
              value={code}
              onChangeText={(v) => onCodeChange(v.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
              keyboardType="number-pad"
              maxLength={CODE_LENGTH}
            />
            <Text style={styles.timer}>{formatTimer(secondsLeft)}</Text>
          </View>
          <TouchableOpacity style={styles.resendRow} onPress={handleSendSms}>
            <Text style={styles.resendText}>
              문자가 오지 않나요? <Text style={styles.resendLink}>다시 전송하기</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export const isPhoneSmsVerified = (code: string) => code.length === CODE_LENGTH;

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '500', color: '#333333', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
  phoneInput: { flex: 1 },
  smsBtn: {
    backgroundColor: '#00D664',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  smsBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  codeInput: { flex: 1 },
  timer: { fontSize: 13, color: '#FF5252', fontWeight: '600', minWidth: 40 },
  resendRow: { marginTop: 10, alignItems: 'center' },
  resendText: { fontSize: 12, color: '#999' },
  resendLink: { color: '#00D664', fontWeight: '700', textDecorationLine: 'underline' },
});

export default PhoneSmsField;
