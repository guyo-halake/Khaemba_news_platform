/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          navy: '#1A2332',
          light: '#2d3b52',
        },
        paper: {
          warm: '#FAF6EF',
          dark: '#121620',
          card: '#1F2937',
        },
        amber: {
          DEFAULT: '#D99A3F',
          hover: '#C2842F',
        },
        category: {
          politics: '#B23A3A',
          business: '#3A7D44',
          sports: '#2E5FA3',
          county: '#8A5A9E',
          opinion: '#5E6E7A',
        }
      },
      fontFamily: {
        headline: ['var(--font-headline)', 'Fraunces', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
