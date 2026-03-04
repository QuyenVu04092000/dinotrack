/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--mm-background) / <alpha-value>)",
        foreground: "rgb(var(--mm-foreground) / <alpha-value>)",
        primary: "rgb(var(--mm-primary) / <alpha-value>)",
        primaryForeground: "rgb(var(--mm-primary-foreground) / <alpha-value>)",
        muted: "rgb(var(--mm-muted) / <alpha-value>)",
        mutedForeground: "rgb(var(--mm-muted-foreground) / <alpha-value>)",
        border: "rgb(var(--mm-border) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
