export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pulse-bg': '#0A0A0F',
        'pulse-card': '#111118',
        'pulse-elevated': '#16161F',
        'pulse-purple': '#8B5CF6',
        'pulse-green': '#10B981',
        'pulse-red': '#EF4444',
        'pulse-amber': '#F59E0B',
        'pulse-blue': '#3B82F6',
        'pulse-text': '#F1F5F9',
        'pulse-secondary': '#94A3B8',
        'pulse-muted': '#475569',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-chart': 'linear-gradient(180deg, #8B5CF6, transparent)',
      },
    },
  },
  plugins: [],
}