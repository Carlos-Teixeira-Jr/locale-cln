/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F75D5F',
        secondary: '#F5BF5D',
        tertiary: '#F7F7F6',
        quaternary: '#6B7280',
        quinary: '#FFFFFF',
      },
    },
    rccs: {
      size: '800px',
    },
  },
  plugins: [],
};
