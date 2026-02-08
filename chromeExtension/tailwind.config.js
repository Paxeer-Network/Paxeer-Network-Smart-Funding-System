/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}", "./src/popup/index.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          100: "#DEF2E6",
          200: "#7FDCA4",
          300: "#05C168",
          400: "#05C168",
          500: "#8e9290ff",
          600: "#11845B",
        },
        blue: {
          100: "#EAF4FF",
          200: "#8FC3FF",
        },
        green: {
          100: "#DEF2E6",
          200: "#7FDCA4",
          300: "#05C168",
          400: "#11845B",
        },
        neutral: {
          50: "#EAF4FF",
          100: "#FFFFFF",
          200: "#F5F5F5",
          300: "#DDDDDD",
          400: "#AFAFAF",
          500: "#b3b0b0ff",
          600: "#404040",
          700: "#1E1E1E",
          800: "#0B0B0B",
        },
        surface: {
          50: "#F5F5F5",
          100: "#1E1E1E",
          200: "#181818",
          300: "#161616",
          700: "#161616",
          800: "#0e0e0e",
          900: "#0B0B0B",
          950: "#0B0B0B",
        },
        gray: {
          light: "#d1d1d1",
          DEFAULT: "#9f9f9f",
          dark: "#5d5d5d",
          black: "#181818",
        },
      },
    },
  },
  plugins: [],
};
