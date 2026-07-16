/**
 * 공지사항 / 고객센터 / 의견 남기기.
 * ⚠️ 백엔드 NoticeController 는 파일 자체가 없고, FeedbackController/Entity/Dto 는
 *    전부 빈 껍데기(`public class X {}`)입니다. 확인 전까지 mock 으로만 동작합니다.
 */

export interface Notice {
  id: string;
  title: string;
  content: string;
  publishedAt: string; // yyyy.MM.dd
}

export interface FaqCategory {
  id: string;
  label: string;
  answer: string;
}

/** POST 의견 남기기 — 백엔드 FeedbackRequestDto 가 빈 껍데기라 자체적으로 설계한 임시 형태 */
export interface FeedbackPayload {
  satisfaction: number; // 1~5
  content: string;
}

export type SupportApiResult = {
  ok: boolean;
  skipped?: boolean;
  message?: string;
};
