const colors = require('./src/shared/styles/colors').default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
    colors: {
      common: colors.common,
      primary: colors.primary,
      gray: colors.gray,
    },
  },
  plugins: [],
};
