/**
 * 신고 사유 enum (백엔드 ReportRequest.reportType 실측 기반, 2026-07-05).
 * 채팅 메시지 신고(사용자)와 관리자 신고 관리 화면이 공유합니다.
 */
export type ReportType =
  | 'INAPPROPRIATE_LANGUAGE'
  | 'SEXUAL_LANGUAGE'
  | 'FINANCIAL_REQUEST'
  | 'ADVERTISEMENT'
  | 'SPAM'
  | 'OFFENSIVE'
  | 'OTHER';

/** Figma "신고하기" 화면 실측 문구 (사용자에게 보여줄 라벨) */
export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  INAPPROPRIATE_LANGUAGE: '부적절한 언행 및 욕설을 사용했어요',
  SEXUAL_LANGUAGE: '성적 언행 및 음란메세지를 보냈어요',
  FINANCIAL_REQUEST: '금전적 요구를 했어요',
  ADVERTISEMENT: '홍보/광고성 메세지를 보냈어요',
  SPAM: '스팸/도배를 했어요',
  OFFENSIVE: '불쾌한 대화를 했어요',
  OTHER: '기타',
};

/** 관리자 신고 목록 화면 등 짧은 표기가 필요한 곳에서 사용하는 라벨 */
export const REPORT_TYPE_SHORT_LABELS: Record<ReportType, string> = {
  INAPPROPRIATE_LANGUAGE: '부적절한 언어',
  SEXUAL_LANGUAGE: '성적인 언어',
  FINANCIAL_REQUEST: '금전 요구',
  ADVERTISEMENT: '광고',
  SPAM: '스팸',
  OFFENSIVE: '불쾌감 유발',
  OTHER: '기타',
};

export const REPORT_TYPES: ReportType[] = [
  'INAPPROPRIATE_LANGUAGE',
  'SEXUAL_LANGUAGE',
  'FINANCIAL_REQUEST',
  'ADVERTISEMENT',
  'SPAM',
  'OFFENSIVE',
  'OTHER',
];

/** 백엔드 ReportRequest.content 제약: 30~500자 */
export const REPORT_CONTENT_MIN_LENGTH = 30;
export const REPORT_CONTENT_MAX_LENGTH = 500;

export type ReportStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: '대기중',
  COMPLETED: '처리 완료',
  REJECTED: '반려',
};
