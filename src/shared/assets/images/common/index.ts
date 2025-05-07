export const COMMON_ICONS = {
  iconBackup: require('./icon-backup.png'),
  iconClose: require('./icon-close.png'),
  iconDelete: require('./icon-delete.png'),
  iconEdit: require('./icon-edit.png'),
  iconFeedback: require('./icon-feedback.png'),
  iconMore: require('./icon-more.png'),
  iconNext: require('./icon-next.png'),
  iconPrevTight: require('./icon-prev-tight.png'),
  iconPrev: require('./icon-prev.png'),
  iconWrite: require('./icon-write.png'),
  iconWriteCircle: require('./icon-write-circle.png'),
  iconNextGray: require('./icon-next-gray.png'),
} as const;

export type CommonIconKey = keyof typeof COMMON_ICONS;
