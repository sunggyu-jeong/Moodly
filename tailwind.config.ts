import type { Config } from 'tailwindcss';

// @ts-ignore
const colors = require('./src/shared/styles/colors');
// @ts-ignore
const typography = require('./src/shared/styles/typography');

const config: Config = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        title: [
          typography.title.size,
          {
            lineHeight: typography.title.lineHeight,
            letterSpacing: typography.title.letterSpacing,
          },
        ],
        h1: [
          typography.h1.size,
          {
            lineHeight: typography.h1.lineHeight,
            letterSpacing: typography.h1.letterSpacing,
          },
        ],
        h2: [
          typography.h2.size,
          {
            lineHeight: typography.h2.lineHeight,
            letterSpacing: typography.h2.letterSpacing,
          },
        ],
        h3: [
          typography.h3.size,
          {
            lineHeight: typography.h3.lineHeight,
            letterSpacing: typography.h3.letterSpacing,
          },
        ],
        body1: [
          typography.body1.size,
          {
            lineHeight: typography.body1.lineHeight,
            letterSpacing: typography.body1.letterSpacing,
          },
        ],
        body2: [
          typography.body2.size,
          {
            lineHeight: typography.body2.lineHeight,
            letterSpacing: typography.body2.letterSpacing,
          },
        ],
        label: [
          typography.label.size,
          {
            lineHeight: typography.label.lineHeight,
            letterSpacing: typography.label.letterSpacing,
          },
        ],
        caption: [
          typography.caption.size,
          {
            lineHeight: typography.caption.lineHeight,
            letterSpacing: typography.caption.letterSpacing,
          },
        ],
      },
      fontWeight: {
        regular: typography.body1.weight.regular,
        semibold: typography.body1.weight.semibold,
      },
    },
    colors: {
      common: colors.common,
      primary: colors.primary,
      gray: colors.gray,
    },
  },
  plugins: [],
};

export default config;