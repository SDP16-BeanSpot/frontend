import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import { WS_URL, getAccessToken } from '../shared/apiClient';

/**
 * 채팅 실시간(STOMP over WebSocket) 클라이언트.
 *
 * ⚠️ 아래 DESTINATIONS 는 Spring STOMP 의 일반적인 관례로 채워둔 값입니다.
 *    Notion 웹소켓 문서(구독/발행 경로, 메시지 payload 스펙)를 받으면
 *    이 상수와 아래 타입만 맞추면 바로 동작합니다.
 */
const DESTINATIONS = {
  // 방 구독 경로 (서버 → 클라이언트). {roomId} 치환
  subscribeRoom: (roomId: string) => `/sub/chat/room/${roomId}`,
  // 메시지 발행 경로 (클라이언트 → 서버)
  publishMessage: '/pub/chat/message',
};

/** 서버에서 내려오는 메시지 payload (Notion 스펙에 맞춰 수정) */
export interface IncomingChatMessage {
  roomId: string;
  senderId: string;
  senderNickname?: string;
  content: string;
  createdAt: string;
  [key: string]: unknown;
}

/** 클라이언트가 보내는 메시지 payload (Notion 스펙에 맞춰 수정) */
export interface OutgoingChatMessage {
  roomId: string;
  content: string;
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

  /** 메시지 발행 */
  sendMessage(payload: OutgoingChatMessage): void {
    if (!this.client?.connected) {
      console.warn('[chat socket] 연결되지 않아 메시지를 보낼 수 없습니다.');
      return;
    }
    this.client.publish({
      destination: DESTINATIONS.publishMessage,
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
