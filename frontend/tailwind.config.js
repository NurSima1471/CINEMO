/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "netflix-red": "#E50914",
        "netflix-black": "#000000",
        "netflix-gray": "#141414",
      },
      boxShadow: {
        glow: "0 0 30px rgba(229,9,20,0.35)",
      },
    },
  },
  plugins: [],
};
