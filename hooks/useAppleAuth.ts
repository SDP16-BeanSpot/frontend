import { useState } from 'react';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

import { kakaoSignup, login as backendLogin } from '../features/auth/api';
import { ApiError, isApiConfigured } from '../features/shared/apiClient';
import type { AuthRequest } from '../features/auth/types';

/**
 * Sign in with Apple.
 *
 * App Store 심사 가이드라인 4.8 에 따라, 카카오(서드파티 소셜 로그인)를 제공하는 앱은
 * 동등한 대체 로그인을 함께 제공해야 합니다. iOS 전용 기능이라 Android 에서는 노출되지 않습니다.
 *
 * ⚠️ 백엔드에 Apple 전용 인증 엔드포인트가 없습니다(/api/auth/oauth/kakao/* 만 존재).
 *    그래서 useKakaoAuth 와 동일하게, Apple 이 준 고유 식별자(user)로 파생 계정을 만들어
 *    회원가입 → 실패 시 로그인으로 폴백합니다. identityToken 을 서버가 검증하도록 바뀌면
 *    deriveBackendCredentials 와 authenticateWithBackend 를 교체하세요.
 *
 * ⚠️ Apple 은 최초 1회 로그인에서만 이름/이메일을 돌려줍니다. 재로그인 시에는 null 이므로
 *    표시용 이름이 필요하면 최초 로그인 때 서버에 저장해두어야 합니다.
 */

function deriveBackendCredentials(
  credential: AppleAuthentication.AppleAuthenticationCredential,
): AuthRequest {
  // credential.user 는 앱-개발자팀 단위로 고정되는 Apple 의 안정적 사용자 식별자
  const appleId = credential.user.replace(/[^a-zA-Z0-9]/g, '');
  const givenName = credential.fullName?.givenName ?? '';
  const nickname = (givenName || `빈스팟${appleId.slice(-6)}`).slice(0, 14);

  return {
    userId: `apple_${appleId}`.slice(0, 14),
    // TODO: 백엔드가 Apple identityToken 검증을 지원하면 이 더미 비밀번호 생성을 제거하세요.
    password: `Apple!${appleId.slice(0, 20)}`,
    nickname,
    name: nickname,
  };
}

interface AppleAuthHook {
  /** iOS 이면서 기기가 Apple 로그인을 지원하는 경우에만 true */
  isAvailable: boolean;
  error: string;
  loading: boolean;
  appleLogin: () => Promise<boolean>;
  checkAvailability: () => Promise<void>;
}

export default function useAppleAuth(): AppleAuthHook {
  const [isAvailable, setAvailable] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkAvailability = async () => {
    if (Platform.OS !== 'ios') {
      setAvailable(false);
      return;
    }
    try {
      setAvailable(await AppleAuthentication.isAvailableAsync());
    } catch {
      setAvailable(false);
    }
  };

  const authenticateWithBackend = async (
    credential: AppleAuthentication.AppleAuthenticationCredential,
  ) => {
    const credentials = deriveBackendCredentials(credential);
    try {
      await kakaoSignup(credentials);
    } catch {
      // 이미 가입된 계정으로 추정 → 동일 파생 계정으로 로그인 재시도
      try {
        await backendLogin({ userId: credentials.userId, password: credentials.password });
      } catch (loginErr) {
        const message = loginErr instanceof ApiError ? loginErr.message : '백엔드 인증 실패';
        throw new Error(message);
      }
    }
  };

  /** 성공 시 true. 사용자가 취소하면 false (에러로 취급하지 않음) */
  const appleLogin = async (): Promise<boolean> => {
    setError('');
    setLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (isApiConfigured()) {
        await authenticateWithBackend(credential);
      }
      return true;
    } catch (e: any) {
      // 사용자가 시트를 닫은 경우
      if (e?.code === 'ERR_REQUEST_CANCELED') return false;
      setError(e?.message ?? 'Apple 로그인에 실패했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { isAvailable, error, loading, appleLogin, checkAvailability };
}
