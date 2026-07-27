import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { fetchMonthlyDiaries } from '../../../features/calendar/api';
import { DIARY_MAX_LENGTH, type DiaryData } from '../../../features/calendar/types';
import DiaryFace from '../../../components/features/calendar/DiaryFace';

const pad = (n: number) => String(n).padStart(2, '0');
const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** 해당 월의 날짜를 최신순으로 만든다. 미래 달이면 말일부터, 이번 달이면 오늘부터. */
const buildDaysOfMonth = (year: number, month: number, today: Date): string[] => {
  const isThisMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const lastDay = isThisMonth ? today.getDate() : new Date(year, month, 0).getDate();
  const days: string[] = [];
  for (let day = lastDay; day >= 1; day -= 1) {
    days.push(`${year}-${pad(month)}-${pad(day)}`);
  }
  return days;
};

export default function DiaryCollectionScreen() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toDateKey(today), [today]);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [diaries, setDiaries] = useState<DiaryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMonthlyDiaries(year, month)
      .then((list) => {
        if (!cancelled) setDiaries(list);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const byDate = useMemo(() => {
    const map: Record<string, DiaryData> = {};
    diaries.forEach((d) => {
      map[d.date] = d;
    });
    return map;
  }, [diaries]);

  const days = useMemo(() => buildDaysOfMonth(year, month, today), [year, month, today]);

  const shiftMonth = useCallback((delta: number) => {
    setMonth((prev) => {
      const next = prev + delta;
      if (next < 1) {
        setYear((y) => y - 1);
        return 12;
      }
      if (next > 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return next;
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일기 모아보기</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.monthRow}>
        <TouchableOpacity onPress={() => shiftMonth(-1)} hitSlop={8} style={styles.monthArrow}>
          <Ionicons name="chevron-back" size={18} color="#666" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {year}년 {month}월
        </Text>
        <TouchableOpacity onPress={() => shiftMonth(1)} hitSlop={8} style={styles.monthArrow}>
          <Ionicons name="chevron-forward" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {days.map((dateKey) => {
            const diary = byDate[dateKey];
            const [, mm, dd] = dateKey.split('-');
            const isToday = dateKey === todayKey;

            return (
              <View key={dateKey} style={styles.entry}>
                <View style={styles.entryHead}>
                  <Text style={styles.entryDate}>
                    {mm}.{dd}
                  </Text>
                  {isToday && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>오늘</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }} />
                  {diary && (
                    <DiaryFace
                      emotion={diary.emotionType}
                      character={diary.characterType}
                      size={32}
                    />
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.card}
                  onPress={() => router.push('/calendar' as any)}
                >
                  <Text style={diary ? styles.cardText : styles.cardPlaceholder}>
                    {diary ? diary.content : '일기를 작성해보세요.'}
                  </Text>
                  <Text style={styles.counter}>
                    {(diary?.content.length ?? 0)}/{DIARY_MAX_LENGTH}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
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
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  monthArrow: { padding: 2 },
  monthText: { fontSize: 15, fontWeight: '700', color: '#222' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  entry: { marginBottom: 20 },
  entryHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  entryDate: { fontSize: 13, fontWeight: '600', color: '#333', marginLeft: 6 },
  todayBadge: {
    backgroundColor: '#E8F8E4',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  todayBadgeText: { fontSize: 11, fontWeight: '700', color: '#4CAF50' },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 16,
    minHeight: 76,
    justifyContent: 'space-between',
  },
  cardText: { fontSize: 13, color: '#333', lineHeight: 20 },
  cardPlaceholder: { fontSize: 13, color: '#BBB' },
  counter: { alignSelf: 'flex-end', fontSize: 11, color: '#BBB', marginTop: 10 },
});
