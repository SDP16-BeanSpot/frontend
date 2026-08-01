import {
  api,
  isApiConfigured,
  tokenStorage,
  unwrap,
  type ApiEnvelope,
} from '../shared/apiClient';
import { DEFAULT_NICKNAME, type ProfileUpdatePayload, type UserProfile } from './types';

const LOCAL_PROFILE_KEY = 'local_user_profile';

type ApiResult = { ok: boolean; skipped?: boolean };

/** 로컬에 저장해둔 프로필 수정분 (백엔드 수정 엔드포인트가 없어 기기에 보관) */
const readLocalProfile = async (): Promise<Partial<UserProfile>> => {
  const raw = await tokenStorage.get(LOCAL_PROFILE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Partial<UserProfile>;
  } catch {
    return {};
  }
};

const writeLocalProfile = async (patch: Partial<UserProfile>): Promise<void> => {
  const current = await readLocalProfile();
  await tokenStorage.set(LOCAL_PROFILE_KEY, JSON.stringify({ ...current, ...patch }));
};

/**
 * 내 프로필 조회.
 * 서버 값 위에 로컬 수정분을 덮어써서 반환합니다
 * (수정 엔드포인트가 없는 동안 화면 간 일관성 유지).
 */
export const fetchMyProfile = async (): Promise<UserProfile> => {
  const local = await readLocalProfile();
  const fallback: UserProfile = { nickname: DEFAULT_NICKNAME, ...local };

  if (!isApiConfigured()) return fallback;

  try {
    const server = unwrap(await api.get<ApiEnvelope<UserProfile>>('/api/user/me'));
    return { ...server, ...local };
  } catch {
    return fallback;
  }
};

/**
 * 내 프로필 수정.
 * 백엔드에 수정 엔드포인트가 생기면 그쪽으로 저장되고, 없으면 로컬에만 저장됩니다.
 * 어느 쪽이든 로컬에도 남겨 화면 간 표시가 일관되게 유지됩니다.
 */
export const updateMyProfile = async (payload: ProfileUpdatePayload): Promise<ApiResult> => {
  await writeLocalProfile(payload);

  if (!isApiConfigured()) return { ok: true, skipped: true };

  try {
    await api.patch('/api/user/me', payload);
    return { ok: true };
  } catch {
    // 아직 서버에 대응 엔드포인트가 없음 — 로컬 저장은 위에서 이미 완료
    return { ok: true, skipped: true };
  }
};
