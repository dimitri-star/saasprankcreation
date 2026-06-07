/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        noir: {
          DEFAULT: '#0A0A0A',
          900: '#0A0A0A',
          800: '#101010',
          700: '#161616',
          600: '#1C1C1C',
          500: '#242424',
        },
        bleu: {
          DEFAULT: '#3B82F6',
          light: '#38BDF8',
          dark: '#2563EB',
          glow: 'rgba(59, 130, 246, 0.35)',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.28em',
      },
      boxShadow: {
        bleu: '0 0 0 1px rgba(59,130,246,0.4), 0 18px 60px -18px rgba(59,130,246,0.5)',
        card: '0 24px 80px -32px rgba(0,0,0,0.85)',
      },
      backgroundImage: {
        'bleu-line': 'linear-gradient(90deg, transparent, #3B82F6, transparent)',
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        reveal: {
          '0%': { opacity: '0', filter: 'brightness(0.2) blur(12px)' },
          '100%': { opacity: '1', filter: 'brightness(1) blur(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 1s ease both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        reveal: 'reveal 1.2s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 70s linear infinite',
        'marquee-rev': 'marquee-rev 90s linear infinite',
      },
    },
  },
  plugins: [],
}
