export const TAGS = [
  'Diary',
  'User',
  'UserMeta',
  'Session',
  'VersionPolicy',
  'WeeklyProgress',
] as const;

export type TagType = (typeof TAGS)[number];
