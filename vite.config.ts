import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import Terminal from "vite-plugin-terminal";

export default defineConfig({
  plugins: [react(), Terminal()],
  base: "/nums/",
  resolve: {
    alias: {
      "~": resolve(__dirname, "src"),
    },
  },
  test: {
    includeSource: ["src/**/*.{js,ts}"],
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});
