import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { submitFeedback } from '../../../features/support/api';

export default function FeedbackScreen() {
  const router = useRouter();
  const [satisfaction, setSatisfaction] = useState(0);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (satisfaction === 0) {
      Alert.alert('알림', '전반적인 만족도를 선택해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('알림', '의견을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    const result = await submitFeedback({ satisfaction, content: content.trim() });
    setSubmitting(false);

    if (!result.ok && !result.skipped) {
      Alert.alert('오류', '의견 제출에 실패했어요. 잠시 후 다시 시도해주세요.');
      return;
    }
    Alert.alert('감사합니다', '소중한 의견 감사합니다!', [
      { text: '확인', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>의견 남기기</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>빈스팟에 대한 의견을 알려주세요</Text>
        <Text style={styles.subtitle}>
          여러분의 든든한 응원과 관심은 우리 콩이들에게 큰 힘이 돼요!
        </Text>

        <Text style={styles.sectionLabel}>빈스팟에 대한 전반적인 만족도를 알려주세요.</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity key={n} onPress={() => setSatisfaction(n)} hitSlop={8}>
              <Feather
                name="star"
                size={32}
                color={n <= satisfaction ? '#FFC107' : '#DDD'}
                style={n <= satisfaction ? styles.starFilled : undefined}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>빈스팟에 가지고 있는 의견을 자유롭게 알려주세요.</Text>
        <View style={styles.textAreaCard}>
          <TextInput
            style={styles.textArea}
            placeholder="환경 관련 공고를 찾을 수 있어서 좋아요! 꾸준히 사용해볼게요!!"
            placeholderTextColor="#BBB"
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={200}
          />
          <Text style={styles.counter}>{content.length}/200</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/mypage/customerCenter' as any)}>
          <Text style={styles.footerText}>
            답변이 필요한가요? <Text style={styles.footerLink}>고객센터</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>제출</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#212121' },
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 19, fontWeight: '800', color: '#222', marginBottom: 8 },
  subtitle: { fontSize: 12, color: '#999', marginBottom: 26 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 14 },
  starRow: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  starFilled: {},
  textAreaCard: {
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    padding: 14,
    minHeight: 130,
  },
  textArea: { flex: 1, fontSize: 13, color: '#333', textAlignVertical: 'top' },
  counter: { alignSelf: 'flex-end', fontSize: 11, color: '#BBB', marginTop: 8 },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 10,
    alignItems: 'center',
    gap: 14,
  },
  footerText: { fontSize: 12, color: '#999' },
  footerLink: { color: '#4CAF50', fontWeight: '700' },
  submitBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
