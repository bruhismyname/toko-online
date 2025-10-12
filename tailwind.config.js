/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "converse-red": "#e53e3e", // Sesuaikan dengan warna brand Anda
        "converse-black": "#000000",
      },
    },
  },
  plugins: [],
};
