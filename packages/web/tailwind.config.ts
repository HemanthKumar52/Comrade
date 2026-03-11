import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A3C5E',
          50: '#E8EEF4',
          100: '#C5D5E5',
          200: '#9BB5D0',
          300: '#7195BB',
          400: '#4D78A4',
          500: '#1A3C5E',
          600: '#163451',
          700: '#122B44',
          800: '#0E2237',
          900: '#0A192A',
        },
        accent: {
          DEFAULT: '#E8733A',
          50: '#FDF0E8',
          100: '#FAD9C5',
          200: '#F5BA96',
          300: '#F09B67',
          400: '#EC8750',
          500: '#E8733A',
          600: '#D45E24',
          700: '#B04E1E',
          800: '#8C3E18',
          900: '#682F12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(232,115,58,0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(232,115,58,0.8)' },
        },
        routeDraw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        pulseGlow: 'pulseGlow 2s infinite',
        routeDraw: 'routeDraw 3s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
