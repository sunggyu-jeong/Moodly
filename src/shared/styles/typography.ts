export const typography = {
  h1: {
    lineHeight: '1.4',
    letterSpacing: '-0.012em',
    weight: { semibold: '600', regular: '400' },
  },
  h2: {
    lineHeight: '1.33',
    letterSpacing: '-0.012em',
    weight: { semibold: '600', regular: '400' },
  },
  h3: {
    lineHeight: '1.44',
    letterSpacing: '-0.002em',
    weight: { semibold: '600', regular: '400' },
  },
  body1: {
    lineHeight: '1.5',
    letterSpacing: '0.0057em',
    weight: { semibold: '600', regular: '400' },
  },
  body2: {
    lineHeight: '1.5',
    letterSpacing: '0.0096em',
    weight: { semibold: '600', regular: '400' },
  },
  label: {
    lineHeight: '1.4',
    letterSpacing: '-0.004em',
    weight: { semibold: '600', regular: '400' },
  },
  caption: {
    lineHeight: '1.33',
    letterSpacing: '0.022em',
    weight: { semibold: '600', regular: '400' },
  },
} as const;

export type TypographyToken = keyof typeof typography;
export default typography;
