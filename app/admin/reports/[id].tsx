import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AdminGuard from '../../../components/features/admin/AdminGuard';
import { fetchAdminReportDetail, processAdminReport } from '../../../features/admin/api';
import {
  REPORT_STATUS_LABELS,
  REPORT_TYPE_LABELS,
  type AdminReportDetail,
} from '../../../features/admin/types';
import { ApiError } from '../../../features/shared/apiClient';

export default function AdminReportDetailScreen() {
  return (
    <AdminGuard title="신고 상세">
      <ReportDetail />
    </AdminGuard>
  );
}

function ReportDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [report, setReport] = useState<AdminReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchAdminReportDetail(Number(id))
      .then(setReport)
      .catch((e) => {
        Alert.alert('오류', e instanceof ApiError ? e.message : '신고를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleProcess = (status: 'COMPLETED' | 'REJECTED') => {
    const actionLabel = status === 'COMPLETED' ? '처리 완료' : '반려';
    Alert.alert('신고 처리', `이 신고를 "${actionLabel}" 상태로 변경할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: actionLabel,
        onPress: async () => {
          setProcessing(true);
          try {
            const updated = await processAdminReport(Number(id), status);
            setReport(updated);
            Alert.alert('완료', `신고가 ${actionLabel} 처리되었습니다.`);
          } catch (e) {
            Alert.alert('오류', e instanceof ApiError ? e.message : '처리에 실패했습니다.');
          } finally {
            setProcessing(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>신고 상세</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : !report ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>신고 정보를 찾을 수 없습니다.</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <InfoRow label="신고 유형" value={REPORT_TYPE_LABELS[report.reportType] ?? report.reportType} />
            <InfoRow label="처리 상태" value={REPORT_STATUS_LABELS[report.status]} />
            <InfoRow label="신고자" value={report.reporterNickname} />
            <InfoRow label="피신고자" value={report.reportedUserNickname} />
            <InfoRow label="접수 일시" value={report.createdAt?.replace('T', ' ').slice(0, 16) ?? '-'} />

            <Text style={styles.sectionLabel}>신고된 메시지</Text>
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{report.messageContent || '-'}</Text>
            </View>

            <Text style={styles.sectionLabel}>신고 사유</Text>
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>{report.content || '-'}</Text>
            </View>
          </ScrollView>

          {report.status === 'PENDING' && (
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={styles.rejectBtn}
                disabled={processing}
                onPress={() => handleProcess('REJECTED')}
              >
                <Text style={styles.rejectText}>반려</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.completeBtn}
                disabled={processing}
                onPress={() => handleProcess('COMPLETED')}
              >
                {processing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.completeText}>처리 완료</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: { width: 84, fontSize: 13, color: '#999', fontWeight: '600' },
  infoValue: { flex: 1, fontSize: 13, color: '#333' },
  sectionLabel: { fontSize: 13, color: '#999', fontWeight: '600', marginTop: 20, marginBottom: 8 },
  messageBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
  },
  messageText: { fontSize: 13, color: '#333', lineHeight: 20 },
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  rejectBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectText: { fontSize: 15, fontWeight: '600', color: '#555' },
  completeBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
