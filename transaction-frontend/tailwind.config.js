/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        black: '#000000',
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      keyframes: {
        loading: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.8)' },
        },
        loadingApple: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        decoding: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '50%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        decodingText: {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '50%': { opacity: 1, transform: 'translateX(0)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        loading: 'loading 1s ease-in-out infinite',
        loadingApple: 'loadingApple 1.5s linear infinite',
        decoding: 'decoding 1s ease-in-out forwards',
        decodingText: 'decodingText 1s ease-in-out forwards',
      },
    },
  },
  variants: {},
  plugins: [],
};
