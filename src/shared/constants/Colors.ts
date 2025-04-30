export enum ColorKeyEnum {
  /** Primary color: #000000 */
  Primary = 'primary',
  /** Disabled color: #A8A8A8 */
  Disabled = 'disabled',
  /** Background color: #FFFFFF */
  Background = 'background',
  /** Accent color: #FF5722 */
  Accent = 'accent',
}

export const COLORS: Record<ColorKeyEnum, string> = {
  [ColorKeyEnum.Primary]: '#000000',
  [ColorKeyEnum.Disabled]: '#A8A8A8',
  [ColorKeyEnum.Background]: '#FFFFFF',
  [ColorKeyEnum.Accent]: '#FF5722',
} as const;

export function getColor(name: ColorKeyEnum): string {
  return COLORS[name];
}
