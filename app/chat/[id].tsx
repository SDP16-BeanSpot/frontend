import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  GestureResponderEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';

import { fetchChatRoom } from '../../features/chat/api';
import { useChatContext } from '../../features/chat/ChatContext';
import { useChatSocket } from '../../features/chat/useChatSocket';
import type { ChatRoom, MessageItem, ReactionType } from '../../features/chat/types';
import { REACTION_ICON_NAMES } from '../../features/chat/types';
import ChatExitModal from '../../components/features/chat/ChatExitModal';
import MessageActionMenu from '../../components/features/chat/MessageActionMenu';

const formatNowTime = () => {
  const now = new Date();
  const hour = now.getHours();
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${period} ${displayHour}:${minute}`;
};

const truncate = (text: string, max = 20) =>
  text.length > max ? `${text.slice(0, max)}...` : text;

const ChatRoomScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { chats, loadChats, toggleMuted, togglePinned, exitChat } = useChatContext();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);

  // 메시지 롱프레스 액션 메뉴
  const [actionTarget, setActionTarget] = useState<MessageItem | null>(null);
  const [actionAnchor, setActionAnchor] = useState<{ x: number; y: number } | null>(null);

  // 답장 작성 중인 대상 메시지
  const [replyTarget, setReplyTarget] = useState<MessageItem | null>(null);

  const chatId = String(id ?? '');

  useEffect(() => {
    const loadRoom = async () => {
      if (!id) {
        setRoom(null);
        return;
      }
      const data = await fetchChatRoom(String(id));
      setRoom(data);
      setMessages(data?.messages ?? []);
    };

    void loadChats();
    loadRoom();
  }, [id, loadChats]);

  // 실시간 수신 (WS_URL 미설정이면 내부적으로 아무 동작 안 함)
  const { sendMessage: socketSendMessage, sendReaction: socketSendReaction } = useChatSocket(
    chatId || undefined,
    (incoming) => {
      setMessages((prev) => [
        ...prev,
        {
          id: incoming.messageId ?? `incoming-${Date.now()}`,
          type: 'message',
          sender: 'other',
          senderName: incoming.senderNickname,
          text: incoming.content,
          time: formatNowTime(),
          parentMsgId: incoming.parentMsgId,
        },
      ]);
    },
  );

  const currentChat = useMemo(
    () => chats.find((chat) => chat.id === chatId),
    [chatId, chats],
  );
  const isMuted = currentChat?.muted ?? false;
  const isPinned = currentChat?.pinned ?? false;

  const messageById = useMemo(() => {
    const map = new Map<string, MessageItem>();
    messages.forEach((m) => map.set(m.id, m));
    return map;
  }, [messages]);

  const handleLongPressMessage = (item: MessageItem, event: GestureResponderEvent) => {
    setActionTarget(item);
    setActionAnchor({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
  };

  const closeActionMenu = () => {
    setActionTarget(null);
    setActionAnchor(null);
  };

  const handleToggleReaction = useCallback(
    (messageId: string, type: ReactionType) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId || m.type !== 'message') return m;
          const reactions = m.reactions ?? [];
          const existing = reactions.find((r) => r.type === type);
          const myPrevious = reactions.find((r) => r.reacted);

          let next = reactions;
          if (existing?.reacted) {
            // 같은 리액션 다시 누르면 취소
            next = reactions
              .map((r) => (r.type === type ? { ...r, count: r.count - 1, reacted: false } : r))
              .filter((r) => r.count > 0);
          } else {
            // 다른 리액션이 있었으면 그건 취소하고 새 리액션 추가
            next = reactions
              .map((r) =>
                myPrevious && r.type === myPrevious.type
                  ? { ...r, count: r.count - 1, reacted: false }
                  : r,
              )
              .filter((r) => r.count > 0);
            const target = next.find((r) => r.type === type);
            if (target) {
              next = next.map((r) => (r.type === type ? { ...r, count: r.count + 1, reacted: true } : r));
            } else {
              next = [...next, { type, count: 1, reacted: true }];
            }
          }
          return { ...m, reactions: next };
        }),
      );
      socketSendReaction(messageId, type);
    },
    [socketSendReaction],
  );

  const handleSelectReactionFromMenu = (type: ReactionType) => {
    if (actionTarget) {
      handleToggleReaction(actionTarget.id, type);
    }
    closeActionMenu();
  };

  const handleReply = () => {
    if (actionTarget) {
      setReplyTarget(actionTarget);
    }
    closeActionMenu();
  };

  const handleReport = () => {
    if (actionTarget) {
      router.push(
        `/chat/report?chatId=${encodeURIComponent(chatId)}&messageId=${encodeURIComponent(actionTarget.id)}` as Href,
      );
    }
    closeActionMenu();
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newMessage: MessageItem = {
      id: `local-${Date.now()}`,
      type: 'message',
      sender: 'me',
      text: trimmed,
      time: formatNowTime(),
      parentMsgId: replyTarget?.id,
      parentPreview: replyTarget && replyTarget.type === 'message' ? truncate(replyTarget.text) : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    socketSendMessage(trimmed, replyTarget?.id);
    setInputValue('');
    setReplyTarget(null);
  };

  const renderReactions = (item: Extract<MessageItem, { type: 'message' }>) => {
    const reactions = item.reactions ?? [];
    if (reactions.length === 0) return null;
    return (
      <View style={[styles.reactionsRow, item.sender === 'me' && styles.reactionsRowMine]}>
        {reactions.map((r) => (
          <TouchableOpacity
            key={r.type}
            style={[styles.reactionChip, r.reacted && styles.reactionChipActive]}
            onPress={() => handleToggleReaction(item.id, r.type)}
          >
            <MaterialCommunityIcons name={REACTION_ICON_NAMES[r.type] as any} size={13} color="#7D5A44" />
            <Text style={styles.reactionChipText}>{r.count}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReplyQuote = (item: Extract<MessageItem, { type: 'message' }>) => {
    if (!item.parentMsgId) return null;
    const parent = messageById.get(item.parentMsgId);
    const preview =
      item.parentPreview ?? (parent && parent.type === 'message' ? truncate(parent.text) : '삭제된 메시지');
    return (
      <View style={styles.replyQuote}>
        <Feather name="corner-up-left" size={11} color="#888" />
        <Text style={styles.replyQuoteText} numberOfLines={1}>
          {preview}
        </Text>
      </View>
    );
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
          <TouchableOpacity
            style={styles.myBubble}
            activeOpacity={0.85}
            onLongPress={(e) => handleLongPressMessage(item, e)}
            delayLongPress={250}
          >
            {renderReplyQuote(item)}
            <Text style={styles.myText}>{item.text}</Text>
          </TouchableOpacity>
          {renderReactions(item)}
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      );
    }

    return (
      <View style={styles.otherRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatarSmall} />
        <View style={styles.otherCol}>
          {item.senderName && <Text style={styles.senderName}>{item.senderName}</Text>}
          <View style={styles.otherBubbleRow}>
            <TouchableOpacity
              style={styles.otherBubble}
              activeOpacity={0.85}
              onLongPress={(e) => handleLongPressMessage(item, e)}
              delayLongPress={250}
            >
              {renderReplyQuote(item)}
              <Text style={styles.otherText}>{item.text}</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          {renderReactions(item)}
        </View>
      </View>
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

        {/* 답장 대상 미리보기 바 */}
        {replyTarget && replyTarget.type === 'message' && (
          <View style={styles.replyBar}>
            <View style={styles.replyBarContent}>
              <Feather name="corner-up-left" size={13} color="#4CAF50" />
              <Text style={styles.replyBarLabel}>
                {replyTarget.sender === 'me' ? '나' : replyTarget.senderName ?? '상대방'}님에게 답장
              </Text>
              <Text style={styles.replyBarPreview} numberOfLines={1}>
                {truncate(replyTarget.text, 24)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setReplyTarget(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x" size={16} color="#999" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputBar}>
          <TextInput
            placeholder="메세지를 보내보세요"
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <MessageActionMenu
        visible={actionTarget !== null}
        anchor={actionAnchor}
        canReport={actionTarget?.type === 'message' && actionTarget.sender === 'other'}
        onSelectReaction={handleSelectReactionFromMenu}
        onReply={handleReply}
        onReport={handleReport}
        onClose={closeActionMenu}
      />

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
    alignItems: 'flex-start',
    gap: 8,
  },
  otherCol: { flex: 1, alignItems: 'flex-start' },
  senderName: { fontSize: 11, color: '#888', marginBottom: 3 },
  otherBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginTop: 14,
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
  replyQuote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 6,
  },
  replyQuoteText: { fontSize: 11, color: '#666', flexShrink: 1 },
  reactionsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  reactionsRowMine: { justifyContent: 'flex-end' },
  reactionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F5F0EA',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  reactionChipActive: { backgroundColor: '#E8DCC8' },
  reactionChipText: { fontSize: 11, color: '#7D5A44', fontWeight: '600' },
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
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FAF0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  replyBarContent: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  replyBarLabel: { fontSize: 11, fontWeight: '700', color: '#4CAF50' },
  replyBarPreview: { fontSize: 11, color: '#666', flexShrink: 1 },
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
