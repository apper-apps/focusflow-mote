/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F2F1FE',
          100: '#E6E3FD',
          500: '#5B4CDB',
          600: '#4D3FBA',
          700: '#3F3298',
        },
        secondary: {
          50: '#FEF9E7',
          100: '#FDF3CF',
          500: '#F7B733',
          600: '#E5A632',
          700: '#D39531',
        },
        accent: {
          50: '#FFF1EE',
          100: '#FFE3DD',
          500: '#FC4A1A',
          600: '#E54218',
          700: '#CE3A16',
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        surface: '#FFFFFF',
        background: '#F8F9FA',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-xl': '3rem',
        'display-lg': '2.4rem',
        'display-md': '1.92rem',
        'display-sm': '1.54rem',
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 0.5s ease-in-out',
        'scale-up': 'scale-up 0.15s ease-out',
        'confetti': 'confetti 0.5s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'scale-up': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
        'confetti': {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      dropShadow: {
        'soft': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 8px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 16px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}