/**
 * Beanspot Backend API 의 /api/auth/* 스펙 (2026-07-05 확인, Swagger 문서 + 실제 curl 테스트 기반).
 *
 * ⚠️ CheckAvailability 응답(available/value/type/message)은 실제 서버에 curl 로 호출해 확인한
 *    "확실한" 타입입니다. Signup/Login/KakaoLogin 의 응답 `data` 는 Swagger 상 `object` 로만
 *    표시되어 있어(구체 스키마 없음) 실제 필드명(token? accessToken? user?)은 추정입니다.
 *    한 번 실제 로그인/회원가입을 테스트해보고 AuthResult 의 필드명을 맞춰주세요.
 */

export type UserRole = 'USER' | 'ADMIN';

/** POST /api/auth/signup, /api/auth/oauth/kakao/signup, /api/auth/login 공통 요청 바디 (백엔드 `Req`) */
export interface AuthRequest {
  userId: string;
  password: string;
  nickname: string;
  name: string;
  phone?: string;
  role?: UserRole;
}

/** 로그인은 userId/password 만 있으면 충분 (백엔드가 Req 타입을 재사용할 뿐) */
export type LoginRequest = Pick<AuthRequest, 'userId' | 'password'>;

/**
 * signup/login 성공 시 응답 data.
 * ⚠️ 추정 타입 — 실제 호출 후 필드명 확인 필요.
 */
export interface AuthResult {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id?: number | string;
    userId?: string;
    nickname?: string;
    name?: string;
  };
  [key: string]: unknown;
}

/** GET /api/auth/check-id, /api/auth/check-nickname 응답 data (실제 curl 로 확인된 확실한 타입) */
export interface CheckAvailabilityResult {
  available: boolean;
  value: string;
  type: 'userId' | 'nickname';
  message: string;
}
