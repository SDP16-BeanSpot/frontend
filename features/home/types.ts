export type Banner = {
  id: string;
  tag: string;
  text: string;
  icon: string; // MaterialCommunityIcons name
};

export type Garden = {
  id:string;
  dDay: string;
  category: string;
  title: string;
  activityPeriod: string;
  locationTags: string[];
  isFavorite: boolean;
  imageUrl: string;
};

export type ApiResult = {
  ok: boolean;
  skipped?: boolean;
};
