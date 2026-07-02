import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';

import { fetchChatRoom } from '../../features/chat/api';
import { useChatContext } from '../../features/chat/ChatContext';
import type { ChatRoom, MessageItem } from '../../features/chat/types';
import ChatExitModal from '../../components/features/chat/ChatExitModal';

const ChatRoomScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { chats, loadChats, toggleMuted, togglePinned, exitChat } = useChatContext();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);

  useEffect(() => {
    const loadRoom = async () => {
      if (!id) {
        setRoom(null);
        return;
      }
      const data = await fetchChatRoom(String(id));
      setRoom(data);
    };

    void loadChats();
    loadRoom();
  }, [id, loadChats]);

  const messages = useMemo(() => room?.messages ?? [], [room]);
  const chatId = String(id ?? '');
  const currentChat = useMemo(
    () => chats.find((chat) => chat.id === chatId),
    [chatId, chats],
  );
  const isMuted = currentChat?.muted ?? false;
  const isPinned = currentChat?.pinned ?? false;
  const openReportList = () => {
    router.push((`/chat/report?chatId=${encodeURIComponent(chatId)}`) as Href);
  };

  const renderMessage = ({ item }: { item: MessageItem }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{item.text}</Text>
        </View>
      );
    }

    if (item.sender === 'me') {
      return (
        <View style={styles.myMessageRow}>
          <View style={styles.myBubble}>
            <Text style={styles.myText}>{item.text}</Text>
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.otherRow} activeOpacity={0.8} onPress={openReportList}>
        <Image source={{ uri: item.avatar }} style={styles.avatarSmall} />
        <View style={styles.otherBubble}>
          <Text style={styles.otherText}>{item.text}</Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={22} color="#212121" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{room?.title ?? '채팅'}</Text>
          {room?.participantCount != null && (
            <View style={styles.headerMeta}>
              <Ionicons name="people-outline" size={14} color="#757575" />
              <Text style={styles.headerMetaText}>{room.participantCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.headerIcon} onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#212121" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuBackdrop}>
          <Pressable style={styles.menuBackdropPressable} onPress={() => setMenuVisible(false)} />
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                setExitModalVisible(true);
              }}
            >
              <Ionicons name="exit-outline" size={18} color="#424242" />
              <Text style={styles.menuItemText}>채팅방 나가기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (chatId) {
                  toggleMuted(chatId);
                }
                setMenuVisible(false);
              }}
            >
              <Ionicons
                name={isMuted ? 'notifications-outline' : 'notifications-off-outline'}
                size={18}
                color="#424242"
              />
              <Text style={styles.menuItemText}>{isMuted ? '알림 켜기' : '알림 끄기'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (chatId) {
                  togglePinned(chatId);
                }
                setMenuVisible(false);
              }}
            >
              <Ionicons name={isPinned ? 'pin' : 'pin-outline'} size={18} color="#424242" />
              <Text style={styles.menuItemText}>{isPinned ? '상단 고정 해제' : '상단 고정하기'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.roomCard}>
        <Image source={{ uri: room?.thumbnailUrl }} style={styles.roomThumb} />
        <View style={styles.roomInfo}>
          <Text style={styles.roomTitle}>{room?.title ?? '-'}</Text>
          <Text style={styles.roomDeadline}>{room?.deadline ?? '-'}</Text>
          <View style={styles.roomMeta}>
            <Text style={styles.roomMetaText}>{room?.dday ?? ''}</Text>
          </View>
        </View>
      </View>

      <View style={styles.roomActions}>
        <TouchableOpacity
          style={styles.roomActionButton}
          onPress={() => {
            if (room?.postingId) {
              router.push(`/posting/${encodeURIComponent(room.postingId)}` as Href);
            }
          }}
        >
          <Text style={styles.roomActionText}>자세히 보기</Text>
          <Ionicons name="chevron-forward" size={13} color="#424242" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.roomActionButton}>
          <Text style={styles.roomActionText}>접어두기</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 90}
      >
        <View style={styles.messagesWrapper}>
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.emptyMascot}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>진행 중인 대화가 없어요.</Text>
              <Text style={styles.emptyDesc}>먼저 대화를 시작해 보세요!</Text>
            </View>
          ) : (
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>

        <View style={styles.inputBar}>
          <TextInput
            placeholder="메세지를 보내보세요"
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <ChatExitModal
        visible={exitModalVisible}
        onCancel={() => setExitModalVisible(false)}
        onConfirm={() => {
          setExitModalVisible(false);
          if (chatId) {
            void exitChat(chatId);
          }
          router.back();
        }}
      />
    </SafeAreaView>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#212121',
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  headerMetaText: {
    fontSize: 12,
    color: '#757575',
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    gap: 12,
  },
  roomThumb: {
    width: 54,
    height: 54,
    borderRadius: 10,
  },
  roomInfo: {
    flex: 1,
  },
  roomTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
  },
  roomDeadline: {
    fontSize: 11,
    color: '#757575',
    marginTop: 2,
  },
  roomMeta: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roomMetaText: {
    fontSize: 11,
    color: '#2DB400',
    fontWeight: '700',
  },
  roomActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  roomActionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  roomActionText: {
    fontSize: 12,
    color: '#424242',
    fontWeight: '600',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesWrapper: {
    flex: 1,
  },
  messageList: {
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  dateRow: {
    alignItems: 'center',
    marginVertical: 6,
  },
  dateText: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  otherRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  otherBubble: {
    backgroundColor: '#F1F1F1',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: '70%',
  },
  otherText: {
    fontSize: 13,
    color: '#212121',
    lineHeight: 18,
  },
  myMessageRow: {
    alignItems: 'flex-end',
    gap: 4,
  },
  myBubble: {
    backgroundColor: '#2DB400',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: '75%',
  },
  myText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  timeText: {
    fontSize: 10,
    color: '#9E9E9E',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    gap: 6,
  },
  emptyMascot: {
    width: 80,
    height: 80,
    opacity: 0.45,
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#212121',
    paddingVertical: 4,
  },
  sendButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2DB400',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBackdrop: {
    flex: 1,
    alignItems: 'flex-end',
  },
  menuBackdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  menuCard: {
    marginTop: 52,
    marginRight: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    width: 172,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 13,
    color: '#424242',
    fontWeight: '600',
  },
});
