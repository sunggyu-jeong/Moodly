export const SETTING_ICONS = {
  modifyNickname: require('./icon-modify.png'),
} as const;

export type SettingIconKeys = keyof typeof SETTING_ICONS;
