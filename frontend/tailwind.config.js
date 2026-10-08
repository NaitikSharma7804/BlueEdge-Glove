/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          bg: "#0B101B",
          surface: "#111827",
          card: "#162032",
          border: "#23334d",
          accent: "#0ea5e9", // Medical Cyan
          teal: "#10b981",   // Stable Emerald
          amber: "#f59e0b",  // Warning Amber
          rose: "#f43f5e",   // Critical Crimson
          purple: "#8b5cf6", // Edge AI Violet
          muted: "#94a3b8",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scanline 4s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
