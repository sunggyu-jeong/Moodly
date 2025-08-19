export const TAGS = ['Diary', 'User', 'UserMeta', 'Session'] as const;

export type TagType = (typeof TAGS)[number];
