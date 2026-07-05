import { api, unwrap, type ApiEnvelope } from '../shared/apiClient';
import type {
  AdminReportDetail,
  AdminReportPage,
  AnnouncementCreateRequest,
  AnnouncementUpdateRequest,
  ReportStatus,
} from './types';

// ─── 공고 관리 (관리자 전용, bearerAuth) ────────────────────────────────────

/**
 * 공고 등록 — multipart/form-data { request: Create(JSON), image?: binary }.
 * image 는 expo-image-picker 등에서 얻은 로컬 URI 를 RN FormData 파일 형태로 전달.
 */
export const createAnnouncement = async (
  request: AnnouncementCreateRequest,
  image?: { uri: string; name: string; type: string },
): Promise<string> => {
  const form = new FormData();
  // RN 의 FormData 는 JSON 파트를 Blob 으로 만들 수 없어 문자열로 첨부합니다.
  // 서버(Spring)가 request 파트를 application/json 으로 요구하면
  // { string, type } 형태 캐스팅이 필요할 수 있음 — 실패 시 백엔드 팀과 파트 타입 협의.
  form.append('request', JSON.stringify(request));
  if (image) {
    form.append('image', image as unknown as Blob);
  }
  return unwrap(await api.post<ApiEnvelope<string>>('/api/admin/announcement', form));
};

export const updateAnnouncement = async (
  id: number,
  payload: AnnouncementUpdateRequest,
): Promise<string> =>
  unwrap(await api.put<ApiEnvelope<string>>(`/api/admin/announcement/${id}`, payload));

export const deleteAnnouncement = async (id: number): Promise<string> =>
  unwrap(await api.del<ApiEnvelope<string>>(`/api/admin/announcement/${id}`));

// ─── 신고 관리 (관리자 전용) ────────────────────────────────────────────────

/** 신고 목록 (페이지당 20개 고정, 최신순) */
export const fetchAdminReports = async (
  page = 0,
  status?: ReportStatus,
): Promise<AdminReportPage> =>
  unwrap(
    await api.get<ApiEnvelope<AdminReportPage>>('/api/admin/reports', {
      params: { page, status },
    }),
  );

export const fetchAdminReportDetail = async (reportId: number): Promise<AdminReportDetail> =>
  unwrap(await api.get<ApiEnvelope<AdminReportDetail>>(`/api/admin/reports/${reportId}`));

/** 신고 처리 — status: COMPLETED(처리 완료) 또는 REJECTED(반려) */
export const processAdminReport = async (
  reportId: number,
  status: Exclude<ReportStatus, 'PENDING'>,
): Promise<AdminReportDetail> =>
  unwrap(
    await api.patch<ApiEnvelope<AdminReportDetail>>(`/api/admin/reports/${reportId}`, { status }),
  );
