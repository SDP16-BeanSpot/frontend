import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';

import { searchPostings } from '../features/posting/api';
import { RECENT_SEARCHES, SUGGESTED_SEARCHES } from '../features/posting/mock';
import type { PostingDetail } from '../features/posting/types';

type SearchState = 'landing' | 'loading' | 'results';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recents, setRecents] = useState<string[]>(RECENT_SEARCHES);
  const [results, setResults] = useState<PostingDetail[]>([]);
  const [state, setState] = useState<SearchState>('landing');

  const runSearch = async (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setState('loading');
    setRecents((prev) => [trimmed, ...prev.filter((r) => r !== trimmed)].slice(0, 5));
    const data = await searchPostings(trimmed);
    setResults(data);
    setState('results');
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    setState('landing');
  };

  const renderResult = ({ item }: { item: PostingDetail }) => {
    const period = item.fields.find((f) => f.label === '활동기간')?.value ?? '';
    const region = item.fields.find((f) => f.label.includes('지역'))?.value ?? '';
    const method = item.fields.find((f) => f.label === '활동방식')?.value ?? '';
    return (
      <TouchableOpacity
        style={result.card}
        activeOpacity={0.85}
        onPress={() => router.push(`/posting/${encodeURIComponent(item.id)}` as Href)}
      >
        {item.posterUrl ? (
          <Image source={{ uri: item.posterUrl }} style={result.thumb} />
        ) : (
          <View style={[result.thumb, result.thumbPlaceholder]}>
            <Feather name="image" size={22} color="#DDD" />
          </View>
        )}
        <View style={result.content}>
          <View style={result.tagRow}>
            <View style={result.dDayBadge}>
              <Text style={result.dDayText}>{item.dDay}</Text>
            </View>
            <View style={result.catBadge}>
              <Text style={result.catText}>{item.category}</Text>
            </View>
          </View>
          <Text style={result.title} numberOfLines={1}>{item.title}</Text>
          {!!period && <Text style={result.period}>활동기간  {period}</Text>}
          <View style={result.locationRow}>
            {!!region && <Text style={result.locationTag}>{region.split(' ').pop()}</Text>}
            {!!method && <Text style={result.locationTag}>{method.split(',')[0]}</Text>}
          </View>
        </View>
        <Feather name="heart" size={20} color="#DDD" style={result.heart} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 검색 바 */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="검색어를 입력해보세요"
            placeholderTextColor="#BDBDBD"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => runSearch(query)}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={clearQuery}>
              <Ionicons name="close-circle" size={20} color="#BBB" />
            </TouchableOpacity>
          ) : (
            <Feather name="search" size={20} color="#999" />
          )}
        </View>
      </View>

      {state === 'landing' && (
        <View style={styles.landing}>
          {/* 최근 검색어 */}
          {recents.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>최근 검색어</Text>
                <TouchableOpacity onPress={() => setRecents([])}>
                  <Text style={styles.clearAll}>전체 삭제</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chipWrap}>
                {recents.map((kw) => (
                  <View key={kw} style={styles.recentChip}>
                    <TouchableOpacity onPress={() => runSearch(kw)}>
                      <Text style={styles.recentChipText}>{kw}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setRecents((prev) => prev.filter((r) => r !== kw))}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Feather name="x" size={14} color="#999" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* 추천 검색어 */}
          <Text style={[styles.sectionTitle, styles.suggestTitle]}>추천 검색어</Text>
          <View style={styles.chipWrap}>
            {SUGGESTED_SEARCHES.map((kw) => (
              <TouchableOpacity
                key={kw}
                style={styles.suggestChip}
                onPress={() => runSearch(kw)}
              >
                <Text style={styles.suggestChipText}>{kw}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {state === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}

      {state === 'results' && (
        results.length > 0 ? (
          <FlatList
            data={results}
            renderItem={renderResult}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultList}
            ListHeaderComponent={
              <Text style={styles.resultCount}>총 {results.length}개의 공고가 있어요.</Text>
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.center}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.emptyMascot}
              resizeMode="contain"
            />
            <Text style={styles.emptyText}>검색 결과가 없어요.</Text>
            <Text style={styles.emptySub}>다른 검색어로 다시 시도해보세요!</Text>
          </View>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 4,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 44,
    marginRight: 12,
  },
  input: { flex: 1, fontSize: 14, color: '#212121' },
  landing: { paddingHorizontal: 20, paddingTop: 16 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#212121' },
  clearAll: { fontSize: 13, color: '#999' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  recentChipText: { fontSize: 14, color: '#424242' },
  suggestTitle: { marginTop: 28, marginBottom: 14 },
  suggestChip: {
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  suggestChipText: { fontSize: 14, color: '#4CAF50', fontWeight: '600' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    gap: 8,
  },
  emptyMascot: { width: 84, height: 84, opacity: 0.45, marginBottom: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#555' },
  emptySub: { fontSize: 13, color: '#999' },
  resultList: { paddingHorizontal: 20, paddingBottom: 40 },
  resultCount: { fontSize: 13, color: '#757575', paddingVertical: 12 },
});

const result = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'flex-start',
  },
  thumb: { width: 84, height: 104, borderRadius: 12, backgroundColor: '#F5F5F5' },
  thumbPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, marginLeft: 14 },
  tagRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  dDayBadge: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  dDayText: { color: '#FF5252', fontSize: 10, fontWeight: '700' },
  catBadge: {
    backgroundColor: '#E8F5E4',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  catText: { color: '#4CAF50', fontSize: 10, fontWeight: '600' },
  title: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 4 },
  period: { fontSize: 12, color: '#888', marginBottom: 8 },
  locationRow: { flexDirection: 'row', gap: 6 },
  locationTag: {
    fontSize: 11,
    color: '#777',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  heart: { paddingTop: 4 },
});
