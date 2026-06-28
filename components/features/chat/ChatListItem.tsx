import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import type { ChatItem } from '../../../features/chat/types';

type ChatListItemProps = {
  item: ChatItem;
  onPress: () => void;
  onAction: (action: 'pin' | 'mute' | 'exit', id: string) => void;
};

const ChatListItem = ({ item, onPress, onAction }: ChatListItemProps) => {
  const renderLeftActions = () => (
    <View style={styles.leftActions}>
      <RectButton
        style={[styles.leftActionButton, item.pinned ? styles.leftActionActive : styles.leftActionPin]}
        onPress={() => onAction('pin', item.id)}
      >
        <Ionicons name="pin" size={18} color={item.pinned ? '#2E7D32' : '#6B6B6B'} />
      </RectButton>
      <RectButton
        style={[styles.leftActionButton, item.muted ? styles.leftActionActive : styles.leftActionMute]}
        onPress={() => onAction('mute', item.id)}
      >
        <Ionicons
          name={item.muted ? 'notifications-off' : 'notifications'}
          size={18}
          color={item.muted ? '#2E7D32' : '#6B6B6B'}
        />
      </RectButton>
    </View>
  );

  const renderRightActions = () => (
    <RectButton style={styles.rightAction} onPress={() => onAction('exit', item.id)}>
      <Ionicons name="exit-outline" size={22} color="#FFFFFF" />
    </RectButton>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      leftThreshold={40}
      rightThreshold={40}
    >
      <TouchableOpacity style={styles.chatItem} onPress={onPress}>
        <Image source={{ uri: item.thumbnailUrl }} style={styles.avatar} />
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <View style={styles.nameRow}>
              <Text style={styles.chatName}>{item.title}</Text>
              {item.pinned && <Ionicons name="pin" size={12} color="#7D7D7D" />}
              {item.muted && <Ionicons name="notifications-off" size={12} color="#7D7D7D" />}
            </View>
            <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.chatLastMessage} numberOfLines={2}>
            {item.lastMessage}
          </Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#cccccc',
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatTimestamp: {
    fontSize: 12,
    color: 'gray',
  },
  chatLastMessage: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: '#5B3E2B',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    gap: 8,
  },
  leftActionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftActionPin: {
    backgroundColor: '#F2F2F2',
  },
  leftActionMute: {
    backgroundColor: '#F2F2F2',
  },
  leftActionActive: {
    backgroundColor: '#E5F5E6',
  },
  rightAction: {
    width: 56,
    backgroundColor: '#EF5350',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
