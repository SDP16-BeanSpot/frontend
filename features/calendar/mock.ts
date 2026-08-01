import type { CalendarSchedule, DiaryData, TodoItem } from './types';

/** 관심 공고 일정 (Figma 기준). 백엔드 GET /api/v1/calendar/schedules 응답과 같은 형태 */
export const MOCK_SCHEDULES: CalendarSchedule[] = [
  { announcementId: 1, title: '줄깅 캠페인', startDate: '2025-12-04', endDate: '2025-12-10' },
  { announcementId: 2, title: '용기내 챌린지', startDate: '2025-12-04', endDate: '2025-12-08' },
  { announcementId: 3, title: '오늘부터 친환경 부스터 ON', startDate: '2025-12-18', endDate: '2025-12-24' },
];

/** 날짜별 할 일 (백엔드 GET /api/v1/todos?date= 응답과 같은 형태) */
export const MOCK_TODOS: TodoItem[] = [
  { id: 1, content: '채팅에서 동행 구하기', isCompleted: false, date: '2025-12-19', announcementId: 1 },
  { id: 2, content: '준비물 챙기기', isCompleted: true, date: '2025-12-19', announcementId: 1 },
  { id: 3, content: '자기소개서 작성', isCompleted: false, date: '2025-12-19', announcementId: 3 },
  { id: 4, content: '신청 접수', isCompleted: true, date: '2025-12-19', announcementId: 3 },
];

export const DIARY_DATA: Record<string, DiaryData> = {
  '2025-12-19': {
    id: 1,
    date: '2025-12-19',
    characterType: 'GREEN',
    emotionType: 'ANGRY',
    content:
      '이 날의 일기 블라블라이 날의 일기 블라블라이 날의 일기 블라블라이 날의 일기 블라블라이 날의 일기 블라블라',
  },
  '2025-12-18': {
    id: 2,
    date: '2025-12-18',
    characterType: 'BROWN',
    emotionType: 'HAPPY',
    content: '이 날의 일기 블라블라',
  },
  '2025-12-17': {
    id: 3,
    date: '2025-12-17',
    characterType: 'BROWN',
    emotionType: 'CALM',
    content: '오늘도 무사히 하루를 마쳤다.',
  },
};
