import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef3f9',
          100: '#d9e4f0',
          200: '#b8cce0',
          300: '#8aaecf',
          400: '#5c8db8',
          500: '#3d6f9a',
          600: '#2a5580',
          700: '#1e4066',
          800: '#132f43',
          900: '#0b1a2e',
        },
        accent: {
          50: '#fff6ed',
          100: '#ffe9d2',
          200: '#ffcf9f',
          300: '#ffad63',
          400: '#fb8b34',
          500: '#f97316',
          600: '#ea590c',
          700: '#c2440c',
          800: '#9a3712',
          900: '#7c3012',
        },
        ink: {
          900: '#0b2436',
          800: '#132f43',
          600: '#33495a',
          500: '#4d6273',
          400: '#6c8091',
          300: '#93a3b1',
        },
        neutral: {
          50: '#ffffff',
          100: '#f6f5f3',
          200: '#eeece8',
          300: '#e2ded7',
        },
        amber: {
          500: '#f59e0b',
        },
        success: {
          500: '#16a34a',
        },
        danger: {
          500: '#e11d48',
        },
      },
      fontFamily: {
        heading: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'var(--font-noto-ethiopic)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
        card: '1rem',
        'card-lg': '1.125rem',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(11, 36, 54, 0.08)',
        card: '0 16px 34px rgba(11, 36, 54, 0.07)',
        hero: '0 24px 70px rgba(11, 36, 54, 0.16)',
        cta: '0 14px 26px rgba(249, 115, 22, 0.28)',
        lift: '0 20px 40px rgba(11, 36, 54, 0.12)',
      },
      backgroundImage: {
        'hero-scrim': 'linear-gradient(180deg, rgba(11,36,54,0.05) 0%, rgba(11,36,54,0.55) 100%)',
        'primary-gradient': 'linear-gradient(135deg, #0b1a2e 0%, #1e4066 50%, #2a5580 100%)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.12)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-16px) translateX(8px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(14px) translateX(-10px)' },
        },
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        kenburns: 'kenburns 7s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'progress-fill': 'progress-fill linear forwards',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
