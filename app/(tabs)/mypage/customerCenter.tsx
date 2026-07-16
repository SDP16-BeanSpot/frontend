import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { MOCK_FAQ_CATEGORIES } from '../../../features/support/mock';

const formatNow = () => {
  const hour = new Date().getHours();
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${displayHour}시`;
};

export default function CustomerCenterScreen() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = MOCK_FAQ_CATEGORIES.find((c) => c.id === selectedId);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>고객센터</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>
          Bean<Text style={{ color: '#76E24E' }}>.</Text>
        </Text>

        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>
            안녕하세요, 빈스팟님 ! 궁금한 점을 빠르게 도와드리는 빈스팟이에요, 어떤 서비스가 궁금하신가요?
          </Text>
        </View>

        <View style={styles.chipRow}>
          {MOCK_FAQ_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, selectedId === cat.id && styles.chipActive]}
              onPress={() => setSelectedId(cat.id)}
            >
              <Text style={[styles.chipText, selectedId === cat.id && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.time}>{formatNow()}</Text>

        {selected && (
          <>
            <View style={[styles.bubble, styles.answerBubble]}>
              <Text style={styles.bubbleText}>{selected.answer}</Text>
            </View>
            <Text style={styles.time}>{formatNow()}</Text>
          </>
        )}
      </ScrollView>
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
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  logo: { fontSize: 24, fontWeight: '900', color: '#5B3E2B', marginBottom: 20 },
  bubble: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    alignSelf: 'flex-start',
    maxWidth: '92%',
  },
  answerBubble: { backgroundColor: '#F0FAF0' },
  bubbleText: { fontSize: 13, color: '#333', lineHeight: 20 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
  },
  chipActive: { backgroundColor: '#4CAF50' },
  chipText: { fontSize: 13, color: '#666', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  time: { fontSize: 11, color: '#AAA', marginBottom: 14 },
});
