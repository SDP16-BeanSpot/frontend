/**
 * 아이디/비밀번호 찾기 전용 타입.
 * ⚠️ 백엔드에 아이디/비밀번호 찾기 엔드포인트가 없어(SMS 인증 자체도 없음) 목 데이터로 시뮬레이션합니다.
 */

export interface FoundAccount {
  type: 'kakao' | 'local';
  label: string;
  userId: string;
  joinedAt: string;
}

export interface FoundPasswordAccount {
  userId: string;
  maskedPassword: string;
}
