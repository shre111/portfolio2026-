import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    // Touch replaces hover (§9): only apply hover: styles where hover exists,
    // so taps don't leave cards stuck in their hover state.
    hoverOnlyWhenSupported: true,
  },
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
      boxShadow: {
        'glow-iris': '0 0 20px rgba(110, 99, 242, 0.5)',
        'glow-amber': '0 0 20px rgba(245, 180, 81, 0.5)',
      },
      borderRadius: {
        xs: '8px',
        sm: '12px',
      },
    },
  },
  plugins: [],
}
export default config
