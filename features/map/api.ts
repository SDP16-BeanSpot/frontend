import type { AnnouncementSummaryDTO, ApiResult, JobPosting, MapBounds } from './types';
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

/** 백엔드 AnnouncementSummaryDTO → 지도용 JobPosting */
const toJobPosting = (dto: AnnouncementSummaryDTO): JobPosting => ({
  id: String(dto.id),
  title: dto.title,
  company: dto.organizer ?? '',
  location: dto.region ?? '',
  latitude: dto.lat ?? 0,
  longitude: dto.lng ?? 0,
  category: dto.type ?? '',
  thumbnail: dto.thumbnailUrl ?? '',
  workType: dto.activityMethod ?? '',
  deadline: dto.recruitmentEnd ?? '',
});

/**
 * 지도에 보이는 영역 안의 공고 조회.
 * 백엔드 GET /api/announcement 의 geo 파라미터(minLat/maxLat/minLng/maxLng)를 사용합니다.
 */
export const fetchJobPostingsInBounds = async (
  bounds: MapBounds,
): Promise<JobPosting[]> => {
  const fallback = () =>
    MOCK_POSTINGS.filter(
      (p) =>
        p.latitude >= bounds.minLat &&
        p.latitude <= bounds.maxLat &&
        p.longitude >= bounds.minLng &&
        p.longitude <= bounds.maxLng,
    );

  if (!isApiConfigured()) return fallback();
  try {
    const page = await api.get<{ content: AnnouncementSummaryDTO[] }>('/api/announcement', {
      params: { ...bounds, size: 100 },
    });
    // 좌표가 없는 공고(온라인 활동 등)는 지도에 찍을 수 없으므로 제외
    return (page?.content ?? [])
      .filter((dto) => dto.lat != null && dto.lng != null)
      .map(toJobPosting);
  } catch {
    return fallback();
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
