import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { login, logout as kakaoLogout, me, isLogined } from '@react-native-kakao/user';
import type { KakaoUser } from '@react-native-kakao/user';

const TOKEN_KEY = 'user_jwt_token';
const REFRESH_TOKEN_KEY = 'user_jwt_refresh_token';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

// SecureStore는 웹에서 동작 안 하므로 플랫폼 분기
const storage = {
  get: async (key: string) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  set: async (key: string, value: string) => {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    await SecureStore.setItemAsync(key, value);
  },
  remove: async (key: string) => {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
    await SecureStore.deleteItemAsync(key);
  },
};

interface KakaoAuthHook {
  user: KakaoUser | null;
  error: string;
  loading: boolean;
  kakaologin: () => Promise<void>;
  logout: () => Promise<void>;
}

export default function useKakaoAuth(): KakaoAuthHook {
  const [user, setUser] = useState<KakaoUser | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 앱 시작 시 자동 로그인 확인
  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    setLoading(true);
    try {
      const loggedIn = await isLogined();
      if (!loggedIn) return;

      if (API_BASE) {
        // 백엔드가 있을 때: 저장된 JWT로 유저 정보 요청
        const token = await storage.get(TOKEN_KEY);
        if (token) {
          const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            await handleLogout();
          }
        }
      } else {
        // 백엔드 없을 때: 카카오 SDK에서 직접 유저 정보
        const kakaoUser = await me();
        setUser(kakaoUser);
      }
    } catch (e) {
      console.error('자동 로그인 실패:', e);
    } finally {
      setLoading(false);
    }
  };

  const kakaologin = async () => {
    setError('');
    setLoading(true);
    try {
      // 1. 카카오 SDK로 로그인 → access token 획득
      const tokenInfo = await login();

      if (API_BASE) {
        // 2a. 백엔드가 있을 때: access token을 백엔드로 전달 → JWT 발급
        const res = await fetch(`${API_BASE}/api/auth/kakao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: tokenInfo.accessToken }),
        });
        const result = await res.json();

        if (res.ok && result.user) {
          setUser(result.user);
          if (result.token) await storage.set(TOKEN_KEY, result.token);
          if (result.refreshToken) await storage.set(REFRESH_TOKEN_KEY, result.refreshToken);
        } else {
          setError(result.error ?? '백엔드 인증 실패');
        }
      } else {
        // 2b. 백엔드 없을 때: 카카오 SDK에서 유저 정보 직접 사용 (개발 단계)
        const kakaoUser = await me();
        setUser(kakaoUser);
      }
    } catch (e: any) {
      const msg = e?.message ?? '카카오 로그인 실패';
      // 사용자가 취소한 경우는 에러로 표시하지 않음
      if (!msg.includes('cancel') && !msg.includes('Cancel')) {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await kakaoLogout();
    } catch {}
    await storage.remove(TOKEN_KEY);
    await storage.remove(REFRESH_TOKEN_KEY);
    setUser(null);
  };

  return { user, error, loading, kakaologin, logout: handleLogout };
}
