import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sidebar: {
          bg: "#0C0C0C",
          border: "#1A1A1A",
        },
        navbar: {
          bg: "#0C0C0C",
          border: "#1A1A1A",
        },
        text: {
          muted: "#353535",
          secondary: "#A1A0A0",
          primary: "#E5E5E5",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      screens: {
        'md': '800px',
        'lg': '1200px',
      },
    },
  },
  plugins: [],
};
export default config;


