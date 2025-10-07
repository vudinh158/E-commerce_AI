/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}"
    ],
    theme: {
      extend: {
        container: { center: true, padding: "1rem" },
        boxShadow: { soft: "0 8px 30px rgba(0,0,0,0.06)" },
        borderRadius: { "2xl": "1rem" }
      }
    },
    plugins: [],
  };
  