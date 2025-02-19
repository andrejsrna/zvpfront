import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
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
              'background-position': 'left center'
            },
            '50%': {
              'background-size': '200% 200%',
              'background-position': 'right center'
            },
          },
          'fade-in': {
            '0%': {
              opacity: '0',
              transform: 'translateY(10px)'
            },
            '100%': {
              opacity: '1',
              transform: 'translateY(0)'
            },
          }
        },
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
        },
        fontFamily: {
          sans: ['var(--font-inter)'],
          heading: ['var(--font-sora)'],
        },
    },
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [typography],
} satisfies Config;

export default config;
