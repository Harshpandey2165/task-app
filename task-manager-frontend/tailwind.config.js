/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#4F46E5', // Indigo
          secondary: '#7C3AED', // Purple
          gray: {
            100: '#F3F4F6', // Light gray
            200: '#E5E7EB',
            600: '#4B5563',
            800: '#1F2A44', // Dark gray
          },
        },
      },
    },
    plugins: [],
  };