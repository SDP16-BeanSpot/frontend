import { FoundAccount, FoundPasswordAccount } from './types';

/** 데모용 조회 대상 전화번호 — 실제로는 백엔드가 SMS 인증된 번호로 계정을 찾아줘야 함 */
const DEMO_PHONE = '010-1111-1111';
const DEMO_USER_ID = 'beanspot2025';

export const findAccountsByPhone = (phone: string): FoundAccount[] => {
  if (phone !== DEMO_PHONE) return [];
  return [
    { type: 'kakao', label: '카카오 간편 로그인', userId: DEMO_USER_ID, joinedAt: '2025-03-12' },
    { type: 'local', label: '빈스팟 계정', userId: DEMO_USER_ID, joinedAt: '2025-03-12' },
  ];
};

export const findPasswordAccount = (
  userId: string,
  phone: string,
): FoundPasswordAccount | null => {
  if (userId !== DEMO_USER_ID || phone !== DEMO_PHONE) return null;
  return { userId: DEMO_USER_ID, maskedPassword: 'bean****25' };
};
