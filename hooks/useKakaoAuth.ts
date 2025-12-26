// /hooks/useKakaoAuth.ts
import { useState, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

interface KakaoUser {
  id: number;
  properties?: {
    nickname?: string;
    profile_image?: string;
  };
  kakao_account?: {
    email?: string;
  };
}

interface KakaoAuthHook {
  user: KakaoUser | null;
  error: string;
  loading: boolean;
  kakaologin: () => Promise<void>;
  logout: () => Promise<void>;
}

// 웹 브라우저 세션을 완료하기 위해 필요 (특히 웹 환경)
WebBrowser.maybeCompleteAuthSession();

const REST_API_KEY = 'dcc3060fb81d292dabe5c0e380d3525f';
const TOKEN_KEY = 'user_jwt_token';
const REFRESH_TOKEN_KEY = 'user_jwt_refresh_token';
const discovery = {
  authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
};

// 스토리지 헬퍼 함수 (웹/앱 호환성)
const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Local storage unavailable', e);
    }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const removeStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export default function useKakaoAuth(): KakaoAuthHook {
  const [user, setUser] = useState<KakaoUser | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Redirect URI를 한 번만 생성하여 일관성 유지
  const redirectUri = useMemo(() => AuthSession.makeRedirectUri(), []);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: REST_API_KEY,
      redirectUri,
      scopes: ['profile_image', 'profile_nickname', 'account_email'],
    },
    discovery
  );

  // 앱 시작 시 자동 로그인 체크
  useEffect(() => {
    checkAutoLogin();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleBackendLogin(code);
    } else if (response?.type === 'error') {
      setError(response.error?.message || '로그인 중 에러가 발생했습니다.');
    }
  }, [response]);

  const checkAutoLogin = async () => {
    setLoading(true);
    try {
      const token = await getStorageItem(TOKEN_KEY);
      if (token) {
        // 저장된 토큰이 있으면 백엔드에 유저 정보 요청
        let res = await fetch('https://your-backend.com/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // 401 Unauthorized (토큰 만료) 시 갱신 시도
        if (res.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            res = await fetch('https://your-backend.com/api/auth/me', {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${newToken}` },
            });
          }
        }

        if (res.ok) {
          const result = await res.json();
          setUser(result.user);
        } else {
          // 토큰이 만료되었거나 유효하지 않은 경우
          await logout();
        }
      }
    } catch (err) {
      console.error('자동 로그인 체크 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const refreshToken = await getStorageItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) return null;

      const res = await fetch('https://your-backend.com/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await res.json();
      if (res.ok && data.accessToken) {
        await setStorageItem(TOKEN_KEY, data.accessToken);
        // Refresh Token Rotation(RTR)을 사용하는 경우 새 Refresh Token 저장
        if (data.refreshToken) {
          await setStorageItem(REFRESH_TOKEN_KEY, data.refreshToken);
        }
        return data.accessToken;
      }
    } catch (e) {
      console.error('토큰 갱신 실패', e);
    }
    return null;
  };

  const handleBackendLogin = async (code: string) => {
    setLoading(true);
    try {
      // 백엔드 서버의 카카오 로그인 엔드포인트로 인가 코드 전달
      const res = await fetch('https://your-backend.com/api/auth/kakao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code,
          redirectUri 
        }),
      });

      const result = await res.json();

      if (res.ok && result.user) {
        setUser(result.user);
        // JWT 토큰을 SecureStore에 안전하게 저장
        if (result.token) {
          await setStorageItem(TOKEN_KEY, result.token);
        }
        if (result.refreshToken) {
          await setStorageItem(REFRESH_TOKEN_KEY, result.refreshToken);
        }
      } else {
        setError(result.error || '백엔드 인증 실패');
      }
    } catch (err: any) {
      setError(err.message || '서버 통신 에러');
    } finally {
      setLoading(false);
    }
  };

  const kakaologin = async (): Promise<void> => {
    setError('');
    promptAsync();
  };

  const logout = async () => {
    try {
      await removeStorageItem(TOKEN_KEY);
      await removeStorageItem(REFRESH_TOKEN_KEY);
      setUser(null);
    } catch (err) {
      setError('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return { user, error, loading, kakaologin, logout };
}
