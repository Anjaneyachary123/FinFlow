/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        md: "768px",
        lg: "1024px",
      },
    },
  },
  plugins: [],
};
