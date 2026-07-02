import type { ApiResult, PostingDetail } from './types';
import { MOCK_POSTINGS } from './mock';
import { api, isApiConfigured } from '../shared/apiClient';

// ⚠️ 엔드포인트 경로는 추정값입니다. Swagger 확인 후 수정하세요.

export const fetchPostingDetail = async (id: string): Promise<PostingDetail | null> => {
  if (!isApiConfigured()) return MOCK_POSTINGS[id] ?? null;
  try {
    return await api.get<PostingDetail>(`/postings/${id}`);
  } catch {
    return MOCK_POSTINGS[id] ?? null;
  }
};

export const searchPostings = async (query: string): Promise<PostingDetail[]> => {
  const all = Object.values(MOCK_POSTINGS);
  if (!isApiConfigured()) {
    if (!query.trim()) return all;
    return all.filter(
      (p) =>
        p.title.includes(query) ||
        p.category.includes(query) ||
        p.organizer.includes(query),
    );
  }
  try {
    return await api.get<PostingDetail[]>('/postings/search', { params: { q: query } });
  } catch {
    return [];
  }
};

export const toggleFavoritePosting = async (
  id: string,
  isFavorite: boolean,
): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: true, skipped: true };
  try {
    await api.post(`/postings/${id}/favorite`, { isFavorite });
    return { ok: true };
  } catch {
    return { ok: false };
  }
};
