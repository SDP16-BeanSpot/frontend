import type { ApiResult, BackendChatItem, ChatItem, ChatReportPayload, ChatRoom } from './types';
import { MOCK_CHAT_DATA, MOCK_ROOMS } from './mock';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
const ACCESS_TOKEN_KEY = 'user_jwt_token';

const getStoredAuthToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

const getAuthHeader = async (): Promise<Record<string, string>> => {
  const storedToken = await getStoredAuthToken();
  const envToken = process.env.EXPO_PUBLIC_AUTH_TOKEN;
  const token = storedToken || envToken;
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const attachChatUiState = (items: BackendChatItem[]): ChatItem[] =>
  items.map((item) => ({
    ...item,
    pinned: false,
    muted: false,
  }));

export const fetchChatList = async (): Promise<ChatItem[]> => {
  if (!API_BASE_URL) {
    return attachChatUiState(MOCK_CHAT_DATA);
  }

  const authHeader = await getAuthHeader();
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: 'GET',
    headers: authHeader,
  });

  if (!response.ok) {
    return attachChatUiState(MOCK_CHAT_DATA);
  }

  const data = (await response.json()) as BackendChatItem[];
  return attachChatUiState(data);
};

export const fetchChatRoom = async (id: string): Promise<ChatRoom | null> => {
  if (!API_BASE_URL) {
    return MOCK_ROOMS.find((room) => room.id === id) ?? null;
  }

  const authHeader = await getAuthHeader();
  const response = await fetch(`${API_BASE_URL}/chats/${id}`, {
    method: 'GET',
    headers: authHeader,
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ChatRoom;
};

export const updateChatPreference = async (
  id: string,
  payload: Partial<Pick<ChatItem, 'pinned' | 'muted'>>,
): Promise<ApiResult> => {
  if (!API_BASE_URL) {
    return { ok: false, skipped: true };
  }

  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/chats/${id}/preferences`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify(payload),
    });

    return { ok: response.ok };
  } catch (error) {
    console.warn('Failed to update chat preference', error);
    return { ok: false };
  }
};

export const deleteChat = async (id: string): Promise<ApiResult> => {
  if (!API_BASE_URL) {
    return { ok: false, skipped: true };
  }

  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/chats/${id}`, {
      method: 'DELETE',
      headers: authHeader,
    });
    return { ok: response.ok };
  } catch (error) {
    console.warn('Failed to delete chat', error);
    return { ok: false };
  }
};

export const createChatReport = async (
  chatId: string,
  payload: ChatReportPayload,
): Promise<ApiResult> => {
  if (!API_BASE_URL) {
    return { ok: false, skipped: true };
  }

  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = '';
      try {
        const body = (await response.json()) as { message?: string };
        message = body.message ?? '';
      } catch {
        message = '';
      }
      return { ok: false, message };
    }

    return { ok: true };
  } catch (error) {
    console.warn('Failed to create chat report', error);
    return { ok: false };
  }
};
