import type { ApiResult, CampaignSchedule, DiaryData, TodoItem } from './types';
import { SCHEDULE_DATA, DIARY_DATA } from './mock';
import { api, isApiConfigured } from '../shared/apiClient';

// ⚠️ 엔드포인트 경로는 추정값입니다. Swagger 확인 후 수정하세요.

export const fetchSchedules = async (date: string): Promise<CampaignSchedule[]> => {
  if (!isApiConfigured()) return SCHEDULE_DATA[date] || [];
  try {
    return await api.get<CampaignSchedule[]>(`/calendar/schedules/${date}`);
  } catch {
    return SCHEDULE_DATA[date] || [];
  }
};

export const fetchDiary = async (date: string): Promise<DiaryData | null> => {
  if (!isApiConfigured()) return DIARY_DATA[date] || null;
  try {
    return await api.get<DiaryData>(`/calendar/diary/${date}`);
  } catch {
    return DIARY_DATA[date] || null;
  }
};

export const updateTodo = async (
  scheduleId: string,
  todoId: string,
  payload: Partial<Pick<TodoItem, 'completed'>>,
): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.patch(`/calendar/schedules/${scheduleId}/todos/${todoId}`, payload);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to update todo', error);
    return { ok: false };
  }
};

export const saveDiary = async (
  date: string,
  payload: Omit<DiaryData, 'id'>,
): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.post(`/calendar/diary/${date}`, payload);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to save diary', error);
    return { ok: false };
  }
};
