import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f5f0e8',
        ink: '#1a1a1a',
        'paper-dark': '#e8e0d0',
        sepia: '#8B7355',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-libre)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
