import type { FeedbackPayload, Notice, SupportApiResult } from './types';
import { MOCK_NOTICES } from './mock';
import { api, isApiConfigured } from '../shared/apiClient';

// ⚠️ 백엔드 NoticeController 는 파일이 없고, FeedbackController 는 빈 껍데기입니다.
// 확인 전까지 mock 으로만 동작합니다.

export const fetchNotices = async (): Promise<Notice[]> => {
  if (!isApiConfigured()) return MOCK_NOTICES;
  try {
    return await api.get<Notice[]>('/api/notices');
  } catch {
    return MOCK_NOTICES;
  }
};

export const fetchNoticeDetail = async (id: string): Promise<Notice | null> => {
  if (!isApiConfigured()) return MOCK_NOTICES.find((n) => n.id === id) ?? null;
  try {
    return await api.get<Notice>(`/api/notices/${id}`);
  } catch {
    return MOCK_NOTICES.find((n) => n.id === id) ?? null;
  }
};

export const submitFeedback = async (payload: FeedbackPayload): Promise<SupportApiResult> => {
  if (!isApiConfigured()) return { ok: true, skipped: true };
  try {
    await api.post('/api/feedback', payload);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to submit feedback', error);
    return { ok: false };
  }
};
