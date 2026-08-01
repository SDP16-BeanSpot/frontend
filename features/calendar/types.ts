/**
 * 캘린더 / 일기 타입.
 * CharacterType, EmotionType 은 백엔드 엔티티(com.beanspot.backend.entity)와 값이 일치해야 합니다.
 */

export type CharacterType = 'GREEN' | 'BROWN';

export type EmotionType = 'HAPPY' | 'ANGRY' | 'SAD' | 'SURPRISED' | 'CALM' | 'TIRED';

/** Figma 일기 작성 화면의 감정 아이콘 노출 순서 */
export const EMOTION_ORDER: EmotionType[] = [
  'HAPPY',
  'TIRED',
  'ANGRY',
  'SURPRISED',
  'CALM',
  'SAD',
];

/** 백엔드 TodoResponseDto 와 대응 */
export interface TodoItem {
  id: number;
  content: string;
  isCompleted: boolean;
  date: string; // yyyy-MM-dd
  /** 연결된 관심 공고. 공고와 무관한 일반 할 일이면 null */
  announcementId: number | null;
}

/** 백엔드 CalendarScheduleResponseDto 와 대응 (관심 공고 + 활동기간) */
export interface CalendarSchedule {
  announcementId: number;
  title: string;
  startDate: string; // yyyy-MM-dd
  endDate: string;
}

/** 화면 표시용 — 일정에 그 날짜의 할 일을 묶고 색상/기간 문구를 입힌 형태 */
export interface CampaignSchedule {
  id: string;
  title: string;
  duration: string;
  color: string;
  todos: TodoItem[];
}

/** 공고별 캘린더 색상. announcementId 로 결정해 매번 같은 색이 나오도록 함 */
const SCHEDULE_COLORS = ['#6EBF6E', '#FFBDBD', '#FFE066', '#9BC9FF', '#D5B8FF'];

export const scheduleColorOf = (announcementId: number): string =>
  SCHEDULE_COLORS[Math.abs(announcementId) % SCHEDULE_COLORS.length];

const formatDot = (date: string) => date.replace(/-/g, '.');

/** "활동기간 2025.12.04 - 2025.12.10" */
export const formatDuration = (startDate: string, endDate: string): string =>
  `활동기간 ${formatDot(startDate)} - ${formatDot(endDate)}`;

/** 일정 + 해당 날짜 할 일을 화면 표시용으로 합침 */
export const toCampaignSchedule = (
  schedule: CalendarSchedule,
  todos: TodoItem[],
): CampaignSchedule => ({
  id: String(schedule.announcementId),
  title: schedule.title,
  duration: formatDuration(schedule.startDate, schedule.endDate),
  color: scheduleColorOf(schedule.announcementId),
  todos: todos.filter((t) => t.announcementId === schedule.announcementId),
});

/** 활동기간이 해당 날짜를 포함하는지 */
export const coversDate = (schedule: CalendarSchedule, date: string): boolean =>
  schedule.startDate <= date && date <= schedule.endDate;

/** 백엔드 DiaryResponseDto 와 대응 */
export interface DiaryData {
  id: number;
  date: string; // yyyy-MM-dd
  characterType: CharacterType;
  emotionType: EmotionType;
  content: string;
}

/** 일기 작성/수정 요청 (백엔드 DiaryRequestDto 와 대응) */
export interface DiaryPayload {
  date: string;
  characterType: CharacterType;
  emotionType: EmotionType;
  content: string;
}

export const DIARY_MAX_LENGTH = 200;

export type ApiResult = {
  ok: boolean;
  skipped?: boolean;
};
