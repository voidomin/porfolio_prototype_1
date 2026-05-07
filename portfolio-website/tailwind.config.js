/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Dawn palette — hero section */
        dawn: {
          50: "#fefcf4",
          100: "#fef7e0",
          200: "#fdedb7",
          300: "#fbdf85",
          400: "#f8cc4d",
          500: "#f0b429",
          600: "#d9951b",
          700: "#b57316",
          800: "#935a18",
          900: "#7a4a19",
        },
        /* Forest palette — about section */
        forest: {
          50: "#f0f9f0",
          100: "#dbf0db",
          200: "#b9e2b9",
          300: "#89cc89",
          400: "#5aaf5a",
          500: "#3a8f3a",
          600: "#2d722d",
          700: "#265b26",
          800: "#224922",
          900: "#1d3d1d",
          950: "#0d200d",
        },
        /* Meadow palette — skills section */
        meadow: {
          50: "#f5fbe8",
          100: "#e8f5cc",
          200: "#d3ed9e",
          300: "#b6e066",
          400: "#9bcf3a",
          500: "#7db523",
          600: "#619018",
          700: "#4a6e16",
          800: "#3d5817",
          900: "#344b18",
        },
        /* River palette — projects section */
        river: {
          50: "#eff8ff",
          100: "#dbeffe",
          200: "#bfe3fe",
          300: "#93d2fd",
          400: "#60b8fa",
          500: "#3b99f5",
          600: "#257bea",
          700: "#1d64d7",
          800: "#1e51ae",
          900: "#1e4689",
        },
        /* Stone palette — project cards */
        stone: {
          50: "#f8f7f4",
          100: "#efede6",
          200: "#ddd9cc",
          300: "#c7c0ac",
          400: "#afa489",
          500: "#9e8e70",
          600: "#917e64",
          700: "#796854",
          800: "#645648",
          900: "#52483d",
        },
        /* Dusk palette — contact section */
        dusk: {
          50: "#fdf4f3",
          100: "#fce8e6",
          200: "#fad4d1",
          300: "#f5b3af",
          400: "#ed8580",
          500: "#e05d57",
          600: "#cc403c",
          700: "#ab322f",
          800: "#8e2d2b",
          900: "#762b2a",
          950: "#401312",
        },
        /* Night palette — footer */
        night: {
          50: "#eef1ff",
          100: "#e0e5ff",
          200: "#c7cfff",
          300: "#a4aafd",
          400: "#8180f9",
          500: "#6d5df2",
          600: "#5d40e6",
          700: "#5034cb",
          800: "#412ca4",
          900: "#382b81",
          950: "#0f0d2e",
        },
        /* Keep primary and accent for compatibility */
        primary: {
          50: "#f3f9e8",
          100: "#e3f2c7",
          200: "#cde89f",
          300: "#b1d96f",
          400: "#92c14c",
          500: "#6f9f32",
          600: "#5a8529",
          700: "#4c6f24",
          800: "#3f5a20",
          900: "#31471a",
        },
        accent: {
          50: "#fff5ea",
          100: "#fee6c7",
          200: "#fdd197",
          300: "#f7b260",
          400: "#f08d32",
          500: "#de6f1d",
          600: "#bb5718",
          700: "#944316",
          800: "#773716",
          900: "#5e2e15",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        "drift-cloud": "driftCloud 45s linear infinite",
        "drift-cloud-slow": "driftCloud 65s linear infinite",
        "float-leaf": "floatLeaf 12s ease-in-out infinite",
        "float-leaf-alt": "floatLeafAlt 15s ease-in-out infinite",
        "fly-bird": "flyBird 18s linear infinite",
        "wing-flap": "wingFlap 0.4s ease-in-out infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "twinkle-slow": "twinkle 5s ease-in-out infinite",
        "firefly": "firefly 6s ease-in-out infinite",
        "ripple": "ripple 1.5s ease-out",
        "sun-glow": "sunGlow 4s ease-in-out infinite",
        "sway": "sway 6s ease-in-out infinite",
        "sway-slow": "sway 9s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        driftCloud: {
          "0%": { transform: "translateX(-20%)" },
          "100%": { transform: "translateX(120%)" },
        },
        floatLeaf: {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.7" },
          "90%": { opacity: "0.7" },
          "100%": {
            transform: "translate(200px, 400px) rotate(360deg)",
            opacity: "0",
          },
        },
        floatLeafAlt: {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.5" },
          "90%": { opacity: "0.5" },
          "100%": {
            transform: "translate(-180px, 350px) rotate(-270deg)",
            opacity: "0",
          },
        },
        flyBird: {
          "0%": { transform: "translate(-100px, 0)" },
          "100%": { transform: "translate(calc(100vw + 100px), -60px)" },
        },
        wingFlap: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.6)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        firefly: {
          "0%, 100%": {
            opacity: "0",
            transform: "translate(0, 0)",
          },
          "20%": { opacity: "0.8" },
          "50%": {
            opacity: "0.6",
            transform: "translate(30px, -40px)",
          },
          "80%": { opacity: "0.3" },
        },
        ripple: {
          "0%": {
            transform: "scale(0)",
            opacity: "0.6",
          },
          "100%": {
            transform: "scale(4)",
            opacity: "0",
          },
        },
        sunGlow: {
          "0%, 100%": {
            boxShadow: "0 0 40px rgba(240, 180, 41, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 80px rgba(240, 180, 41, 0.6)",
          },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        organic: "30% 70% 70% 30% / 30% 30% 70% 70%",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
