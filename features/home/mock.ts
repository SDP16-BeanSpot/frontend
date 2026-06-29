import type { Banner, Garden } from './types';

export const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    tag: '서비스 이용안내',
    text: '빈스팟에 오신걸 환영해요!',
    icon: 'seed-outline',
  },
];

export const MOCK_GARDENS: Garden[] = [
  {
    id: 'g1',
    dDay: '마감 D-12',
    category: '캠페인/이벤트',
    title: '내 나무 갖기 캠페인',
    activityPeriod: '활동기간 2025.12.21',
    locationTags: ['성동구', '오프라인'],
    isFavorite: false,
    imageUrl: '',
  },
  {
    id: 'g2',
    dDay: '마감 D-1',
    category: '캠페인/이벤트',
    title: '줄깅 운동회',
    activityPeriod: '활동기간 2025.12.10',
    locationTags: ['강남구', '오프라인'],
    isFavorite: false,
    imageUrl: '',
  },
  {
    id: 'g3',
    dDay: '마감 D-3',
    category: '교육/체험',
    title: '오늘부터 친환경 부스터 ON',
    activityPeriod: '12.12 ~ 06.01',
    locationTags: ['광진구', '오프라인'],
    isFavorite: false,
    imageUrl: '',
  },
];

export const MOCK_POPULAR_GARDENS: Garden[] = MOCK_GARDENS;
