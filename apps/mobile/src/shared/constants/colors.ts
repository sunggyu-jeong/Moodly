export enum ColorKeyEnum {
  /** Primary color: #5168DB */
  Primary = 'primary',
  /** Disabled color: #C6C9D7 */
  Disabled = 'disabled',
  /** White color: #FFFFFF */
  White = 'background',
  /** Accent color: #FF5722 */
  Accent = 'accent',
}

export const COLORS: Record<ColorKeyEnum, string> = {
  [ColorKeyEnum.Primary]: '#5168DB',
  [ColorKeyEnum.Disabled]: '#C6C9D7',
  [ColorKeyEnum.White]: '#FFFFFF',
  [ColorKeyEnum.Accent]: '#FF5722',
} as const;

export function getColor(name: ColorKeyEnum): string {
  return COLORS[name];
}
