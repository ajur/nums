/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /grid-cols-./,
    },
  ],
  theme: {
    extend: {
      gridTemplateColumns: generateGridTemplateColums(13, 26)
    },
  },
  plugins: [],
  darkMode: "class",
};

function generateGridTemplateColums(min, max) {
  const entries = Array.from({ length: max - min })
    .map((_, idx) => idx + min)
    .map((cols) => [`${cols}`, `repeat(${cols}, minmax(0, 1fr))`]);
  return Object.fromEntries(entries);
}
