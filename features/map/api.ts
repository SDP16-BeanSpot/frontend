import type { JobPosting, ApiResult } from './types';
import { MOCK_POSTINGS } from './mock';
import { api, isApiConfigured } from '../shared/apiClient';

// ⚠️ 엔드포인트 경로는 추정값입니다. Swagger 확인 후 수정하세요.

export const fetchJobPostings = async (): Promise<JobPosting[]> => {
  if (!isApiConfigured()) {
    // Mimic network delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_POSTINGS), 800);
    });
  }
  try {
    return await api.get<JobPosting[]>('/map/postings');
  } catch {
    return MOCK_POSTINGS;
  }
};

export const toggleFavoritePosting = async (
  id: string,
  isFavorite: boolean,
): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: true, skipped: true };
  try {
    await api.post(`/map/postings/${id}/favorite`, { isFavorite });
    return { ok: true };
  } catch (error) {
    console.warn('Failed to toggle favorite', error);
    return { ok: false };
  }
};
