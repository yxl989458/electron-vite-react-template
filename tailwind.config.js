/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'lucida': ['Lucida Grande', 'system-ui', 'sans-serif']
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
