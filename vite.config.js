import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/brew-mate/",   // sesuaikan dengan nama repo GitHub kamu
  build: {
    outDir: "docs",      // GitHub Pages bisa baca dari folder /docs
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
