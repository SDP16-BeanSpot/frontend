import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';

import AdminGuard from '../../../components/features/admin/AdminGuard';
import { fetchAdminReports } from '../../../features/admin/api';
import {
  REPORT_STATUS_LABELS,
  REPORT_TYPE_LABELS,
  type AdminReportListItem,
  type ReportStatus,
} from '../../../features/admin/types';

const STATUS_FILTERS: { key: ReportStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '대기중' },
  { key: 'COMPLETED', label: '처리 완료' },
  { key: 'REJECTED', label: '반려' },
];

const STATUS_COLORS: Record<ReportStatus, { text: string; bg: string }> = {
  PENDING: { text: '#F9A825', bg: '#FFF8E1' },
  COMPLETED: { text: '#2E7D32', bg: '#E8F5E4' },
  REJECTED: { text: '#757575', bg: '#F0F0F0' },
};

export default function AdminReportsScreen() {
  return (
    <AdminGuard title="신고 관리">
      <ReportList />
    </AdminGuard>
  );
}

function ReportList() {
  const router = useRouter();
  const [items, setItems] = useState<AdminReportListItem[]>([]);
  const [filter, setFilter] = useState<ReportStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(
    async (nextPage: number, nextFilter: ReportStatus | 'ALL', append = false) => {
      try {
        setError('');
        const result = await fetchAdminReports(
          nextPage,
          nextFilter === 'ALL' ? undefined : nextFilter,
        );
        setTotalPages(result.totalPages);
        setPage(result.page);
        setItems((prev) => (append ? [...prev, ...result.items] : result.items));
      } catch (e: any) {
        setError(e?.message ?? '신고 목록을 불러오지 못했습니다.');
        if (!append) setItems([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    setLoading(true);
    void load(0, filter);
  }, [filter, load]);

  const loadMore = () => {
    if (loading || page + 1 >= totalPages) return;
    void load(page + 1, filter, true);
  };

  const renderItem = ({ item }: { item: AdminReportListItem }) => {
    const statusStyle = STATUS_COLORS[item.status];
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => router.push(`/admin/reports/${item.reportId}` as Href)}
      >
        <View style={styles.cardTop}>
          <Text style={styles.reportType}>{REPORT_TYPE_LABELS[item.reportType] ?? item.reportType}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {REPORT_STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>
        <Text style={styles.cardBody} numberOfLines={1}>
          {item.reporterNickname} 님이 {item.reportedUserNickname} 님을 신고
        </Text>
        <Text style={styles.cardDate}>{item.createdAt?.slice(0, 10)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>신고 관리</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* 상태 필터 */}
      <View style={styles.filterRow}>
        {STATUS_FILTERS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterChip, filter === key && styles.filterChipActive]}
            onPress={() => setFilter(key)}
          >
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.reportId)}
          contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void load(0, filter);
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Feather name="inbox" size={44} color="#DDD" />
              <Text style={styles.emptyText}>{error || '접수된 신고가 없어요.'}</Text>
            </View>
          }
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
  },
  filterChipActive: { backgroundColor: '#4CAF50' },
  filterText: { fontSize: 13, color: '#666', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyContainer: { flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingTop: 80 },
  emptyText: { fontSize: 14, color: '#999' },
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportType: { fontSize: 14, fontWeight: '700', color: '#222' },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardBody: { fontSize: 13, color: '#555', marginBottom: 6 },
  cardDate: { fontSize: 11, color: '#AAA' },
});
