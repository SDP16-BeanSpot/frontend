export type ChatGroup = 'interest' | 'recent';

export type BackendChatItem = {
  id: string;
  title: string;
  participantCount?: number;
  lastMessage: string;
  timestamp: string;
  thumbnailUrl: string;
  unreadCount: number;
  group: ChatGroup;
};

export type ChatItem = BackendChatItem & {
  pinned: boolean;
  muted: boolean;
};

export type MessageItem =
  | { id: string; type: 'date'; text: string }
  | {
      id: string;
      type: 'message';
      sender: 'me' | 'other';
      text: string;
      time: string;
      avatar?: string;
    };

export type ChatRoom = {
  id: string;
  title: string;
  participantCount?: number;
  deadline: string;
  dday: string;
  thumbnailUrl: string;
  messages: MessageItem[];
};

export type ApiResult = {
  ok: boolean;
  skipped?: boolean;
  message?: string;
};

export type ChatReportPayload = {
  reason: string;
  content: string;
};
