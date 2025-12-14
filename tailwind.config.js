/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#EDE6D4',
        deepBlue: '#140D82',
        limeGreen: '#BEC540',
        actionOrange: '#FD5E32',
        darkNeutral: '#1D1D1B',
        footerPurple: '#190087',
        popupCream: '#fff9e4',
        popupText: '#2000ad',
        iconGreen: '#bac706',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        accent: ['var(--font-accent)'],
        editorial: ['var(--font-heading)'],
        sans: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
};
