import type { ApiResult, CampaignSchedule, DiaryData, DiaryPayload, TodoItem } from './types';
import { SCHEDULE_DATA, DIARY_DATA } from './mock';
import { api, isApiConfigured } from '../shared/apiClient';

// ⚠️ 일정(schedules) 관련 엔드포인트는 아직 백엔드에 없어 추정 경로 + mock 폴백입니다.
//    일기(diary)는 백엔드 DiaryController(/api/v1/diaries) 기준으로 맞춰져 있습니다.
//    해당 컨트롤러는 ApiResponse 봉투를 쓰지 않고 값을 그대로 반환합니다.

export const fetchSchedules = async (date: string): Promise<CampaignSchedule[]> => {
  if (!isApiConfigured()) return SCHEDULE_DATA[date] || [];
  try {
    return await api.get<CampaignSchedule[]>(`/calendar/schedules/${date}`);
  } catch {
    return SCHEDULE_DATA[date] || [];
  }
};

/** 월별 일기 목록 — GET /api/v1/diaries?year=&month= */
export const fetchMonthlyDiaries = async (
  year: number,
  month: number,
): Promise<DiaryData[]> => {
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const fallback = () =>
    Object.values(DIARY_DATA)
      .filter((d) => d.date.startsWith(monthPrefix))
      .sort((a, b) => b.date.localeCompare(a.date));

  if (!isApiConfigured()) return fallback();
  try {
    return await api.get<DiaryData[]>('/api/v1/diaries', { params: { year, month } });
  } catch {
    return fallback();
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

/** 일기 작성 — POST /api/v1/diaries */
export const createDiary = async (payload: DiaryPayload): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.post('/api/v1/diaries', payload);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to create diary', error);
    return { ok: false };
  }
};

/** 일기 수정 — PUT /api/v1/diaries/{id} */
export const updateDiary = async (id: number, payload: DiaryPayload): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.put(`/api/v1/diaries/${id}`, payload);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to update diary', error);
    return { ok: false };
  }
};
