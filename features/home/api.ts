import type { ApiResult, Banner, Garden } from './types';
import { MOCK_BANNERS, MOCK_GARDENS, MOCK_POPULAR_GARDENS } from './mock';
import { api, isApiConfigured } from '../shared/apiClient';

// ⚠️ 엔드포인트 경로는 추정값입니다. Swagger 확인 후 수정하세요.

export const fetchBanners = async (): Promise<Banner[]> => {
  if (!isApiConfigured()) return MOCK_BANNERS;
  try {
    return await api.get<Banner[]>('/home/banners');
  } catch {
    return MOCK_BANNERS;
  }
};

export const fetchGardens = async (): Promise<Garden[]> => {
  if (!isApiConfigured()) return MOCK_GARDENS;
  try {
    return await api.get<Garden[]>('/home/gardens');
  } catch {
    return MOCK_GARDENS;
  }
};

export const fetchPopularGardens = async (): Promise<Garden[]> => {
  if (!isApiConfigured()) return MOCK_POPULAR_GARDENS;
  try {
    return await api.get<Garden[]>('/home/gardens/popular');
  } catch {
    return MOCK_POPULAR_GARDENS;
  }
};

export const toggleFavoriteGarden = async (
  id: string,
  isFavorite: boolean,
): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: true, skipped: true };
  try {
    await api.post(`/home/gardens/${id}/favorite`, { isFavorite });
    return { ok: true };
  } catch (error) {
    console.warn('Failed to toggle favorite', error);
    return { ok: false };
  }
};
