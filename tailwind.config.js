/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Mono"', 'monospace'],
        sans: ['"Syne"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#070711',
        surface: '#0d0d1a',
        ink: '#e9e9f5',
        muted: '#8a8aa3',
        neon: {
          cyan: '#5eead4',
          blue: '#60a5fa',
          violet: '#a78bfa',
          pink: '#f0abfc',
        },
      },
      animation: {
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'grid': "linear-gradient(to right, rgba(167,139,250,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(167,139,250,0.06) 1px, transparent 1px)",
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow-cyan': '0 0 40px -8px rgba(94, 234, 212, 0.4)',
        'glow-violet': '0 0 40px -8px rgba(167, 139, 250, 0.5)',
        'glow-pink': '0 0 40px -8px rgba(240, 171, 252, 0.4)',
      },
    },
  },
  plugins: [],
};
