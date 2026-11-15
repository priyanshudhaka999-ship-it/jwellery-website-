/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          main: '#FAF8F4',
          secondary: '#F4EEE5',
          card: '#F7F2EA',
          border: '#E9DED0',
        },
        gold: {
          primary: '#C89B5C',
          secondary: '#D8B982',
        },
        espresso: {
          main: '#3C2B20',
          muted: '#827466',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
