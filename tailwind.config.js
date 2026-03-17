/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          0: '#05070A',
          1: '#0A0D14',
          2: '#10141D',
          3: '#161C28',
          4: '#1E2538',
        },
        cyan: {
          DEFAULT: '#22D3EE',
          dim: 'rgba(34,211,238,0.08)',
        },
        memo: {
          green: '#34D399',
          amber: '#FBBF24',
          purple: '#A78BFA',
          red: '#F87171',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
