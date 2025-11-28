export const AI_ICONS = {
  iconAvatarWrite: require('./icon-avatar-write.png'),
  iconReportSuccess: require('./icon-report-success.png'),
  iconReportFail: require('./icon-report-fail.png'),
  iconReportWriting: require('./icon-report-writing.png'),
  iconReportWriting1: require('./icon-report-writing1.png'),
  iconReportComplete1: require('./icon-report-complete1.png'),
  iconReportComplete2: require('./icon-report-complete2.png'),
  iconReportComplete3: require('./icon-report-complete3.png'),
} as const;

export type AiIconKey = keyof typeof AI_ICONS;
