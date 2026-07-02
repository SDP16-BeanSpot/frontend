import type { ApiResult, PostingDetail } from './types';
import { MOCK_POSTINGS } from './mock';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

export const fetchPostingDetail = async (id: string): Promise<PostingDetail | null> => {
  if (!API_BASE_URL) {
    return MOCK_POSTINGS[id] ?? null;
  }
  const response = await fetch(`${API_BASE_URL}/postings/${id}`);
  if (!response.ok) {
    return MOCK_POSTINGS[id] ?? null;
  }
  return (await response.json()) as PostingDetail;
};

export const searchPostings = async (query: string): Promise<PostingDetail[]> => {
  const all = Object.values(MOCK_POSTINGS);
  if (!API_BASE_URL) {
    if (!query.trim()) return all;
    return all.filter(
      (p) =>
        p.title.includes(query) ||
        p.category.includes(query) ||
        p.organizer.includes(query),
    );
  }
  const response = await fetch(
    `${API_BASE_URL}/postings/search?q=${encodeURIComponent(query)}`,
  );
  if (!response.ok) return [];
  return (await response.json()) as PostingDetail[];
};

export const toggleFavoritePosting = async (
  id: string,
  isFavorite: boolean,
): Promise<ApiResult> => {
  if (!API_BASE_URL) {
    return { ok: true, skipped: true };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/postings/${id}/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFavorite }),
    });
    return { ok: response.ok };
  } catch {
    return { ok: false };
  }
};
