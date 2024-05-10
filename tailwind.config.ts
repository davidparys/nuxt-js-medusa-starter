import type { Config } from "tailwindcss"

export default <Partial<Config>>{
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        primary: ["Commons", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],

      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      gridTemplateRows: {
        "[auto,auto,1fr]": "auto auto 1fr",
      },
      aspectRatio: {
        auto: "auto",
        square: "1 / 1",
        video: "16 / 9",
      },
      animation: {
        "bounce-left-right": "bounceLR ease-in-out infinite",
        "fade-in-top": "fadeInTop 0.5s forwards ease-in-out",
        "fade-in-left": "fadeInLeft 0.5s forwards ease-in",
      },
      opacity: {
        1: "0.01",
        2.5: "0.025",
        7.5: "0.075",
        15: "0.15",
      },
      colors: {
        "alternative": "#F5FFF9",
        // 'black': '#0A0A0A',
        "black": "#1E272E",
        "dark": "rgb(23,23,23)",
        "light": "rgba(212,212,212,.05)",
        "white": "#E9E9E9",

        "flush-mahogany": {
          50: "#fdf4f3",
          100: "#fce8e7",
          200: "#f8d4d3",
          300: "#f2b0af",
          400: "#e98583",
          500: "#dd5658",
          600: "#cc424b",
          700: "#a82833",
          800: "#8d2431",
          900: "#792230",
          950: "#430e15",
        },
        "mindaro": {
          50: "#fbffe5",
          100: "#f4ffc7",
          200: "#e7ff95",
          300: "#dbff75",
          400: "#bdf625",
          500: "#9edd05",
          600: "#7ab100",
          700: "#5c8605",
          800: "#4a690b",
          900: "#3e590e",
          950: "#1f3201",
        },

        "viridian": {
          50: "#f1f8f5",
          100: "#ddeee5",
          200: "#bedccd",
          300: "#92c3af",
          400: "#64a38b",
          500: "#3d7b65",
          600: "#306b58",
          700: "#275547",
          800: "#214439",
          900: "#1c3830",
          950: "#0f1f1b",
          DEFAULT: "#3d7b65",
        },
      },
    },
  },

}
