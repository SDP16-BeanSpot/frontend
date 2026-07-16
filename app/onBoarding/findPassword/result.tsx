import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function FindPasswordResultPage() {
  const { userId, maskedPassword } = useLocalSearchParams<{ userId?: string; maskedPassword?: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={64} color="#00D664" />
        </View>

        <Text style={styles.title}>비밀번호를 찾았어요</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>아이디</Text>
            <Text style={styles.rowValue}>{userId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>비밀번호</Text>
            <Text style={styles.rowValue}>{maskedPassword}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.resetLink}
          onPress={() =>
            router.push({ pathname: '/onBoarding/findPassword/reset', params: { userId } })
          }
        >
          <Text style={styles.resetLinkText}>비밀번호 변경하기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={() => router.replace('/onBoarding/login' as any)}>
          <Text style={styles.nextButtonText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  header: { width: '100%', paddingTop: 20, paddingBottom: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  backButtonText: { fontSize: 24, color: '#333333' },
  iconWrap: { marginTop: 20, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#333333', marginBottom: 32 },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    padding: 20,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  rowLabel: { fontSize: 14, color: '#999999' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#333333' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
  resetLink: { marginTop: 24 },
  resetLinkText: { fontSize: 13, color: '#00D664', fontWeight: '700', textDecorationLine: 'underline' },
  buttonContainer: { paddingHorizontal: 24, paddingBottom: 34, paddingTop: 16 },
  nextButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#00D664' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
