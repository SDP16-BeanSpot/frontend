import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, useFocusEffect, useRouter } from 'expo-router';

import { fetchFavorites, removeFavorite } from '../../../features/calendar/api';
import { formatDuration, type CalendarSchedule } from '../../../features/calendar/types';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<CalendarSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // 공고 상세에서 관심 해제하고 돌아올 수 있으므로 포커스마다 갱신
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      fetchFavorites()
        .then((list) => {
          if (!cancelled) setFavorites(list);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const handleRemove = async (announcementId: number) => {
    const previous = favorites;
    setFavorites((prev) => prev.filter((f) => f.announcementId !== announcementId));
    const result = await removeFavorite(announcementId);
    // 서버 반영 실패 시 되돌림
    if (!result.ok && !result.skipped) setFavorites(previous);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나의 관심공고</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.center}>
          <Image
            source={require('../../../assets/images/beanGreen.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>등록된 관심공고가 없어요.</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/(tabs)/home' as Href)}
          >
            <Text style={styles.emptyBtnText}>공고 보러가기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.announcementId)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push(`/posting/${item.announcementId}` as Href)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.cardDuration}>
                  {formatDuration(item.startDate, item.endDate)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemove(item.announcementId)}
                hitSlop={10}
                style={styles.heartBtn}
              >
                <Ionicons name="heart" size={24} color="#FF5252" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mascot: { width: 120, height: 120, marginBottom: 16 },
  emptyText: { fontSize: 14, color: '#999', marginBottom: 20 },
  emptyBtn: {
    backgroundColor: '#F0FAF0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  emptyBtnText: { color: '#4CAF50', fontWeight: '700', fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 6 },
  cardDuration: { fontSize: 12, color: '#888' },
  heartBtn: { padding: 4 },
});
