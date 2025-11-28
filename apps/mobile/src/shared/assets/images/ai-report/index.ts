export const AI_ICONS = {
  iconAvatarWrite: require('./icon-avatar-write.png'),
  iconReportSuccess: require('./icon-report-success.png'),
  iconReportFail: require('./icon-report-fail.png'),
} as const;

export type AiIconKey = keyof typeof AI_ICONS;
