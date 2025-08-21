// windi.config.js
import {defineConfig} from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['src/**/*.{vue,js,ts,html,jsx,tsx}'],
    exclude: ['node_modules', '.git'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  plugins: [],
})
