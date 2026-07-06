import type {
  ApiResult,
  BackendChatItem,
  BlockedRoom,
  ChatItem,
  ChatReportPayload,
  ChatRoom,
} from './types';
import { MOCK_BLOCKED_ROOMS, MOCK_CHAT_DATA, MOCK_ROOMS } from './mock';
import { api, isApiConfigured, unwrap, type ApiEnvelope } from '../shared/apiClient';

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

/**
 * 메시지 신고 — 실제 확인된 엔드포인트: POST /api/chat/messages/{messageId}/report
 * (백엔드는 "채팅방" 단위가 아니라 "메시지" 단위로 신고를 받습니다.)
 */
export const createChatReport = async (
  messageId: string,
  payload: ChatReportPayload,
): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await unwrap(
      await api.post<ApiEnvelope<unknown>>(`/api/chat/messages/${messageId}/report`, payload),
    );
    return { ok: true };
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : '';
    console.warn('Failed to create chat report', error);
    return { ok: false, message };
  }
};

/**
 * ⚠️ 백엔드에 "내 신고 내역/차단된 채팅방" 조회 엔드포인트가 없습니다
 * (관리자용 GET /api/admin/reports 만 존재). 확인 전까지 mock 으로만 동작합니다.
 */
export const fetchBlockedRooms = async (): Promise<BlockedRoom[]> => {
  if (!isApiConfigured()) return MOCK_BLOCKED_ROOMS;
  try {
    return await api.get<BlockedRoom[]>('/api/chat/rooms/blocked');
  } catch {
    return MOCK_BLOCKED_ROOMS;
  }
};

/** ⚠️ 대응 엔드포인트 미확인 — 확인 전까지 로컬 상태에서만 제거 처리됩니다. */
export const unblockChatRoom = async (roomId: string): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: true, skipped: true };
  try {
    await api.del(`/api/chat/rooms/${roomId}/block`);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to unblock chat room', error);
    return { ok: false };
  }
};
