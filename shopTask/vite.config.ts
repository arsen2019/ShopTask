import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path to remove the '/api' prefix
      },
    },
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ["!**/node_modules/**"],
    },
  },
});
