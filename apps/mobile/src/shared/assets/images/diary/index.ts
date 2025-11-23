export const DIARY_ICONS = {
  iconDiaryCalendar: require('./icon-diary-calendar.png'),
  iconDiaryList: require('./icon-diary-list.png'),
} as const;

export type DiaryIconKey = keyof typeof DIARY_ICONS;
