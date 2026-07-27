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

export interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface CampaignSchedule {
  id: string;
  title: string;
  duration: string;
  color: string;
  todos: TodoItem[];
}

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
