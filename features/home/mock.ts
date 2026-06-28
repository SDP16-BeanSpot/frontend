import type { Banner, Garden } from './types';

export const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    tag: '서비스 이용안내',
    text: '빈스팟에 오신걸 환영해요!',
    icon: 'face-recognition',
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
    imageUrl: 'https://via.placeholder.com/90x110.png?text=Garden1',
  },
  {
    id: 'g2',
    dDay: '마감 D-5',
    category: '텃밭',
    title: '주말농장 같이 가꾸실 분!',
    activityPeriod: '활동기간 2025.12.15 - 2026.03.15',
    locationTags: ['강남구', '온라인'],
    isFavorite: true,
    imageUrl: 'https://via.placeholder.com/90x110.png?text=Garden2',
  },
  {
    id: 'g3',
    dDay: '모집중',
    category: '클래스',
    title: '친환경 비료 만들기',
    activityPeriod: '상시모집',
    locationTags: ['온라인'],
    isFavorite: false,
    imageUrl: 'https://via.placeholder.com/90x110.png?text=Garden3',
  },
];

export const MOCK_POPULAR_GARDENS: Garden[] = MOCK_GARDENS.slice(0, 2);
