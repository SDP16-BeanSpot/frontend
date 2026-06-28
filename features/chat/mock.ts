import type { BackendChatItem, ChatRoom } from './types';

export const MOCK_CHAT_DATA: BackendChatItem[] = [
  {
    id: '1',
    title: '폼카페 50',
    lastMessage: '혹시 오늘날 오실거면 안내드립니다.\n내일 집합 시간: 13:00 집합 장소: 동덕유...',
    timestamp: '1일전',
    thumbnailUrl: 'https://via.placeholder.com/80x80.png?text=50',
    unreadCount: 1,
    group: 'interest',
  },
  {
    id: '2',
    title: '폼카페 필터 14',
    lastMessage: '오늘도 폼카페 필터 참여해봐용~ :)',
    timestamp: '2일전',
    thumbnailUrl: 'https://via.placeholder.com/80x80.png?text=14',
    unreadCount: 23,
    group: 'recent',
  },
  {
    id: '3',
    title: '지구야 에코라이프 약속할게',
    lastMessage: '다른 고양냥스였어요~!!!!!',
    timestamp: '2일전',
    thumbnailUrl: 'https://via.placeholder.com/80x80.png?text=ECO',
    unreadCount: 12,
    group: 'recent',
  },
];

export const MOCK_ROOMS: ChatRoom[] = [
  {
    id: '1',
    title: '폼카운 50',
    deadline: '접수일자: 2025.12.10',
    dday: 'D-1',
    thumbnailUrl: 'https://via.placeholder.com/80x80.png?text=50',
    messages: [
      { id: 'd1', type: 'date', text: '2025.12.09' },
      {
        id: 'm1',
        type: 'message',
        sender: 'other',
        text: '안녕하세요. 저희 텃밭이에요.\n토요일에 함께 하실 수 있나요?',
        time: '오후 2:00',
        avatar: 'https://via.placeholder.com/48x48.png?text=K',
      },
      {
        id: 'm2',
        type: 'message',
        sender: 'me',
        text: '네 가능합니다! 자세한 위치 공유 부탁드려요 :)',
        time: '오후 2:00',
      },
      {
        id: 'm3',
        type: 'message',
        sender: 'other',
        text: '이번 주말엔 도착 전까지 연락 부탁드릴게요!\n공고에서 자세히 확인해 주세요.',
        time: '오후 2:01',
        avatar: 'https://via.placeholder.com/48x48.png?text=K',
      },
    ],
  },
  {
    id: '2',
    title: '폼카페 필터 14',
    deadline: '접수일자: 2025.12.05',
    dday: 'D-4',
    thumbnailUrl: 'https://via.placeholder.com/80x80.png?text=14',
    messages: [],
  },
];
