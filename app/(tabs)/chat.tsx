import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import ChatTabsHeader from '../../components/features/chat/ChatTabsHeader';
import ChatEmptyState from '../../components/features/chat/ChatEmptyState';
import ChatExitModal from '../../components/features/chat/ChatExitModal';
import ChatListItem from '../../components/features/chat/ChatListItem';
import { useChatContext } from '../../features/chat/ChatContext';

const ChatScreen = () => {
  const router = useRouter();
  const { chats, loadChats, togglePinned, toggleMuted, exitChat } = useChatContext();
  const [exitTargetId, setExitTargetId] = useState<string | null>(null);

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  const filteredChats = useMemo(() => {
    return [...chats].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [chats]);

  const handleSwipeAction = useCallback((action: 'pin' | 'mute' | 'exit', id: string) => {
    if (action === 'exit') {
      setExitTargetId(id);
      return;
    }

    if (action === 'pin') {
      togglePinned(id);
      return;
    }

    toggleMuted(id);
  }, [toggleMuted, togglePinned]);

  const handleExitConfirm = useCallback(() => {
    if (!exitTargetId) {
      return;
    }

    const targetId = exitTargetId;
    setExitTargetId(null);
    void exitChat(targetId);
  }, [exitChat, exitTargetId]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredChats}
        renderItem={({ item }) => (
          <ChatListItem
            item={item}
            onPress={() =>
              router.push({
                pathname: '/chat/[id]',
                params: { id: item.id },
              })
            }
            onAction={handleSwipeAction}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<ChatTabsHeader />}
        ListEmptyComponent={ChatEmptyState}
        contentContainerStyle={
          filteredChats.length === 0 ? styles.emptyListContainer : undefined
        }
      />
      <ChatExitModal
        visible={exitTargetId !== null}
        onCancel={() => setExitTargetId(null)}
        onConfirm={handleExitConfirm}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  emptyListContainer: {
    flex: 1,
  },
});
