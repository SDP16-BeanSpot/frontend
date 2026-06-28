import type { ApiResult, CampaignSchedule, DiaryData, TodoItem } from './types';
import { SCHEDULE_DATA, DIARY_DATA } from './mock';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

export const fetchSchedules = async (date: string): Promise<CampaignSchedule[]> => {
  if (!API_BASE_URL) {
    return SCHEDULE_DATA[date] || [];
  }

  const response = await fetch(`${API_BASE_URL}/calendar/schedules/${date}`);
  if (!response.ok) {
    return SCHEDULE_DATA[date] || [];
  }
  return (await response.json()) as CampaignSchedule[];
};

export const fetchDiary = async (date: string): Promise<DiaryData | null> => {
  if (!API_BASE_URL) {
    return DIARY_DATA[date] || null;
  }
  const response = await fetch(`${API_BASE_URL}/calendar/diary/${date}`);
  if (!response.ok) {
    return DIARY_DATA[date] || null;
  }
  return (await response.json()) as DiaryData;
};

export const updateTodo = async (
  scheduleId: string,
  todoId: string,
  payload: Partial<Pick<TodoItem, 'completed'>>,
): Promise<ApiResult> => {
  if (!API_BASE_URL) {
    return { ok: false, skipped: true };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/calendar/schedules/${scheduleId}/todos/${todoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { ok: response.ok };
  } catch (error) {
    console.warn('Failed to update todo', error);
    return { ok: false };
  }
};

export const saveDiary = async (
  date: string,
  payload: Omit<DiaryData, 'id'>,
): Promise<ApiResult> => {
  if (!API_BASE_URL) {
    return { ok: false, skipped: true };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/calendar/diary/${date}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { ok: response.ok };
  } catch (error) {
    console.warn('Failed to save diary', error);
    return { ok: false };
  }
};
