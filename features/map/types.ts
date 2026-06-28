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

export type ApiResult = {
  ok: boolean;
  skipped?: boolean;
};
