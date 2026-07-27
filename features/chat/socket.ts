import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import { WS_URL, getAccessToken } from '../shared/apiClient';
import type { ReactionType } from './types';

/**
 * 채팅 실시간(STOMP over WebSocket) 클라이언트.
 *
 * 아래 destinations/타입은 실제 백엔드 소스(ChatController, WebSocketConfig,
 * ChatMessageDto, ReactionStompRequest)를 직접 읽어 확인한 값입니다 (추정 아님):
 *  - endpoint: /ws-stomp, app prefix: /pub, broker prefix: /sub, /queue, user prefix: /user
 *  - @MessageMapping("/chat/message")  → /pub/chat/message,  브로드캐스트: /sub/chat/room/{roomId}
 *  - @MessageMapping("/chat/reaction") → /pub/chat/reaction, 브로드캐스트: /sub/chat/room/{roomId}
 *  - @MessageExceptionHandler 는 convertAndSendToUser(principal, "/queue/errors", ...) 로 보내므로
 *    클라이언트는 리터럴 "/user/queue/errors" 를 구독하면 됩니다 (Spring 이 세션별로 알아서 라우팅).
 */
const DESTINATIONS = {
  // 방 구독 경로 (서버 → 클라이언트). {roomId} 치환
  subscribeRoom: (roomId: string) => `/sub/chat/room/${roomId}`,
  // 메시지 발행 경로 (클라이언트 → 서버)
  publishMessage: '/pub/chat/message',
  // 리액션 토글 발행 경로 (클라이언트 → 서버)
  publishReaction: '/pub/chat/reaction',
  // 개인 에러 큐 (서버 → 클라이언트, 세션 단위)
  userErrors: '/user/queue/errors',
};

/** 서버 ChatMessageDto 의 msgType — 기본값이 없어 일반 메시지는 반드시 TALK 를 명시해야 함 */
export type ChatMessageType = 'TALK' | 'NOTICE' | 'ENTER' | 'QUIT';

/** 서버에서 내려오는 메시지 payload (ChatMessageDto 기준) */
export interface IncomingChatMessage {
  roomId: string;
  messageId?: string;
  senderId: string;
  senderNickname?: string;
  content: string;
  createdAt: string;
  parentMsgId?: string;
  [key: string]: unknown;
}

/** 클라이언트가 보내는 메시지 payload (ChatMessageDto 기준, msgType 필수) */
export interface OutgoingChatMessage {
  roomId: string;
  content: string;
  /** 기본값 'TALK'. 서버 DTO 에 기본값이 없어 생략하면 안 됨 */
  msgType?: ChatMessageType;
  /** 답장 대상 메시지 id (일반 메시지면 생략) */
  parentMsgId?: string;
}

/** 리액션 토글 발행 payload (ReactionStompRequest 기준) */
export interface OutgoingReaction {
  roomId: string;
  messageId: string;
  reactionType: ReactionType;
}

/** @MessageExceptionHandler 가 보내는 에러 (ExceptionDto 기준: code + message) */
export interface ChatSocketError {
  code?: number;
  message: string;
  [key: string]: unknown;
}

type ConnectionListener = (connected: boolean) => void;

class ChatSocketClient {
  private client: Client | null = null;
  private subscriptions = new Map<string, StompSubscription>();
  private connectionListeners = new Set<ConnectionListener>();

  get isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  /** 소켓 연결 (JWT 를 STOMP CONNECT 헤더에 실어 인증) */
  async connect(): Promise<void> {
    if (!WS_URL) {
      console.warn('[chat socket] EXPO_PUBLIC_WS_URL 이 설정되지 않았습니다.');
      return;
    }
    if (this.client?.active) return;

    const token = await getAccessToken();

    this.client = new Client({
      brokerURL: WS_URL,
      // 서버가 SockJS 엔드포인트라면 brokerURL 대신 webSocketFactory 를 사용해야 합니다:
      //   webSocketFactory: () => new SockJS(WS_URL.replace(/^ws/, 'http')),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => this.emitConnection(true),
      onDisconnect: () => this.emitConnection(false),
      onWebSocketClose: () => this.emitConnection(false),
      onStompError: (frame) => {
        console.warn('[chat socket] STOMP error:', frame.headers['message'], frame.body);
      },
    });

    this.client.activate();
  }

  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.client?.deactivate();
    this.client = null;
  }

  /** 특정 방 구독. 반환된 함수를 호출하면 구독 해제 */
  subscribeToRoom(roomId: string, onMessage: (msg: IncomingChatMessage) => void): () => void {
    if (!this.client?.connected) {
      console.warn('[chat socket] 연결 전에는 구독할 수 없습니다. connect() 먼저 호출하세요.');
      return () => {};
    }

    const destination = DESTINATIONS.subscribeRoom(roomId);
    const sub = this.client.subscribe(destination, (frame: IMessage) => {
      try {
        onMessage(JSON.parse(frame.body) as IncomingChatMessage);
      } catch (error) {
        console.warn('[chat socket] 메시지 파싱 실패:', error);
      }
    });
    this.subscriptions.set(roomId, sub);

    return () => {
      sub.unsubscribe();
      this.subscriptions.delete(roomId);
    };
  }

  /** 메시지 발행 (parentMsgId 를 포함하면 답장으로 전송됨). msgType 생략 시 'TALK' */
  sendMessage(payload: OutgoingChatMessage): void {
    if (!this.client?.connected) {
      console.warn('[chat socket] 연결되지 않아 메시지를 보낼 수 없습니다.');
      return;
    }
    this.client.publish({
      destination: DESTINATIONS.publishMessage,
      body: JSON.stringify({ msgType: 'TALK', ...payload }),
    });
  }

  /** 개인 에러 큐 구독. 서버가 @MessageExceptionHandler 로 보내는 에러를 받음 */
  subscribeToErrors(onError: (error: ChatSocketError) => void): () => void {
    if (!this.client?.connected) {
      console.warn('[chat socket] 연결 전에는 구독할 수 없습니다. connect() 먼저 호출하세요.');
      return () => {};
    }

    const sub = this.client.subscribe(DESTINATIONS.userErrors, (frame: IMessage) => {
      try {
        onError(JSON.parse(frame.body) as ChatSocketError);
      } catch (error) {
        console.warn('[chat socket] 에러 메시지 파싱 실패:', error);
      }
    });

    return () => sub.unsubscribe();
  }

  /** 리액션 토글 발행 */
  sendReaction(payload: OutgoingReaction): void {
    if (!this.client?.connected) {
      console.warn('[chat socket] 연결되지 않아 리액션을 보낼 수 없습니다. (로컬에만 반영됨)');
      return;
    }
    this.client.publish({
      destination: DESTINATIONS.publishReaction,
      body: JSON.stringify(payload),
    });
  }

  /** 연결 상태 변경 구독 */
  onConnectionChange(listener: ConnectionListener): () => void {
    this.connectionListeners.add(listener);
    return () => this.connectionListeners.delete(listener);
  }

  private emitConnection(connected: boolean): void {
    this.connectionListeners.forEach((l) => l(connected));
  }
}

// 앱 전역에서 단일 인스턴스 사용
export const chatSocket = new ChatSocketClient();
