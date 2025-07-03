/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
} 