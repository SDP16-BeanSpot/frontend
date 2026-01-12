// import { CampaignSchedule, DiaryData } from './types';

export const SCHEDULE_DATA: { [key: string]: CampaignSchedule[] } = {
  '2025-12-19': [
    {
      id: '1',
      title: '줍깅 캠페인',
      duration: '활동 기간 : 2026. 12. 18 - 2026.12.21',
      color: '#4CAF50',
      todos: [
        { id: 't1', task: '채팅에서 동행 구하기', completed: false },
        { id: 't2', task: '준비물 챙기기', completed: true },
      ],
    },
    {
      id: '2',
      title: '오늘부터 친환경 부스터 ON',
      duration: '마감일 : 2025. 12. 27',
      color: '#FF9800',
      todos: [
        { id: 't3', task: '자기소개서 작성', completed: false },
        { id: 't4', task: '신청 접수', completed: true },
      ],
    },
  ],
};

export const DIARY_DATA: { [key: string]: DiaryData } = {
  '2025-12-19': { id: 'd1', character: 'BROWN', emojiIndex: 0, content: '보람찬 하루!' },
};
