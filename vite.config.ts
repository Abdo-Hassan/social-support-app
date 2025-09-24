import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "react-vendor": ["react", "react-dom"],
          // Material-UI and related
          "mui-core": [
            "@mui/material",
            "@mui/system",
            "@emotion/react",
            "@emotion/styled",
          ],
          "mui-x": ["@mui/x-date-pickers"],
          // i18n
          i18n: ["react-i18next", "i18next"],
          // Date and utilities
          "date-utils": ["date-fns"],
          // Form validation
          "form-utils": ["zod"],
        },
      },
    },
    // Increase chunk size warning limit to reduce warnings
    chunkSizeWarningLimit: 1000,
  },
}));
