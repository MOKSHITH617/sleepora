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
          DEFAULT: '#2E221A', // Luxury Primary Dark
          light: '#3E3026',   // Luxury Secondary Dark
          lighter: '#5A483B', // Deep Walnut
        },
        accent: {
          DEFAULT: '#A27B5C', // Luxury Gold/Wood Accent
          hover: '#BD9A7A',   // Warm Wood Highlight
          light: '#F4F1EC',   // Warm Ivory
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
        },
        bg: {
          dark: '#2E221A',    // Primary Dark Base
          light: '#F4F1EC',   // Warm Ivory Background
          card: '#FFFDFC',    // Pure Luxury Card Background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(32, 23, 18, 0.06)',
        md: '0 8px 24px rgba(32, 23, 18, 0.09)',
        lg: '0 16px 40px -4px rgba(32, 23, 18, 0.16)',
        xl: '0 24px 60px -8px rgba(32, 23, 18, 0.22)',
        gold: '0 10px 28px rgba(139, 104, 68, 0.25)',
        glass: '0 8px 32px 0 rgba(32, 23, 18, 0.08)',
        luxury: '0 12px 36px rgba(32, 23, 18, 0.12)',
      },
      fontSize: {
        'xs': ['0.85rem', { lineHeight: '1.3rem' }],
        'sm': ['0.95rem', { lineHeight: '1.45rem' }],
        'base': ['1.1rem', { lineHeight: '1.65rem' }],
        'lg': ['1.25rem', { lineHeight: '1.85rem' }],
        'xl': ['1.4rem', { lineHeight: '2rem' }],
        '2xl': ['1.65rem', { lineHeight: '2.3rem' }],
        '3xl': ['2.1rem', { lineHeight: '2.6rem' }],
        '4xl': ['2.5rem', { lineHeight: '2.8rem' }],
        '5xl': ['3.3rem', { lineHeight: '1.1' }],
        '6xl': ['4.2rem', { lineHeight: '1.1' }],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
