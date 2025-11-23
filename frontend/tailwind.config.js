/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aquí agregamos tus colores Cyberpunk personalizados
        'neon-blue': '#00f3ff',
        'neon-pink': '#ff00ff',
        'cyber-black': '#0a0a0a',
        'cyber-gray': '#1a1a1a'
      }
    },
  },
  plugins: [],
}