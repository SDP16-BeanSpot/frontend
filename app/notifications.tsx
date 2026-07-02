import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { MOCK_NOTIFICATIONS } from '../features/posting/mock';
import type { NotificationItem } from '../features/posting/types';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const removeOne = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const removeAll = () => {
    setNotifications([]);
    setConfirmVisible(false);
  };

  const renderMessage = (item: NotificationItem) => {
    const [before, after] = item.message.split('{bold}');
    return (
      <Text style={styles.message}>
        {before}
        <Text style={styles.messageBold}>{item.boldText}</Text>
        {after}
      </Text>
    );
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.tag}>{item.tag}</Text>
        {renderMessage(item)}
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>
      <TouchableOpacity
        style={styles.closeBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={() => removeOne(item.id)}
      >
        <Feather name="x" size={16} color="#999" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#212121" />
        </TouchableOpacity>
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            <Text style={styles.footer}>7일전 알림까지 확인할 수 있어요</Text>
          }
        />
      ) : (
        <View style={styles.empty}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.emptyMascot}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>새로운 알림이 없어요.</Text>
        </View>
      )}

      {/* ... 메뉴 */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                setConfirmVisible(true);
              }}
            >
              <Feather name="trash-2" size={16} color="#424242" />
              <Text style={styles.menuItemText}>전체 삭제</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
              <Ionicons name="notifications-off-outline" size={16} color="#424242" />
              <Text style={styles.menuItemText}>알림 끄기</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* 전체삭제 확인 팝업 */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.confirmBackdrop}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>알림을 전체 삭제하시겠습니까?</Text>
            <Text style={styles.confirmDesc}>삭제된 알림은 복구할 수 없어요.</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={removeAll}>
                <Text style={styles.deleteText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#212121' },
  list: { paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F0F9EE',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 2,
  },
  cardContent: { flex: 1 },
  tag: { fontSize: 12, fontWeight: '700', color: '#4CAF50', marginBottom: 5 },
  message: { fontSize: 14, color: '#333', lineHeight: 20 },
  messageBold: { fontWeight: '700' },
  timeAgo: { fontSize: 12, color: '#999', marginTop: 6 },
  closeBtn: { paddingLeft: 10, paddingTop: 2 },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#BBB',
    paddingVertical: 22,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    gap: 12,
  },
  emptyMascot: { width: 84, height: 84, opacity: 0.45 },
  emptyText: { fontSize: 14, color: '#999' },
  menuBackdrop: { flex: 1, alignItems: 'flex-end' },
  menuCard: {
    marginTop: 56,
    marginRight: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    width: 150,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  menuItemText: { fontSize: 13, color: '#424242', fontWeight: '600' },
  confirmBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  confirmCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
  },
  confirmTitle: { fontSize: 16, fontWeight: '700', color: '#212121', textAlign: 'center' },
  confirmDesc: { fontSize: 13, color: '#757575', textAlign: 'center', marginTop: 8 },
  confirmActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#555' },
  deleteBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
