// /hooks/useRegister.ts
import { useState } from 'react';
import { signup, checkUserId } from '../features/auth/api';
import { ApiError } from '../features/shared/apiClient';
import type { AuthRequest, CheckAvailabilityResult } from '../features/auth/types';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [checkingLoading, setCheckingLoading] = useState(false);

  const register = async (
    payload: AuthRequest,
  ): Promise<{ ok: boolean; error?: string }> => {
    setLoading(true);
    try {
      await signup(payload);
      return { ok: true };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '서버 오류가 발생했습니다.';
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const checkingId = async (userId: string): Promise<CheckAvailabilityResult | null> => {
    setCheckingLoading(true);
    try {
      return await checkUserId(userId);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '중복 확인에 실패했습니다.';
      return { available: false, value: userId, type: 'userId', message };
    } finally {
      setCheckingLoading(false);
    }
  };

  return { register, checkingId, loading, checkingLoading };
}
