import type { JobPosting, ApiResult } from './types';
import { MOCK_POSTINGS } from './mock';
import { api, isApiConfigured } from '../shared/apiClient';
import { addFavorite, fetchFavorites, removeFavorite } from '../calendar/api';

// ⚠️ 지도 공고 목록(/map/postings) 경로는 아직 추정값입니다.
//    관심 공고(favorite)는 백엔드 CalendarController 의 실제 API 를 사용합니다.

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

/** 관심 공고 등록/해제 (백엔드 CalendarController 의 관심 공고 API) */
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

/** 이미 등록해둔 관심 공고 id 목록 (하트 초기 상태 복원용) */
export const fetchFavoritePostingIds = async (): Promise<Set<string>> => {
  const favorites = await fetchFavorites();
  return new Set(favorites.map((f) => String(f.announcementId)));
};
