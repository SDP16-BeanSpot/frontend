/**
 * 사용자 프로필.
 *
 * 조회는 백엔드 GET /api/user/me (UserProfileDTO) 와 대응됩니다.
 *
 * ⚠️ 프로필 수정 엔드포인트는 백엔드에 아직 없습니다.
 *    User 엔티티에 updateProfile(nickname, profileUrl) 메서드는 있지만
 *    이를 노출하는 컨트롤러/서비스가 없고 UserProfileUpdateDto 도 빈 스텁입니다.
 *    그래서 수정 결과는 기기에 로컬 저장해 화면 간 유지되도록 합니다.
 *    백엔드에 PATCH /api/user/me 가 생기면 api.ts 의 updateMyProfile 이
 *    자동으로 서버 저장으로 전환됩니다(실패 시에만 로컬 폴백).
 */

export interface UserProfile {
  id?: number;
  userId?: string;
  nickname: string;
  name?: string;
  /** 프로필 이미지 URI. 로컬 선택 이미지이거나 서버 URL */
  profileUrl?: string | null;
}

export interface ProfileUpdatePayload {
  nickname: string;
  profileUrl?: string | null;
}

export const DEFAULT_NICKNAME = '빈스팟';
export const NICKNAME_MAX_LENGTH = 14;
