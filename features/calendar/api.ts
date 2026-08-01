import type { ApiResult, CalendarSchedule, DiaryData, DiaryPayload, TodoItem } from './types';
import { MOCK_SCHEDULES, MOCK_TODOS, DIARY_DATA } from './mock';
import { api, isApiConfigured } from '../shared/apiClient';

// 캘린더/일기/할일 모두 백엔드 실제 컨트롤러 기준입니다.
//   CalendarController  /api/v1/calendar   (관심 공고 일정, 관심 공고 등록·해제)
//   TodoController      /api/v1/todos
//   DiaryController     /api/v1/diaries
// 세 컨트롤러 모두 ApiResponse 봉투를 쓰지 않고 값을 그대로 반환합니다.

/** 월별 일정 — GET /api/v1/calendar/schedules?year=&month= */
export const fetchMonthlySchedules = async (
  year: number,
  month: number,
): Promise<CalendarSchedule[]> => {
  if (!isApiConfigured()) return MOCK_SCHEDULES;
  try {
    return await api.get<CalendarSchedule[]>('/api/v1/calendar/schedules', {
      params: { year, month },
    });
  } catch {
    return MOCK_SCHEDULES;
  }
};

/** 내 관심 공고 목록 — GET /api/v1/calendar/favorites */
export const fetchFavorites = async (): Promise<CalendarSchedule[]> => {
  if (!isApiConfigured()) return MOCK_SCHEDULES;
  try {
    return await api.get<CalendarSchedule[]>('/api/v1/calendar/favorites');
  } catch {
    return MOCK_SCHEDULES;
  }
};

/** 관심 공고 등록 — POST /api/v1/calendar/favorites/{announcementId} */
export const addFavorite = async (announcementId: number): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.post(`/api/v1/calendar/favorites/${announcementId}`);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to add favorite', error);
    return { ok: false };
  }
};

/** 관심 공고 해제 — DELETE /api/v1/calendar/favorites/{announcementId} */
export const removeFavorite = async (announcementId: number): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.del(`/api/v1/calendar/favorites/${announcementId}`);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to remove favorite', error);
    return { ok: false };
  }
};

/** 일별 할 일 — GET /api/v1/todos?date= */
export const fetchTodosByDate = async (date: string): Promise<TodoItem[]> => {
  const fallback = () => MOCK_TODOS.filter((t) => t.date === date);
  if (!isApiConfigured()) return fallback();
  try {
    return await api.get<TodoItem[]>('/api/v1/todos', { params: { date } });
  } catch {
    return fallback();
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

/**
 * 할 일 완료/미완료 토글 — PATCH /api/v1/todos/{todoId}/status
 * 서버가 상태를 뒤집는 방식이라 클라이언트는 목표 값을 보내지 않습니다.
 */
export const toggleTodoStatus = async (todoId: number): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.patch(`/api/v1/todos/${todoId}/status`);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to toggle todo', error);
    return { ok: false };
  }
};

/** 할 일 추가 — POST /api/v1/todos */
export const createTodo = async (payload: {
  content: string;
  date: string;
  announcementId?: number;
}): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.post('/api/v1/todos', payload);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to create todo', error);
    return { ok: false };
  }
};

/** 할 일 삭제 — DELETE /api/v1/todos/{todoId} */
export const deleteTodo = async (todoId: number): Promise<ApiResult> => {
  if (!isApiConfigured()) return { ok: false, skipped: true };
  try {
    await api.del(`/api/v1/todos/${todoId}`);
    return { ok: true };
  } catch (error) {
    console.warn('Failed to delete todo', error);
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
