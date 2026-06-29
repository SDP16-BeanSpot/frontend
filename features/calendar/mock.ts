import type { CampaignSchedule, DiaryData } from './types';

// 날짜별 일정 데이터 (Figma 기준)
export const SCHEDULE_DATA: Record<string, CampaignSchedule[]> = {
  '2025-12-04': [
    { id: '1', title: '줄깅 캠페인', duration: '활동기간 2025.12.04 - 2025.12.10', color: '#6EBF6E', todos: [] },
    { id: '2', title: '용기내 챌린지', duration: '활동기간 2025.12.04 - 2025.12.08', color: '#FFBDBD', todos: [] },
  ],
  '2025-12-05': [
    { id: '1', title: '줄깅 캠페인', duration: '활동기간 2025.12.04 - 2025.12.10', color: '#6EBF6E', todos: [] },
    { id: '2', title: '용기내 챌린지', duration: '활동기간 2025.12.04 - 2025.12.08', color: '#FFBDBD', todos: [] },
  ],
  '2025-12-06': [
    { id: '1', title: '줄깅 캠페인', duration: '활동기간 2025.12.04 - 2025.12.10', color: '#6EBF6E', todos: [] },
    { id: '2', title: '용기내 챌린지', duration: '활동기간 2025.12.04 - 2025.12.08', color: '#FFBDBD', todos: [] },
  ],
  '2025-12-07': [
    { id: '1', title: '줄깅 캠페인', duration: '활동기간 2025.12.04 - 2025.12.10', color: '#6EBF6E', todos: [] },
    { id: '2', title: '용기내 챌린지', duration: '활동기간 2025.12.04 - 2025.12.08', color: '#FFBDBD', todos: [] },
  ],
  '2025-12-08': [
    { id: '1', title: '줄깅 캠페인', duration: '활동기간 2025.12.04 - 2025.12.10', color: '#6EBF6E', todos: [] },
    { id: '2', title: '용기내 챌린지', duration: '활동기간 2025.12.04 - 2025.12.08', color: '#FFBDBD', todos: [] },
  ],
  '2025-12-09': [
    { id: '1', title: '줄깅 캠페인', duration: '활동기간 2025.12.04 - 2025.12.10', color: '#6EBF6E', todos: [] },
  ],
  '2025-12-10': [
    { id: '1', title: '줄깅 캠페인', duration: '활동기간 2025.12.04 - 2025.12.10', color: '#6EBF6E', todos: [] },
  ],
  '2025-12-18': [
    { id: '1', title: '줄깅 캠페인', duration: '활동기간 2025.12.04 - 2025.12.10', color: '#6EBF6E', todos: [] },
    { id: '3', title: '오늘부터 친환경 부스터 ON', duration: '12.12 ~ 06.01', color: '#FFE066', todos: [] },
  ],
  '2025-12-19': [
    {
      id: '1',
      title: '줄깅 캠페인',
      duration: '활동기간 2025.12.18 - 2025.12.21',
      color: '#6EBF6E',
      todos: [
        { id: 't1', task: '채팅에서 동행 구하기', completed: false },
        { id: 't2', task: '준비물 챙기기', completed: true },
      ],
    },
    {
      id: '3',
      title: '오늘부터 친환경 부스터 ON',
      duration: '마감일 2025.12.27',
      color: '#FFE066',
      todos: [
        { id: 't3', task: '자기소개서 작성', completed: false },
        { id: 't4', task: '신청 접수', completed: true },
      ],
    },
  ],
  '2025-12-20': [
    { id: '3', title: '오늘부터 친환경 부스터 ON', duration: '12.12 ~ 06.01', color: '#FFE066', todos: [] },
  ],
  '2025-12-22': [
    { id: '3', title: '오늘부터 친환경 부스터 ON', duration: '12.12 ~ 06.01', color: '#FFE066', todos: [] },
  ],
  '2025-12-23': [
    { id: '3', title: '오늘부터 친환경 부스터 ON', duration: '12.12 ~ 06.01', color: '#FFE066', todos: [] },
  ],
  '2025-12-24': [
    { id: '3', title: '오늘부터 친환경 부스터 ON', duration: '12.12 ~ 06.01', color: '#FFE066', todos: [] },
  ],
};

export const DIARY_DATA: Record<string, DiaryData> = {
  '2025-12-19': { id: 'd1', character: 'BROWN', emojiIndex: 0, content: '보람찬 하루!' },
};
