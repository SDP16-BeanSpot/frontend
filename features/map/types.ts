export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  latitude: number;
  longitude: number;
  category: string;
  thumbnail: string;
  workType: string;
  deadline: string;
  description?: string;
}

/** 지도에 보이는 영역 (백엔드 GET /api/announcement 의 geo 파라미터와 이름을 맞춤) */
export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/** 백엔드 AnnouncementSummaryDTO 와 대응 */
export interface AnnouncementSummaryDTO {
  id: number;
  title: string;
  region?: string;
  activityMethod?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  recruitmentEnd?: string;
  thumbnailUrl?: string;
  organizer?: string;
  lat?: number | null;
  lng?: number | null;
}

export type ApiResult = {
  ok: boolean;
  skipped?: boolean;
};
