export const MAIN_ICONS = {
  logo: require('./splash/logo.png'),
  permission: require('./splash/permission.png'),

  avatar: require('./avatar/avatar.png'),
  avatarShadow: require('./avatar/avatar-shadow.png'),
  avatarComplete: require('./avatar/avatar-complete.png'),
  avatarEmpty: require('./avatar/avatar-empty.png'),

  homeActive: require('./tab/active/home-active.png'),
  homeInactive: require('./tab/inactive/home-inactive.png'),
  listActive: require('./tab/active/list-active.png'),
  listInactive: require('./tab/inactive/list-inactive.png'),
  settingsActive: require('./tab/active/settings-active.png'),
  settingsInactive: require('./tab/inactive/settings-inactive.png'),
  reportActive: require('./tab/active/report-active.png'),
  reportInactive: require('./tab/active/report-inactive.png'),
} as const;

export type MainIconKey = keyof typeof MAIN_ICONS;
