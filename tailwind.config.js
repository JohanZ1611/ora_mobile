/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Paleta base Ora
        cream: {
          50: "#FDFCF9",
          100: "#F5F0E8",
          200: "#EDE8DF",
          300: "#E4DDD3",
          400: "#D4C9B8",
        },
        sand: {
          100: "#D4B896",
          200: "#C4A882",
          300: "#A8896A",
          400: "#8B6E52",
          500: "#6E5540",
        },
        warm: {
          100: "#FAF7F2",
          200: "#F0EBE3",
          300: "#E8E0D4",
          muted: "#78716C",
          text: "#1C1917",
        },
        income: "#6A9E7F",
        expense: "#C4766A",
      },
      fontFamily: {
        sans: ["DMSans_400Regular"],
        "sans-light": ["DMSans_300Light"],
        "sans-medium": ["DMSans_500Medium"],
        "sans-semibold": ["DMSans_600SemiBold"],
        "sans-bold": ["DMSans_700Bold"],
      },
    },
  },
  plugins: [],
};