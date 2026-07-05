import { api, unwrap, setAccessToken, type ApiEnvelope } from '../shared/apiClient';
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

/** 로그인/회원가입 성공 응답에서 토큰을 뽑아 저장. 필드명은 추정이라 실제 응답 보고 조정 필요 */
async function persistTokenIfPresent(result: AuthResult): Promise<AuthResult> {
  const token = result?.token ?? result?.accessToken;
  if (typeof token === 'string' && token) {
    await setAccessToken(token);
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

export const getProfile = async (): Promise<Record<string, unknown>> =>
  unwrap(await api.get<ApiEnvelope<Record<string, unknown>>>('/api/user/me'));
