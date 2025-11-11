export type Diary = {
  userId: string;
  emotionId: number;
  iconId: number;
  recordDate: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateDiaryInput = {
  userId: string;
  iconId: number;
  recordDate: string;
  description?: string | null;
  createdAt?: string;
};

export type UpdateDiaryInput = {
  userId: string;
  emotionId?: number;
  iconId?: number;
  description?: string | null;
  updatedAt?: string;
};

export type MonthlyQuery = {
  userId: string;
  month: string;
};

export type DbDiaryRow = {
  emotion_id: number;
  user_id: string;
  icon_id: number;
  record_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type DiaryDateRangeQuery = { start: string; end: string };
