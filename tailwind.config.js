// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Thai"', "sans-serif"],
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "max-xl": { max: "1366px" },
        lg1366: { max: "1366px" },
        xl1920: "1920px",
      },
    },
  },
  plugins: [],
};
