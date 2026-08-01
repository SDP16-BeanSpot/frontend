import type { ApiResult, PostingDetail } from './types';
import { MOCK_POSTINGS } from './mock';
import { api, isApiConfigured } from '../shared/apiClient';
import { addFavorite, fetchFavorites, removeFavorite } from '../calendar/api';

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

/**
 * 관심 공고 등록/해제.
 * 백엔드 CalendarController 의 관심 공고 API 를 사용합니다
 * (등록한 공고가 캘린더에 활동기간으로 표시되는 것과 같은 데이터).
 */
export const toggleFavoritePosting = async (
  id: string,
  isFavorite: boolean,
): Promise<ApiResult> => {
  const announcementId = Number(id);
  if (Number.isNaN(announcementId)) {
    console.warn('Invalid announcement id for favorite:', id);
    return { ok: false };
  }
  return isFavorite ? addFavorite(announcementId) : removeFavorite(announcementId);
};

/** 해당 공고가 관심 등록돼 있는지 (하트 초기 상태용) */
export const isFavoritePosting = async (id: string): Promise<boolean> => {
  const favorites = await fetchFavorites();
  return favorites.some((f) => String(f.announcementId) === id);
};
