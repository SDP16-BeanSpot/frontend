import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { deleteChat, fetchChatList, updateChatPreference } from './api';
import type { ChatItem } from './types';

type ChatPreferenceField = 'pinned' | 'muted';

type ChatContextValue = {
  chats: ChatItem[];
  loadChats: () => Promise<void>;
  togglePinned: (id: string) => void;
  toggleMuted: (id: string) => void;
  exitChat: (id: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

type ChatProviderProps = {
  children: React.ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const loadedRef = useRef(false);
  const loadingRef = useRef(false);

  const loadChats = useCallback(async () => {
    if (loadedRef.current || loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    try {
      const data = await fetchChatList();
      setChats(data);
      loadedRef.current = true;
    } finally {
      loadingRef.current = false;
    }
  }, []);

  const togglePreference = useCallback((id: string, field: ChatPreferenceField) => {
    let previousValue: boolean | undefined;
    let nextValue: boolean | undefined;

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== id) {
          return chat;
        }
        previousValue = chat[field];
        nextValue = !chat[field];
        return { ...chat, [field]: nextValue };
      }),
    );

    if (nextValue === undefined) {
      return;
    }

    updateChatPreference(id, { [field]: nextValue })
      .then((result) => {
        if (result.ok || result.skipped || previousValue === undefined) {
          return;
        }
        setChats((prev) =>
          prev.map((chat) => (chat.id === id ? { ...chat, [field]: previousValue } : chat)),
        );
      })
      .catch(() => {
        if (previousValue === undefined) {
          return;
        }
        setChats((prev) =>
          prev.map((chat) => (chat.id === id ? { ...chat, [field]: previousValue } : chat)),
        );
      });
  }, []);

  const togglePinned = useCallback(
    (id: string) => {
      togglePreference(id, 'pinned');
    },
    [togglePreference],
  );

  const toggleMuted = useCallback(
    (id: string) => {
      togglePreference(id, 'muted');
    },
    [togglePreference],
  );

  const exitChat = useCallback(async (id: string) => {
    let removedItem: ChatItem | null = null;
    let removedIndex = -1;

    setChats((prev) => {
      const next = [...prev];
      removedIndex = next.findIndex((chat) => chat.id === id);
      if (removedIndex >= 0) {
        removedItem = next.splice(removedIndex, 1)[0];
      }
      return next;
    });

    const result = await deleteChat(id);
    if (result.ok || result.skipped || !removedItem) {
      return;
    }

    setChats((prev) => {
      const next = [...prev];
      const insertAt = removedIndex < 0 || removedIndex > next.length ? next.length : removedIndex;
      next.splice(insertAt, 0, removedItem);
      return next;
    });
  }, []);

  const value = useMemo<ChatContextValue>(
    () => ({
      chats,
      loadChats,
      togglePinned,
      toggleMuted,
      exitChat,
    }),
    [chats, exitChat, loadChats, toggleMuted, togglePinned],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

