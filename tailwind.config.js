/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-bg': '#002147',
        'primary': '#35c09b',
        'primary-hover': '#2da882',
        'secondary': '#09cece',
        'secondary-hover': '#07b8b8',
        'accent': '#ffc825',
        'accent-hover':'#e5b720',
        'main-text': "#fcfcfd",
        'card-bg': '#1C2D3F',
        'main-light': '#00305c',
      },
    },
  },
  plugins: [],
}
