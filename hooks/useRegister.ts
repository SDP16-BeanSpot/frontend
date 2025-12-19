// /hooks/useRegister.ts
import { useState } from 'react';

interface RegisterResult {
  success: boolean;
  user?: {
    id: number;
    email: string;
    nickname: string;
    // 필요시 추가
  };
  token?: string; // JWT 등
  error?: string;
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<RegisterResult['user'] | null>(null);

  const register = async (email: string, password: string, nickname: string) => {
    setLoading(true);
    setError('');
    setUser(null);

    try {
      const response = await fetch('https://your-backend.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname }),
      });
      const result: RegisterResult = await response.json();

      if (result.success) {
        setUser(result.user || null);
      } else {
        setError(result.error || '회원가입 실패');
      }
    } catch (e: any) {
      setError(e?.message || '서버 오류');
    }
    setLoading(false);
  };

  return { register, loading, error, user };
}
