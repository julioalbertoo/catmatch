import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        'cat-bg':      'var(--color-cat-bg)',
        'cat-dark':    'var(--color-cat-dark)',
        'cat-surface': 'var(--color-cat-surface)',
        'cat-accent':  '#f59e0b',
        'cat-green':   '#16a34a',
        'cat-danger':  '#e23b4a',
        'cat-text':    'var(--color-cat-text)',
        'cat-muted':   'var(--color-cat-muted)',
        'cat-border':  'var(--color-cat-border)',
      },
      borderRadius: {
        'card': '20px',
        'pill': '9999px',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body:    ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
