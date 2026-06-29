import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import type { ChatItem } from '../../../features/chat/types';

type ChatListItemProps = {
  item: ChatItem;
  onPress: () => void;
  onAction: (action: 'pin' | 'mute' | 'exit', id: string) => void;
};

const ChatListItem = ({ item, onPress, onAction }: ChatListItemProps) => {
  // 왼쪽: 알림끄기 + 찜하기 (Figma)
  const renderLeftActions = () => (
    <View style={styles.leftActions}>
      <RectButton
        style={[styles.actionBtn, item.muted ? styles.actionActive : styles.actionDefault]}
        onPress={() => onAction('mute', item.id)}
      >
        <Ionicons
          name={item.muted ? 'notifications-off' : 'notifications-off-outline'}
          size={20}
          color={item.muted ? '#2E7D32' : '#666'}
        />
      </RectButton>
      <RectButton
        style={[styles.actionBtn, item.pinned ? styles.actionActive : styles.actionDefault]}
        onPress={() => onAction('pin', item.id)}
      >
        <Feather
          name="heart"
          size={20}
          color={item.pinned ? '#2E7D32' : '#666'}
        />
      </RectButton>
    </View>
  );

  // 오른쪽: 나가기
  const renderRightActions = () => (
    <RectButton style={styles.exitBtn} onPress={() => onAction('exit', item.id)}>
      <Text style={styles.exitText}>나가기</Text>
    </RectButton>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      leftThreshold={40}
      rightThreshold={40}
    >
      <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
        {/* 썸네일 */}
        <View style={styles.avatarWrap}>
          {item.thumbnailUrl ? (
            <Image source={{ uri: item.thumbnailUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="leaf-outline" size={22} color="#4CAF50" />
            </View>
          )}
        </View>

        {/* 내용 */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{item.title}</Text>
              {item.participantCount != null && (
                <Text style={styles.count}>{item.participantCount}</Text>
              )}
              {item.pinned && (
                <Feather name="heart" size={12} color="#4CAF50" />
              )}
              {item.muted && (
                <Ionicons name="notifications-off" size={12} color="#9E9E9E" />
              )}
            </View>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>
          <Text style={styles.preview} numberOfLines={2}>{item.lastMessage}</Text>
        </View>

        {/* 미읽음 뱃지 */}
        {item.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  avatarWrap: { marginRight: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#EEE',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E4',
  },
  content: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    marginRight: 8,
  },
  name: { fontSize: 15, fontWeight: '700', color: '#222', flexShrink: 1 },
  count: { fontSize: 13, color: '#888' },
  time: { fontSize: 12, color: '#9E9E9E', flexShrink: 0 },
  preview: { fontSize: 13, color: '#555', lineHeight: 18 },
  badge: {
    backgroundColor: '#5B3E2B',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionDefault: { backgroundColor: '#F2F2F2' },
  actionActive: { backgroundColor: '#E5F5E6' },
  exitBtn: {
    width: 68,
    backgroundColor: '#EF5350',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
