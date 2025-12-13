/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary': '#009688', // your primary color hex code
        'grey': '#ccc',
      },
      boxShadow:{
        'lg': '1px 1px 6px 0px #00000038'
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
