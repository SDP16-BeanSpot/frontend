import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MAX_KEYWORDS = 30;

const RECENT_KEYWORDS = ['친환경', '플로킹', '가족과'];

export default function KeywordSettingsScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  const addKeyword = () => {
    const trimmed = input.trim();
    if (!trimmed || keywords.includes(trimmed) || keywords.length >= MAX_KEYWORDS) return;
    setKeywords((prev) => [...prev, trimmed]);
    setInput('');
  };

  const removeKeyword = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const addFromRecent = (kw: string) => {
    if (keywords.includes(kw) || keywords.length >= MAX_KEYWORDS) return;
    setKeywords((prev) => [...prev, kw]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          키워드 알림 설정{' '}
          <Text style={styles.headerCount}>
            ({keywords.length}/{MAX_KEYWORDS})
          </Text>
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력해보세요"
          placeholderTextColor="#BDBDBD"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addKeyword}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addBtn, !input.trim() && styles.addBtnDisabled]}
          onPress={addKeyword}
        >
          <Text style={styles.addBtnText}>등록</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Registered Keywords */}
        {keywords.length > 0 && (
          <View style={styles.keywordsWrap}>
            {keywords.map((kw) => (
              <View key={kw} style={styles.chip}>
                <Text style={styles.chipText}>{kw}</Text>
                <TouchableOpacity onPress={() => removeKeyword(kw)} style={styles.chipRemove}>
                  <Feather name="x" size={12} color="#888" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {keywords.length === 0 && (
          <View style={styles.emptyWrap}>
            <Image
              source={require('../../../assets/images/icon.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>등록된 키워드가 없어요.</Text>
            <Text style={styles.emptySubtitle}>
              키워드를 등록하고 공고 알림을 받아보세요 !
            </Text>
          </View>
        )}

        {/* Recent Keywords */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>
            빈스팟 님이 <Text style={styles.recentHighlight}>최근 본</Text> 키워드에요.
          </Text>
          <View style={styles.recentChips}>
            {RECENT_KEYWORDS.map((kw) => (
              <TouchableOpacity
                key={kw}
                style={[
                  styles.recentChip,
                  keywords.includes(kw) && styles.recentChipAdded,
                ]}
                onPress={() => addFromRecent(kw)}
                disabled={keywords.includes(kw)}
              >
                <Text
                  style={[
                    styles.recentChipText,
                    keywords.includes(kw) && styles.recentChipTextAdded,
                  ]}
                >
                  {kw}
                </Text>
                <Feather
                  name="plus"
                  size={14}
                  color={keywords.includes(kw) ? '#A5D6A7' : '#555'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  headerCount: { fontSize: 15, fontWeight: '400', color: '#999' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#333',
  },
  addBtn: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnDisabled: { backgroundColor: '#A5D6A7' },
  addBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  keywordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  chipText: { fontSize: 14, color: '#333' },
  chipRemove: { padding: 2 },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 40,
  },
  emptyImage: { width: 80, height: 80, marginBottom: 16, opacity: 0.5 },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#999' },
  recentSection: { marginTop: 8 },
  recentTitle: { fontSize: 15, color: '#555', marginBottom: 14 },
  recentHighlight: { color: '#4CAF50', fontWeight: '700' },
  recentChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#CCC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  recentChipAdded: { borderColor: '#A5D6A7' },
  recentChipText: { fontSize: 14, color: '#555' },
  recentChipTextAdded: { color: '#A5D6A7' },
});
