import { api, unwrap, setAccessToken, setUserRole, type ApiEnvelope } from '../shared/apiClient';
import type {
  AuthRequest,
  AuthResult,
  CheckAvailabilityResult,
  LoginRequest,
} from './types';

// 실제 확인된 엔드포인트 (Beanspot Backend API, 2026-07-05 기준)

export const checkUserId = async (userId: string): Promise<CheckAvailabilityResult> =>
  unwrap(
    await api.get<ApiEnvelope<CheckAvailabilityResult>>('/api/auth/check-id', {
      params: { userId },
      auth: false,
    }),
  );

export const checkNickname = async (nickname: string): Promise<CheckAvailabilityResult> =>
  unwrap(
    await api.get<ApiEnvelope<CheckAvailabilityResult>>('/api/auth/check-nickname', {
      params: { nickname },
      auth: false,
    }),
  );

/**
 * 응답 어딘가에서 role(USER/ADMIN) 값을 유연하게 찾아냄.
 * 백엔드 응답 스키마가 Swagger 상 object 로만 표시돼 있어 필드 위치가 불명이라
 * result.role / result.user.role 두 위치를 검사합니다.
 */
function extractRole(result: AuthResult): string | null {
  const direct = (result as Record<string, unknown>)?.role;
  if (direct === 'ADMIN' || direct === 'USER') return direct;
  const nested = (result?.user as Record<string, unknown> | undefined)?.role;
  if (nested === 'ADMIN' || nested === 'USER') return nested as string;
  return null;
}

/** 로그인/회원가입 성공 응답에서 토큰/역할을 뽑아 저장. 필드명은 추정이라 실제 응답 보고 조정 필요 */
async function persistTokenIfPresent(result: AuthResult): Promise<AuthResult> {
  const token = result?.token ?? result?.accessToken;
  if (typeof token === 'string' && token) {
    await setAccessToken(token);
  }
  const role = extractRole(result);
  if (role) {
    await setUserRole(role);
  }
  return result;
}

export const signup = async (payload: AuthRequest): Promise<AuthResult> => {
  const result = unwrap(
    await api.post<ApiEnvelope<AuthResult>>('/api/auth/signup', payload, { auth: false }),
  );
  return persistTokenIfPresent(result);
};

/** 카카오 프로필 정보로 회원가입/로그인. 이미 가입된 kakao 유저면 백엔드가 기존 계정을 반환할 것으로 예상 */
export const kakaoSignup = async (payload: AuthRequest): Promise<AuthResult> => {
  const result = unwrap(
    await api.post<ApiEnvelope<AuthResult>>('/api/auth/oauth/kakao/signup', payload, {
      auth: false,
    }),
  );
  return persistTokenIfPresent(result);
};

export const login = async (payload: LoginRequest): Promise<AuthResult> => {
  const result = unwrap(
    await api.post<ApiEnvelope<AuthResult>>('/api/auth/login', payload, { auth: false }),
  );
  return persistTokenIfPresent(result);
};

/**
 * ⚠️ 이 엔드포인트는 Kakao OAuth "authorization code"를 기대합니다 (GET ?code=).
 * 우리 앱은 @react-native-kakao/user 네이티브 SDK로 이미 카카오 액세스 토큰을 직접 받으므로
 * code 플로우와 맞지 않습니다. 현재는 useKakaoAuth 가 kakaoSignup 을 대신 사용합니다.
 * 백엔드 팀과 실제 사용 목적(웹 리다이렉트용?)을 확인 후 필요하면 연결하세요.
 */
export const kakaoLoginWithCode = async (code: string): Promise<AuthResult> => {
  const result = unwrap(
    await api.get<ApiEnvelope<AuthResult>>('/api/auth/oauth/kakao/login', {
      params: { code },
      auth: false,
    }),
  );
  return persistTokenIfPresent(result);
};

export const getProfile = async (): Promise<Record<string, unknown>> => {
  const profile = unwrap(await api.get<ApiEnvelope<Record<string, unknown>>>('/api/user/me'));
  // 프로필 조회 시에도 role 을 최신화 (로그인 응답에 role 이 없었을 경우 대비)
  const role = extractRole(profile as AuthResult);
  if (role) {
    await setUserRole(role);
  }
  return profile;
};
