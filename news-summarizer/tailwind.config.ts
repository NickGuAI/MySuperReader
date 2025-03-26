import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Japanese ukiyo-e inspired color palette
        indigo: {
          DEFAULT: "#1B4B73", // Ai-iro (藍色) - traditional indigo
          light: "#5B7C99",
          dark: "#0F2D4A",
        },
        vermilion: {
          DEFAULT: "#D13B40", // Shu-iro (朱色) - vermilion red
          light: "#E37376",
          dark: "#A02D30",
        },
        ochre: {
          DEFAULT: "#BF8A49", // Kincha-iro (金茶色) - golden brown
          light: "#D6B078",
          dark: "#8C6535",
        },
        pine: {
          DEFAULT: "#2D4F3E", // Matsuba-iro (松葉色) - pine needle
          light: "#4A7A64",
          dark: "#1A2E25",
        },
        sumi: {
          DEFAULT: "#1A1A1A", // Sumi-iro (墨色) - ink black
          light: "#333333",
          dark: "#0D0D0D",
        },
        kinari: {
          DEFAULT: "#F8F3E6", // Kinari-iro (生成り色) - natural silk
          light: "#FFF9F0",
          dark: "#E8E3D6",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

