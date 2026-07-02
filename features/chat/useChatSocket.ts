import { useCallback, useEffect, useRef, useState } from 'react';
import { chatSocket, type IncomingChatMessage } from './socket';
import { WS_URL } from '../shared/apiClient';

/**
 * 채팅방 실시간 연결 훅.
 *
 * 사용 예 (app/chat/[id].tsx):
 *   const { connected, sendMessage } = useChatSocket(roomId, (msg) => {
 *     setMessages((prev) => [...prev, mapIncoming(msg)]);
 *   });
 *
 * WS_URL 이 비어있으면(서버 미설정) 아무 동작도 하지 않으므로
 * mock 개발 중에도 안전하게 호출할 수 있습니다.
 */
export function useChatSocket(
  roomId: string | undefined,
  onMessage: (msg: IncomingChatMessage) => void,
) {
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!WS_URL || !roomId) return;

    let unsubscribeRoom: (() => void) | undefined;

    const offConnection = chatSocket.onConnectionChange((isConnected) => {
      setConnected(isConnected);
      if (isConnected) {
        // 연결되면 방 구독
        unsubscribeRoom?.();
        unsubscribeRoom = chatSocket.subscribeToRoom(roomId, (msg) =>
          onMessageRef.current(msg),
        );
      }
    });

    void chatSocket.connect();

    return () => {
      unsubscribeRoom?.();
      offConnection();
    };
  }, [roomId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!roomId) return;
      chatSocket.sendMessage({ roomId, content });
    },
    [roomId],
  );

  return { connected, sendMessage };
}
