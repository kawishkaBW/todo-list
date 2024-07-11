/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      //colours
      colors:{
        primary:'#2b85ff',
        secondary:'#ef863e',
      }
    },
  },
  plugins: [],
}

