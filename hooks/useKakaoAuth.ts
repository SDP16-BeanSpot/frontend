import { useState, useEffect } from 'react';
import { login as kakaoNativeLogin, logout as kakaoLogout, me, isLogined } from '@react-native-kakao/user';
import type { KakaoUser } from '@react-native-kakao/user';
import { kakaoSignup, login as backendLogin } from '../features/auth/api';
import { ApiError, clearAccessToken, getAccessToken, isApiConfigured } from '../features/shared/apiClient';
import type { AuthRequest } from '../features/auth/types';

/**
 * 백엔드 /api/auth/oauth/kakao/signup 은 Kakao 전용 데이터(토큰/코드)를 받지 않고
 * 일반 회원가입과 동일한 Req(userId/password/nickname/name)만 받습니다.
 * 즉 서버가 실제로 "카카오로 인증된 사용자인지" 검증하는 절차는 문서상 확인되지 않습니다.
 *
 * 이 훅은 카카오 네이티브 SDK로 프로필을 가져온 뒤, 그 정보로 파생된 userId/password를
 * 만들어 kakaoSignup 을 호출합니다. 이미 가입된 사용자는 kakaoSignup 이 실패할 것으로
 * 예상되어 동일 파생 계정으로 일반 login 을 재시도합니다(signup → 실패 시 login 폴백).
 *
 * ⚠️ password 는 kakaoId 기반으로 "결정적으로" 생성한 더미 값입니다(사용자가 직접 입력하지
 *    않음). 백엔드가 카카오 토큰을 실제로 검증하는 방식으로 바뀌면 이 부분을 교체하세요.
 */
function deriveBackendCredentials(kakaoUser: KakaoUser): AuthRequest {
  const kakaoId = String(kakaoUser.id);
  const nickname = kakaoUser.nickname?.slice(0, 14) || `빈스팟${kakaoId.slice(-6)}`;
  return {
    userId: `kakao_${kakaoId}`.slice(0, 14),
    // TODO: 백엔드가 카카오 토큰 검증 방식을 지원하면 이 더미 비밀번호 생성 로직을 제거하세요.
    password: `Kakao!${kakaoId}`,
    nickname,
    name: nickname,
  };
}

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

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    setLoading(true);
    try {
      const loggedIn = await isLogined();
      if (!loggedIn) return;

      const kakaoUser = await me();
      setUser(kakaoUser);

      // 카카오 세션은 있는데 백엔드 JWT 가 없으면(첫 실행 등) 백엔드 인증도 갱신
      if (isApiConfigured()) {
        const existingToken = await getAccessToken();
        if (!existingToken) {
          await authenticateWithBackend(kakaoUser);
        }
      }
    } catch (e) {
      console.error('자동 로그인 실패:', e);
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithBackend = async (kakaoUser: KakaoUser) => {
    const credentials = deriveBackendCredentials(kakaoUser);
    try {
      await kakaoSignup(credentials);
    } catch (signupErr) {
      // 이미 가입된 계정으로 추정 → 동일 파생 계정으로 로그인 재시도
      try {
        await backendLogin({ userId: credentials.userId, password: credentials.password });
      } catch (loginErr) {
        const message = loginErr instanceof ApiError ? loginErr.message : '백엔드 인증 실패';
        throw new Error(message);
      }
    }
  };

  const kakaologin = async () => {
    setError('');
    setLoading(true);
    try {
      await kakaoNativeLogin();
      const kakaoUser = await me();
      setUser(kakaoUser);

      if (isApiConfigured()) {
        await authenticateWithBackend(kakaoUser);
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
    await clearAccessToken();
    setUser(null);
  };

  return { user, error, loading, kakaologin, logout: handleLogout };
}
