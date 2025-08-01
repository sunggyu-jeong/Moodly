export const DiaryPageMode = {
  listMode: 'LISTMODE',
  calendarMode: 'CALENDARMODE',
} as const;

export type DiaryPageModeType = (typeof DiaryPageMode)[keyof typeof DiaryPageMode];
