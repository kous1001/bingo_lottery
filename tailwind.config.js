/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // 扫描src目录下所有文件
  theme: {
    extend: {
      animation: {
        flip: 'flip 0.5s linear infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateX(0)' },
          '50%': { transform: 'rotateX(180deg)' },
          '100%': { transform: 'rotateX(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
