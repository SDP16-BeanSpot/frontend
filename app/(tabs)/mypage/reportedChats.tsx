import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { fetchBlockedRooms, unblockChatRoom } from '../../../features/chat/api';
import { REPORT_TYPE_SHORT_LABELS } from '../../../features/shared/reportTypes';
import type { BlockedRoom } from '../../../features/chat/types';

export default function ReportedChatsScreen() {
  const router = useRouter();
  const [rooms, setRooms] = useState<BlockedRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlockedRooms()
      .then(setRooms)
      .finally(() => setLoading(false));
  }, []);

  const handleUnblock = (room: BlockedRoom) => {
    Alert.alert(
      '차단 취소',
      `"${room.roomTitle}" 채팅방 차단을 취소할까요?\n다시 메시지를 보낼 수 있게 돼요.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '차단 취소',
          onPress: async () => {
            setUnblockingId(room.roomId);
            const result = await unblockChatRoom(room.roomId);
            setUnblockingId(null);
            if (result.ok || result.skipped) {
              setRooms((prev) => prev.filter((r) => r.roomId !== room.roomId));
            } else {
              Alert.alert('오류', '차단 취소에 실패했어요. 잠시 후 다시 시도해주세요.');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: BlockedRoom }) => (
    <View style={styles.card}>
      {item.thumbnailUrl ? (
        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.roomTitle} numberOfLines={1}>{item.roomTitle}</Text>
        <View style={styles.reasonBadge}>
          <Text style={styles.reasonText}>{REPORT_TYPE_SHORT_LABELS[item.reportType]}</Text>
        </View>
        <Text style={styles.dateText}>{item.reportedAt} 신고 접수</Text>
      </View>
      <TouchableOpacity
        style={styles.unblockBtn}
        onPress={() => handleUnblock(item)}
        disabled={unblockingId === item.roomId}
      >
        {unblockingId === item.roomId ? (
          <ActivityIndicator size="small" color="#4CAF50" />
        ) : (
          <Text style={styles.unblockText}>차단 취소</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>신고 내역</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderItem}
          keyExtractor={(item) => item.roomId}
          contentContainerStyle={rooms.length === 0 ? styles.emptyContainer : styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Feather name="shield" size={40} color="#DDD" />
              <Text style={styles.emptyText}>신고한 채팅방이 없어요.</Text>
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
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyContainer: { flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingTop: 100 },
  emptyText: { fontSize: 14, color: '#999' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  thumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: '#EEE' },
  thumbPlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5E4' },
  info: { flex: 1 },
  roomTitle: { fontSize: 14, fontWeight: '700', color: '#222', marginBottom: 5 },
  reasonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF0F0',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 4,
  },
  reasonText: { fontSize: 10, color: '#E53935', fontWeight: '700' },
  dateText: { fontSize: 11, color: '#999' },
  unblockBtn: {
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 78,
    alignItems: 'center',
  },
  unblockText: { fontSize: 12, color: '#4CAF50', fontWeight: '700' },
});
