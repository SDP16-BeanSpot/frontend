import type { NotificationItem, PostingDetail } from './types';

export const MOCK_POSTINGS: Record<string, PostingDetail> = {
  g1: {
    id: 'g1',
    dDay: '마감 D-12',
    category: '캠페인/이벤트',
    title: '내 나무 갖기 캠페인',
    organizer: '서울그린트러스트',
    posterUrl: '',
    fields: [
      { label: '참여대상', value: '누구나' },
      { label: '접수기간', value: '2025.11.20 ~ 2025.12.19' },
      { label: '활동기간', value: '2025.12.21' },
      { label: '모집인원', value: '100명' },
      { label: '활동방식', value: '오프라인' },
      { label: '활동지역', value: '서울 성동구' },
      { label: '활동혜택', value: '수료증 및 기념품' },
    ],
    description:
      '도시 숲 조성을 위한 내 나무 갖기 캠페인입니다.\n\n참여자분들께는 묘목을 나눠드리며, 함께 심고 가꾸는 활동을 진행합니다. 나무를 심은 뒤에는 이름표를 달아 나만의 나무로 기록할 수 있어요.\n\n지구를 위한 첫 걸음, 함께해요!',
    chatRoomId: '1',
    applyUrl: 'https://example.com',
    isFavorite: false,
  },
  g2: {
    id: 'g2',
    dDay: '마감 D-1',
    category: '캠페인/이벤트',
    title: '줍깅 운동회',
    organizer: '한강줍깅크루',
    posterUrl: '',
    fields: [
      { label: '참여대상', value: '누구나' },
      { label: '접수기간', value: '2025.11.25 ~ 2025.12.09' },
      { label: '활동기간', value: '2025.12.10' },
      { label: '모집인원', value: '50명' },
      { label: '활동방식', value: '오프라인' },
      { label: '활동지역', value: '서울 강남구' },
      { label: '접수방법', value: '온라인 신청' },
      { label: '활동혜택', value: '수료증 및 인증서, 입시서 혜택' },
    ],
    description:
      '조깅하며 쓰레기를 줍는 줍깅(플로깅) 운동회!\n\n내일 집합 시간: 13:00\n집합 장소: 뚝섬유원지\n\n준비물: 편한 운동복, 운동화\n집게와 봉투는 현장에서 제공됩니다.',
    chatRoomId: '1',
    applyUrl: 'https://example.com',
    isFavorite: false,
  },
  g3: {
    id: 'g3',
    dDay: '마감 D-3',
    category: '교육/체험',
    title: '오늘부터 친환경 부스터 ON',
    organizer: '환경교육센터',
    posterUrl: '',
    fields: [
      { label: '참여대상', value: '대학생' },
      { label: '접수기간', value: '2025.12.01 ~ 2025.12.22' },
      { label: '활동기간', value: '12.12 ~ 06.01' },
      { label: '모집인원', value: '30명' },
      { label: '활동방식', value: '온라인, 오프라인 혼합' },
      { label: '활동지역', value: '서울 광진구' },
      { label: '활동혜택', value: '수료증 및 활동비 지급' },
    ],
    description:
      '6개월간 진행되는 친환경 라이프스타일 교육 프로그램입니다.\n\n매주 다양한 미션과 함께 제로웨이스트, 업사이클링, 비건 등 친환경 활동을 체험해보세요.\n\n우수 활동자에게는 추가 혜택이 주어집니다.',
    applyUrl: 'https://example.com',
    isFavorite: false,
  },
  g4: {
    id: 'g4',
    dDay: '마감 D-20',
    category: '대외활동',
    title: '환경부 소셜기자단 모집',
    organizer: '환경부',
    posterUrl: '',
    fields: [
      { label: '참여대상', value: '대학생' },
      { label: '접수기간', value: '시작일 2026.01.11 / 마감일 2026.02.25' },
      { label: '활동기간', value: '2026.03 ~ 2026.12' },
      { label: '모집인원', value: '30명' },
      { label: '활동방식', value: '온라인, 오프라인 혼합' },
      { label: '접수지역', value: '서울 전지역' },
      { label: '접수방법', value: '홈페이지 지원' },
      { label: '활동혜택', value: '수료증 및 인증서, 입시서 혜택' },
    ],
    description:
      '환경을 좋아하는 마음으로 끝내지 말고, \'콘텐츠\'로 바꿔볼 사람!\n\n제16기 환경부 소셜 기자단을 모집합니다.\n\n환경에 대한 생생한 이야기를 콘텐츠로 만들어 환경부 소셜 채널에 소개하는 활동입니다.\n\n[활동 내용]\n- 환경을 사랑하는 진심 어린 대학생 누구나 (휴학생 포함)\n- 환경에 관심이 많고, 취재/콘텐츠 활동에 열정이 있는 분\n- 짧은 시간이라도 꾸준히 활동 가능한 분\n\n[지원 방법]\n- 지원 기간: 2026.2.21(금) ~ 2026.3.1(일)\n- 지원 절차: 지원서 작성 → 서류 심사 → 최종 발표',
    applyUrl: 'https://example.com',
    isFavorite: false,
  },
};

export const RECENT_SEARCHES = ['환경', '봉사', '플로깅', '봉사활동', '환경보호'];

export const SUGGESTED_SEARCHES = ['캠페인/이벤트', '교육/체험', '대외활동', '공모전'];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    tag: '마감임박',
    message: '찜해둔 {bold} 공고가 하루 뒤 마감이에요.',
    boldText: '줍깅 운동회',
    timeAgo: '4시간 전',
  },
  {
    id: 'n2',
    tag: '마감임박',
    message: '# 친환경 키워드 공고 {bold}이 새로 등록되었어요.',
    boldText: '내 나무 갖기',
    timeAgo: '4시간 전',
  },
  {
    id: 'n3',
    tag: '키워드 알림',
    message: '# 친환경 키워드 공고 {bold}이 새로 등록되었어요.',
    boldText: '한강 플로깅',
    timeAgo: '4일전',
  },
];
