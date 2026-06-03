/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Women Hood
        beige: {
          50:  '#fdfaf6',
          100: '#f9f2e8',
          200: '#f2e4d0',
          300: '#e8d0b0',
          400: '#d9b88a',
          500: '#c9a06a',
        },
        rose: {
          poudre: '#f0d6d6',
          doux:   '#e8c0c0',
          moyen:  '#d4a0a0',
          fonce:  '#b07878',
        },
        or: {
          clair:  '#f5e6b8',
          moyen:  '#d4a843',
          fonce:  '#a07820',
          accent: '#c8941e',
        },
        brun: {
          clair:  '#8b6f5e',
          moyen:  '#6b4f3e',
          fonce:  '#4a3228',
        },
      },
      fontFamily: {
        // Police élégante pour les titres
        display: ['Playfair Display', 'Georgia', 'serif'],
        // Police fine pour le corps de texte
        body:    ['Cormorant Garamond', 'Georgia', 'serif'],
        // Police sans-serif légère pour UI
        ui:      ['Jost', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'slide-in':   'slideIn 0.5s ease-out forwards',
        'shimmer':    'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
