export type GetDiaryStreakArgs = {
  userId: string;
  today?: string;
};

export type DiaryStreakInfo = {
  baseDate: string;
  streakCount: number;
  dates: string[];
  reached7: boolean;
};
