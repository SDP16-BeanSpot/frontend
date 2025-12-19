// /hooks/useKakaoAuth.ts
import { useState } from 'react';
import * as AuthSession from 'expo-auth-session';

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
}

export default function useKakaoAuth(): KakaoAuthHook {
  const [user, setUser] = useState<KakaoUser | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 서버로 access_token을 전달하는 함수 (별도 분리 가능)
  // async function sendTokenToBackend(accessToken: string): Promise<ServerUser | null> {
  //   try {
  //     const response = await fetch('https://your-backend.com/api/auth/kakao', { // 실제 서버 URL로 교체
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ access_token: accessToken })
  //     });
  //     const data = await response.json();
  //     if (data.success && data.user) {
  //       // 서버 회원정보 반환
  //       return data.user;
  //     } else {
  //       setError(data.error || '서버 회원 인증 실패');
  //       return null;
  //     }
  //   } catch (err: any) {
  //     setError('서버 통신 에러');
  //     return null;
  //   }
  // }

  const kakaologin = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const REST_API_KEY = 'dcc3060fb81d292dabe5c0e380d3525f'; // 본인 앱 키로 대체
      const REDIRECT_URI = AuthSession.makeRedirectUri();
      const discovery = {
        authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
        tokenEndpoint: 'https://kauth.kakao.com/oauth/token',
      };

      const authRequest = new AuthSession.AuthRequest({
        clientId: REST_API_KEY,
        redirectUri: REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        scopes: ['profile_image', 'profile_nickname', 'account_email'],
      });

      const result = await authRequest.promptAsync(discovery);

      // 성공 시 code 획득
      if (result.type === 'success' && result.params.code) {
        const code = result.params.code;

        // 토큰 교환
        const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code=${code}`,
        });
        const tokenData = await tokenRes.json();

        //[중요] access_token → 서버로 POST (이 부분만 수정)
        // const backendUser = await sendTokenToBackend(tokenData.access_token);
        // if (backendUser) {
        //   setUser(backendUser); // 서버 회원정보로 앱 상태 업데이트
        // }
        // 카카오 API로 직접 유저 정보 받아오는 경우 아래 코드 (서버 없는 경우만):
        const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
        });
        const userInfo: KakaoUser = await userRes.json();
        setUser(userInfo);
      } else {
        setError('카카오 로그인 실패');
      }
    } catch (e: any) {
      setError(e?.message || '로그인 에러');
    }
    setLoading(false);
  };

  return { user, error, loading, kakaologin };
}
