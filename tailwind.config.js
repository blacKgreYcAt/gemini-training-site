/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00aeef',
        'primary-light': '#66d9ff',
        'primary-dark': '#0088bb',
        success: '#10b981',
        warning: '#f87171',
      },
      boxShadow: {
        'clay': '0 4px 6px rgba(0, 174, 239, 0.1), 0 10px 20px rgba(0, 0, 0, 0.08)',
        'clay-lg': '0 8px 12px rgba(0, 174, 239, 0.15), 0 20px 40px rgba(0, 0, 0, 0.1)',
        'clay-md': '0 2px 4px rgba(0, 174, 239, 0.08), 0 6px 12px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'clay': '20px',
        'clay-lg': '30px',
      },
    },
  },
  plugins: [],
}
