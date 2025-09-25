/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        spartan: ['"League Spartan Variable"', 'sans-serif'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.spartan').join(',')
          },
        },
      }),
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: ['cupcake', 'dark'],
  },
};
