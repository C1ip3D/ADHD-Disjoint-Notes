import { defineConfig } from "@tailwindcss/vite";

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7ff",
          100: "#e0eefd",
          200: "#C4E0F9",
          300: "#a0c9f5",
          400: "#5da0e5",
          500: "#266DD3",
          600: "#1e5ab8",
          700: "#174999",
          800: "#123a7a",
          900: "#0d2c5b",
          DEFAULT: "#266DD3",
        },
        secondary: {
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#b8b8b8",
          300: "#8f8f8f",
          400: "#666666",
          500: "#272727",
          600: "#1f1f1f",
          700: "#171717",
          800: "#0f0f0f",
          900: "#070707",
          DEFAULT: "#272727",
        },
        accent: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        background: {
          DEFAULT: "#C4E0F9",
          light: "#e0eefd",
          dark: "#a0c9f5",
        },
        text: {
          DEFAULT: "#272727",
          light: "rgba(39, 39, 39, 0.7)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
});
