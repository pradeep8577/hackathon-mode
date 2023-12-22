/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        input: 'hsl(var(--input-background-color))',
        ring: 'hsl(var(--focus-ring-color))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        border: {
          DEFAULT: 'hsl(var(--base-border-color))',
          foreground: 'hsl(var(--border-foreground-color))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--base-accent-color))',
          foreground: 'hsl(var(--accent-foreground-color))'
        },
        popover: {
          DEFAULT: 'hsl(var(--base-popover-color))',
          foreground: 'hsl(var(--popover-foreground-color))'
        },
        card: {
          DEFAULT: 'hsl(var(--base-card-color))',
          foreground: 'hsl(var(--card-foreground-color))'
        },
        text: 'hsla(var(--text-color))',
        text500: 'hsla(var(--text-color-medium-color))',
        border500: 'hsla(var(--border-medium-color))',
        cardborder: 'hsla(var(--card-border-color))',
        active: 'hsla(var(--active-state-color))',
        cardtext: 'hsla(var(--card-text-color))',
        title: 'hsla(var(--title-color))',
        subtitle: 'hsla(var(--subtitle-color))',
        textGrayColor: 'hsla(var(--text-color-gray-color))',
        whiteMediumColor: 'hsla(var(--white-medium-color))',

        gradient: {
          DEFAULT: 'hsla(var(--base-gradient-color))',
          foreground: 'hsl(var(--base-gradient-color-foreground-color))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
