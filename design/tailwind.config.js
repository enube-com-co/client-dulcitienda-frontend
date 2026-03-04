/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#E85D04',
          light: '#FF7A2F',
          dark: '#C44A00',
        },
        secondary: {
          DEFAULT: '#F4A900',
          light: '#FFBF33',
          dark: '#D49500',
        },
        // Warm Browns
        brown: {
          900: '#3D2914',
          800: '#4A3428',
          700: '#6B4423',
          600: '#8B4513',
          500: '#A0826D',
          400: '#BCAAA4',
          300: '#D7CCC8',
          200: '#EFEBE9',
          100: '#F5F0EB',
          50: '#FAF7F5',
        },
        // Cream & Warm Backgrounds
        cream: {
          DEFAULT: '#FFF8E7',
          light: '#FFFDF5',
          dark: '#F5E6CC',
        },
        peach: {
          DEFAULT: '#FFDAB9',
          light: '#FFE8D6',
          dark: '#FFC49A',
        },
        // Accent Colors
        candy: {
          pink: '#FF6B9D',
          purple: '#C084FC',
          blue: '#87CEEB',
          green: '#98D8C8',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        display: ['Pacifico', 'cursive'],
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'display-sm': ['1.75rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'button': '0 4px 12px rgba(232, 93, 4, 0.3)',
        'colored': '0 4px 20px rgba(232, 93, 4, 0.25)',
        'soft': '0 2px 12px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FFF8E7 0%, #FFDAB9 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(232, 93, 4, 0.9) 0%, rgba(244, 169, 0, 0.85) 100%)',
        'gradient-overlay': 'linear-gradient(to right, rgba(61, 41, 20, 0.8) 0%, rgba(61, 41, 20, 0.4) 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
