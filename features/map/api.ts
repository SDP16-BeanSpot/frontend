import type { JobPosting, ApiResult } from './types';
import { MOCK_POSTINGS } from './mock';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

export const fetchJobPostings = async (): Promise<JobPosting[]> => {
  if (!API_BASE_URL) {
    // Mimic network delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_POSTINGS);
      }, 800);
    });
  }

  const response = await fetch(`${API_BASE_URL}/map/postings`);
  if (!response.ok) {
    // Fallback to mock data on API failure
    return MOCK_POSTINGS;
  }
  return (await response.json()) as JobPosting[];
};

export const toggleFavoritePosting = async (id: string, isFavorite: boolean): Promise<ApiResult> => {
    if (!API_BASE_URL) {
      return { ok: true, skipped: true };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/map/postings/${id}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite }),
      });
      return { ok: response.ok };
    } catch (error) {
      console.warn('Failed to toggle favorite', error);
      return { ok: false };
    }
  };
