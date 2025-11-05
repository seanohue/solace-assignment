import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Color scheme from Solace Health website
      colors: {
        primary: {
          DEFAULT: "#1d4339",
          focused: "#285e50",
          selected: "#347866",
        },
        accent: {
          mid: "#3f937c",
        },
        neutral: {
          black: "#101010",
          white: "#fff",
          grey: "#9a9a9a",
          "dark-grey": "#5a5a5a",
          "light-grey": "#e9e9e9",
        },
        green: {
          100: "#f4f8f7",
        },
        opal: "#d4e2dd",
      },
    },
  },
  plugins: [],
};
export default config;
