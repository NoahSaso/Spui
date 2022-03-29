const {
  colors: defaultColors,
  screens: defaultScreens,
} = require("tailwindcss/defaultTheme")
const { colors } = require("./theme")

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./helpers/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...defaultColors,
      ...colors,
    },
    screens: {
      xs: "416px",
      ...defaultScreens,
    },
    extend: {
      height: {
        footer: "4rem",
      },
    },
  },
  plugins: [require("tailwindcss-safe-area")],
}
