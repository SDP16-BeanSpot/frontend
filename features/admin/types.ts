import type { ReportStatus, ReportType } from '../shared/reportTypes';
export type { ReportStatus, ReportType } from '../shared/reportTypes';
export { REPORT_STATUS_LABELS, REPORT_TYPE_SHORT_LABELS as REPORT_TYPE_LABELS } from '../shared/reportTypes';

/**
 * 관리자용 공고/신고 API 타입 (Beanspot Backend Swagger 실측 기반, 2026-07-05).
 */

/** 공고 유형 (백엔드 enum) */
export type AnnouncementType = 'VOLUNTEER' | 'SUPPORTER' | 'EDUCATION' | 'CHALLENGE';

/** 공고 유형 한글 라벨 매핑 (UI 표시용) */
export const ANNOUNCEMENT_TYPE_LABELS: Record<AnnouncementType, string> = {
  VOLUNTEER: '봉사활동',
  SUPPORTER: '대외활동',
  EDUCATION: '교육/체험',
  CHALLENGE: '캠페인/이벤트',
};

/** 세부 일정 항목 (백엔드 ScheduleRequestDTO) */
export interface ScheduleItem {
  scheduleDate: string; // 예: "01.11"
  content: string;
}

/** POST /api/admin/announcement 의 request 파트 (백엔드 Create 스키마) */
export interface AnnouncementCreateRequest {
  // 필수
  title: string;
  organizer: string;
  type: AnnouncementType;
  imgUrl: string;
  region: string;
  location: string;
  activityMethod: string;
  recruitmentStart: string; // yyyy-MM-dd
  recruitmentEnd: string;
  startDate: string;
  endDate: string;
  activityContent: string;
  detailContent: string;
  // 선택
  organizerImgUrl?: string;
  target?: string;
  recruitmentCount?: string;
  applyMethod?: string;
  linkUrl?: string;
  fee?: number;
  benefits?: string;
  serviceHoursVerified?: string;
  selectionProcess?: string;
  teamSize?: string;
  awardScale?: string;
  schedules?: ScheduleItem[];
}

/** PUT /api/admin/announcement/{id} (백엔드 Update 스키마) */
export interface AnnouncementUpdateRequest {
  title?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
}

// ─── 신고 관리 ──────────────────────────────────────────────────────────────
// ReportType/ReportStatus 는 ../shared/reportTypes 에서 가져옵니다 (채팅 신고와 공유).

/** GET /api/admin/reports 목록 항목 (AdminReportListResponse) */
export interface AdminReportListItem {
  reportId: number;
  reporterNickname: string;
  reportedUserNickname: string;
  reportType: ReportType;
  status: ReportStatus;
  createdAt: string;
}

/** GET /api/admin/reports 페이지 응답 (PageResponseAdminReportListResponse) */
export interface AdminReportPage {
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
  items: AdminReportListItem[];
}

/** GET /api/admin/reports/{id} 상세 (AdminReportDetailResponse) */
export interface AdminReportDetail {
  reportId: number;
  reporterNickname: string;
  reportedUserNickname: string;
  reportType: ReportType;
  content: string;
  messageContent: string;
  status: ReportStatus;
  createdAt: string;
}
