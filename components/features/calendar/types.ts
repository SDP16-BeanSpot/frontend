export type CharacterType = 'BROWN' | 'GREEN';

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

export interface DiaryData {
  id: string;
  character: CharacterType;
  emojiIndex: number;
  content: string;
}
