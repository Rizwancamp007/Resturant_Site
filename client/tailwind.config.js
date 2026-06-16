/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: '#2D1C16',  // Deep Espresso text
          100: '#4A352B', // Warm Cocoa text
          200: '#6E5346', // Muted text
          300: '#8E7667', // Muted text
          400: '#A39287', // Border line
          500: '#FAF4EA', // Latte Cream base
          600: '#F5EBE0', // Cream hover
          700: '#E8DEC9', // Cream border
          800: '#FFFFFF', // Pure White card
          900: '#FAF4EA', // Latte Cream
          950: '#FAF4EA'  // Latte Cream background
        },
        gold: {
          50: '#FDF9F0',
          100: '#FCEFD8',
          200: '#F8DCAD',
          300: '#F3C57C',
          400: '#E5A93C', // Honey Drizzle
          500: '#CC912B',
          600: '#A4721C',
          700: '#7B5412',
          800: '#52370B',
          900: '#2A1A05'
        },
        warm: {
          50: '#F1F7F5',
          100: '#DDECE8',
          200: '#BAD5CD',
          300: '#94BEB2',
          400: '#7FA99B', // Vintage Teacup blue
          500: '#5E8B7D',
          600: '#46685D',
          700: '#324B43',
          800: '#1F2F29',
          900: '#0F1815'
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Space Grotesk', 'monospace']
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #E5A93C 0%, #7FA99B 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1D1411 0%, #0C0705 100%)',
        'gradient-glowing': 'linear-gradient(135deg, #E5A93C 0%, #94BEB2 100%)'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(12, 7, 5, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-lg': '0 16px 64px 0 rgba(12, 7, 5, 0.6), inset 0 1px 2px 0 rgba(255, 255, 255, 0.08)',
        'gold': '0 0 25px rgba(229, 169, 60, 0.35)',
        'gold-lg': '0 0 45px rgba(229, 169, 60, 0.5)',
        'warm': '0 0 25px rgba(127, 169, 155, 0.35)',
        'glow-purple': '0 0 30px rgba(117, 99, 87, 0.15)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'aurora-slow': 'aurora 25s ease-in-out infinite',
        'aurora-medium': 'aurora 20s ease-in-out infinite',
        'aurora-fast': 'aurora 15s ease-in-out infinite'
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        glow: { '0%': { boxShadow: '0 0 5px rgba(255, 170, 0, 0.2)' }, '100%': { boxShadow: '0 0 20px rgba(255, 170, 0, 0.4)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        aurora: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1) rotate(0deg)' },
          '33%': { transform: 'translate(10vw, -8vh) scale(1.25) rotate(25deg)' },
          '66%': { transform: 'translate(-8vw, 6vh) scale(0.85) rotate(-20deg)' }
        }
      }
    }
  },
  plugins: []
};
