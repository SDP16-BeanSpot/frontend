import type { ApiResult, BackendChatItem, ChatItem, ChatReportPayload, ChatRoom } from './types';
import { MOCK_CHAT_DATA, MOCK_ROOMS } from './mock';
import { api, isApiConfigured } from '../shared/apiClient';

// ⚠️ 엔드포인트 경로는 추정값입니다. Swagger 확인 후 수정하세요.

const attachChatUiState = (items: BackendChatItem[]): ChatItem[] =>
  items.map((item) => ({
    ...item,
    pinned: false,
    muted: false,
  }));

export const fetchChatList = async (): Promise<ChatItem[]> => {
  if (!isApiConfigured()) return attachChatUiState(MOCK_CHAT_DATA);
  try {
    const data = await api.get<BackendChatItem[]>('/chats');
    return attachChatUiState(data);
  } catch {
    return attachChatUiState(MOCK_CHAT_DATA);
  }
};

export const fetchChatRoom = async (id: string): Promise<ChatRoom | null> => {
  if (!isApiConfigured()) return MOCK_ROOMS.find((room) => room.id === id) ?? null;
  try {
    return await api.get<ChatRoom>(`/chats/${id}`);
  } catch {
    return null;
  }
};

export const updateChatPreference = async (
  id: string,
  payload: Partial<Pick<ChatItem, 'pinned' | 'muted'>>,
): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.patch(`/chats/${id}/preferences`, payload);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to update chat preference', error);
    return { ok: false };
  }
};

export const deleteChat = async (id: string): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.del(`/chats/${id}`);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to delete chat', error);
    return { ok: false };
  }
};

export const createChatReport = async (
  chatId: string,
  payload: ChatReportPayload,
): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.post(`/chats/${chatId}/reports`, payload);
    return { ok: true };
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : '';
    console.warn('Failed to create chat report', error);
    return { ok: false, message };
  }
};
