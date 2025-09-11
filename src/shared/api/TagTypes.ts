export const TAGS = ['Diary', 'User', 'UserMeta', 'Session', 'VersionPolicy'] as const;

export type TagType = (typeof TAGS)[number];
