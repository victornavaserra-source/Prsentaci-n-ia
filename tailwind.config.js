/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#020818',
        surface: '#0a1628',
        cyan: { 300: '#33ddff', 400: '#00d4ff', 500: '#00aacc' },
        purple: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
        green: { 400: '#34d399', 500: '#10b981' },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: { md: '12px', lg: '20px', xl: '40px' },
      animation: {
        'sine-move': 'sineMove 3s linear infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'blink': 'blink 1.5s ease-in-out infinite',
        'draw-line': 'drawLine 2.5s cubic-bezier(0.23,1,0.32,1) forwards',
      },
      keyframes: {
        sineMove: {
          '0%': { strokeDashoffset: '60' },
          '100%': { strokeDashoffset: '0' },
        },
        pulseSlow: {
          '0%,100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(0,212,255,0.3)' },
          '50%': { boxShadow: '0 0 50px rgba(0,212,255,0.7), 0 0 100px rgba(0,212,255,0.3)' },
        },
        blink: {
          '0%,100%': { opacity: '0.2' },
          '50%': { opacity: '0.9' },
        },
        drawLine: {
          from: { strokeDashoffset: '1000' },
          to: { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
