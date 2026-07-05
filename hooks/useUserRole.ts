import { useCallback, useEffect, useState } from 'react';
import { getUserRole } from '../features/shared/apiClient';

/**
 * 저장된 사용자 역할(USER/ADMIN)을 읽는 훅.
 * 역할은 로그인/프로필 조회 시 features/auth/api.ts 가 저장합니다.
 * 아직 로딩 중이면 role 은 null 입니다.
 */
export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const stored = await getUserRole();
      setRole(stored);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { role, isAdmin: role === 'ADMIN', loaded, refresh };
}
