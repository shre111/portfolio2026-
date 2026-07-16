import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        line: 'var(--line)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        iris: 'var(--iris)',
        'iris-soft': 'var(--iris-soft)',
        amber: 'var(--amber)',
        cyan: 'var(--cyan)',
      },
      fontFamily: {
        display: ['var(--font-clash)', 'sans-serif'],
        sans: ['var(--font-general)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        display: 'clamp(2.75rem, 8vw, 7rem)',
        'h2': 'clamp(1.75rem, 4vw, 3rem)',
        'h3': 'clamp(1.25rem, 2.5vw, 2rem)',
        body: '1.05rem',
        mono: '0.8rem',
      },
      lineHeight: {
        body: '1.65',
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0em',
        wide: '0.12em',
      },
    },
  },
  plugins: [],
}
export default config
