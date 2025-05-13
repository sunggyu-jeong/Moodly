export const typography = {
  h1: {
    size: '22px',
    lineHeight: '1.4',
    letterSpacing: '-0.012em',
    weight: { semibold: '600', regular: '400' },
  },
  h2: {
    size: '20px',
    lineHeight: '1.33',
    letterSpacing: '-0.012em',
    weight: { semibold: '600', regular: '400' },
  },
  h3: {
    size: '18px',
    lineHeight: '1.44',
    letterSpacing: '-0.002em',
    weight: { semibold: '600', regular: '400' },
  },
  body1: {
    size: '16px',
    lineHeight: '1.5',
    letterSpacing: '0.0057em',
    weight: { semibold: '600', regular: '400' },
  },
  body2: {
    size: '15px',
    lineHeight: '1.5',
    letterSpacing: '0.0096em',
    weight: { semibold: '600', regular: '400' },
  },
  label: {
    size: '14px',
    lineHeight: '1.4',
    letterSpacing: '-0.004em',
    weight: { semibold: '600', regular: '400' },
  },
  caption: {
    size: '12px',
    lineHeight: '1.33',
    letterSpacing: '0.022em',
    weight: { semibold: '600', regular: '400' },
  },
} as const;

export type TypographyToken = keyof typeof typography;
export default typography;
