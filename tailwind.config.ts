import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          1: '#E6F9EC', // very light green (background)
          2: '#A8EBC2', // soft mint green
          3: '#4AD17A', // vibrant fresh green (primary base)
          4: '#2CA35A', // darker green (hover/active)
          5: '#145C30', // deep forest green (accent or dark mode)
        },
      },
    },
  },
  plugins: [],
};
export default config;
