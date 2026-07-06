import type { ReportType } from '../shared/reportTypes';

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

/** 백엔드 ReactionSummaryDto.reactionType (메시지 롱프레스 → 이모지 리액션) */
export type ReactionType = 'SMILE' | 'SURPRISE' | 'CRY' | 'NEUTRAL' | 'ANGRY';

export const REACTION_TYPES: ReactionType[] = ['SMILE', 'SURPRISE', 'CRY', 'NEUTRAL', 'ANGRY'];

/** react-native-vector-icons(MaterialCommunityIcons emoticon-*) 매핑용 */
export const REACTION_ICON_NAMES: Record<ReactionType, string> = {
  SMILE: 'emoticon-happy',
  SURPRISE: 'emoticon-excited',
  CRY: 'emoticon-cry',
  NEUTRAL: 'emoticon-neutral',
  ANGRY: 'emoticon-angry',
};

export interface ReactionSummary {
  type: ReactionType;
  count: number;
  /** 현재 로그인한 사용자가 이 리액션을 눌렀는지 */
  reacted: boolean;
}

export type MessageItem =
  | { id: string; type: 'date'; text: string }
  | {
      id: string; // 서버의 messageId (문자열로 통일해서 사용)
      type: 'message';
      sender: 'me' | 'other';
      senderName?: string;
      text: string;
      time: string;
      avatar?: string;
      /** 답장 대상 메시지 id. 없으면 일반 메시지 */
      parentMsgId?: string;
      /** 답장 대상 메시지의 미리보기 텍스트 (인용 표시용) */
      parentPreview?: string;
      reactions?: ReactionSummary[];
    };

export type ChatRoom = {
  id: string;
  title: string;
  participantCount?: number;
  deadline: string;
  dday: string;
  thumbnailUrl: string;
  postingId?: string;
  messages: MessageItem[];
};

export type ApiResult = {
  ok: boolean;
  skipped?: boolean;
  message?: string;
};

/** POST /api/chat/messages/{messageId}/report 요청 바디 (백엔드 ReportRequest) */
export type ChatReportPayload = {
  reportType: ReportType;
  content: string;
};
