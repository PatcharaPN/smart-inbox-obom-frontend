// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // อย่าลืม include path
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Thai"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
