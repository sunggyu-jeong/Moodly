export const DiaryPageMode = {
  listMode: 'LISTMODE',
  calendarMode: 'CALENDARMODE',
} as const;

export const DiaryCalendarMode = {
  weekDayMode: 'WEEKDAYMODE',
  monthDayMode: 'MONTHDAYMODE',
} as const;

export type DiaryCalendarModeType =
  | typeof DiaryCalendarMode.weekDayMode
  | typeof DiaryCalendarMode.monthDayMode;

export type DiaryPageModeType = (typeof DiaryPageMode)[keyof typeof DiaryPageMode];
