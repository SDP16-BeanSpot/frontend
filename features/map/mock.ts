import type { JobPosting } from './types';

export const MOCK_POSTINGS: JobPosting[] = [
  {
    id: '1',
    title: "주말 농장 관리자 모집",
    company: "행복한 농장",
    location: "서울 구로구",
    latitude: 37.4979,
    longitude: 126.8291,
    category: "환경보전",
    thumbnail: "https://via.placeholder.com/150/92c952",
    workType: "아르바이트",
    deadline: "2025.01.30",
    description: "주말에 농장 관리를 도와주실 분을 찾습니다. 초보자도 환영합니다."
  },
  {
    id: '2',
    title: "딸기 수확 체험 보조",
    company: "딸기나라",
    location: "서울 구로구",
    latitude: 37.4990,
    longitude: 126.8305,
    category: "일자리 창출",
    thumbnail: "https://via.placeholder.com/150/771796",
    workType: "단기알바",
    deadline: "2025.02.15",
    description: "딸기 수확 체험 행사를 보조합니다. 아이들을 좋아하시는 분 우대."
  }
];
