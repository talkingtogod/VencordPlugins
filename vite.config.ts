// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    target: "esnext",
    sourcemap: true,
    lib: {
      entry: "src/WhoPingedMe.tsx",
      formats: ["es"],
      fileName: () => "plugin.js"
    },
    rollupOptions: {
      external: [],
    }
  }
});
