export const TAGS = [
  'Diary',
  'User',
  'UserMeta',
  'Session',
  'VersionPolicy',
  'WeeklyProgress',
  'AiJob',
  'DiaryCount',
  'WeeklyReportStatus',
] as const;

export type TagType = (typeof TAGS)[number];
