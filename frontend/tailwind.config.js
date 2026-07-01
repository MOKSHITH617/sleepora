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
          DEFAULT: '#2A211D', // Luxury Dark Espresso
          light: '#3E322D',   // Medium-dark brown
          lighter: '#5C4C44', // Soft medium-brown
        },
        accent: {
          DEFAULT: '#7C5F43', // Rich Wood Brown
          hover: '#9E7B5B',   // Warm highlight
          light: '#FAF5EF',   // Very light cream/sand
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
        },
        bg: {
          dark: '#1C1613',    // Dark Espresso base
          light: '#FAF8F5',   // Showroom Cream background
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
        sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
        md: '0 4px 12px rgba(11, 25, 44, 0.08)',
        lg: '0 12px 24px -4px rgba(11, 25, 44, 0.15)',
        gold: '0 8px 20px rgba(230, 179, 37, 0.2)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
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
