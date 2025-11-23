export const AUTH_ICONS = {
  google: require('./google.png'),
  apple: require('./apple.png'),
} as const;

export type AuthIconKey = keyof typeof AUTH_ICONS;
