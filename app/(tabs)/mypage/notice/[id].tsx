import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { fetchNoticeDetail, fetchNotices } from '../../../../features/support/api';
import type { Notice } from '../../../../features/support/types';

export default function NoticeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [nextNotice, setNextNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchNoticeDetail(String(id)), fetchNotices()])
      .then(([detail, all]) => {
        setNotice(detail);
        const idx = all.findIndex((n) => n.id === String(id));
        setNextNotice(idx >= 0 ? all[idx + 1] ?? null : null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>공지사항</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : !notice ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>공지를 찾을 수 없습니다.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{notice.title}</Text>
          <Text style={styles.body}>{notice.content}</Text>

          {nextNotice && (
            <TouchableOpacity
              style={styles.nextRow}
              onPress={() => router.replace(`/mypage/notice/${nextNotice.id}` as any)}
            >
              <View style={styles.nextText}>
                <Text style={styles.nextTitle} numberOfLines={1}>{nextNotice.title}</Text>
                <Text style={styles.nextDate}>{nextNotice.publishedAt}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.listBtn} onPress={() => router.back()}>
            <Text style={styles.listBtnText}>목록</Text>
            <Ionicons name="chevron-forward" size={14} color="#555" />
          </TouchableOpacity>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#999' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontSize: 19, fontWeight: '800', color: '#222', marginBottom: 18 },
  body: { fontSize: 14, color: '#444', lineHeight: 23 },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  nextText: { flex: 1, marginRight: 12 },
  nextTitle: { fontSize: 13, fontWeight: '600', color: '#333' },
  nextDate: { fontSize: 11, color: '#999', marginTop: 4 },
  listBtn: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  listBtnText: { fontSize: 13, color: '#555', fontWeight: '600' },
});
