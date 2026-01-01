import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'fade-in': 'fade-in 1s ease-out',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#3e802b',
      },
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
        heading: [
          'var(--font-sora)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
        sora: [
          'var(--font-sora)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
        inter: [
          'var(--font-inter)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: '#3e802b',
              textDecoration: 'none',
              fontWeight: '600',
            },
            'a:hover': {
              color: '#4a9a35',
              textDecoration: 'underline',
            },
            h2: {
              fontFamily: 'var(--font-sora), system-ui, -apple-system, sans-serif',
            },
            h3: {
              fontFamily: 'var(--font-sora), system-ui, -apple-system, sans-serif',
            },
          },
        },
      },
    },
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  plugins: [typography],
};

export default config;

