import type { ApiResult, Banner, Garden } from './types';
import { MOCK_BANNERS, MOCK_GARDENS, MOCK_POPULAR_GARDENS } from './mock';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

export const fetchBanners = async (): Promise<Banner[]> => {
  if (!API_BASE_URL) {
    return MOCK_BANNERS;
  }
  const response = await fetch(`${API_BASE_URL}/home/banners`);
  if (!response.ok) {
    return MOCK_BANNERS;
  }
  return (await response.json()) as Banner[];
};

export const fetchGardens = async (): Promise<Garden[]> => {
  if (!API_BASE_URL) {
    return MOCK_GARDENS;
  }
  const response = await fetch(`${API_BASE_URL}/home/gardens`);
  if (!response.ok) {
    return MOCK_GARDENS;
  }
  return (await response.json()) as Garden[];
};

export const fetchPopularGardens = async (): Promise<Garden[]> => {
    if (!API_BASE_URL) {
      return MOCK_POPULAR_GARDENS;
    }
    const response = await fetch(`${API_BASE_URL}/home/gardens/popular`);
    if (!response.ok) {
      return MOCK_POPULAR_GARDENS;
    }
    return (await response.json()) as Garden[];
  };

export const toggleFavoriteGarden = async (id: string, isFavorite: boolean): Promise<ApiResult> => {
  if (!API_BASE_URL) {
    // In a real app, you'd update the mock data state here
    return { ok: true, skipped: true };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/home/gardens/${id}/favorite`, {
      method: 'POST', // or PUT
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFavorite }),
    });
    return { ok: response.ok };
  } catch (error) {
    console.warn('Failed to toggle favorite', error);
    return { ok: false };
  }
};
