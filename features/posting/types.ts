export interface PostingField {
  label: string;
  value: string;
}

export interface PostingDetail {
  id: string;
  dDay: string;
  category: string;
  title: string;
  organizer: string;
  posterUrl: string;
  fields: PostingField[];
  description: string;
  chatRoomId?: string;
  applyUrl?: string;
  isFavorite: boolean;
}

export interface NotificationItem {
  id: string;
  tag: '마감임박' | '키워드 알림';
  message: string;
  boldText: string;
  timeAgo: string;
}

export type ApiResult = {
  ok: boolean;
  skipped?: boolean;
};
