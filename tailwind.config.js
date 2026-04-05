/** @type {import('tailwindcss').Config} */
// Tailwind v4: must be referenced from app/globals.css with @config.
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          'proud-pink': '#D6188F',
          'proud-blue': '#4DD4E8',
          'proud-pink-light': '#FDE8F3',
          'proud-blue-light': '#E8F9FC',
          'proud-dark': '#1A1A1A',
          'proud-gray': '#6B6B6B',
        },
        fontFamily: {
          'heading': ['Poppins', 'sans-serif'],
          'body': ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }