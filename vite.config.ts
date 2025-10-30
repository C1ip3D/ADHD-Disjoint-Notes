import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Optimize production builds
          isCustomElement: (tag) => tag.startsWith("ion-"),
        },
      },
    }),
    // Only use devtools in development
    ...(process.env.NODE_ENV === "development" ? [vueDevTools()] : []),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // Optimize for production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          "vue-vendor": ["vue", "vue-router", "pinia"],
          editor: ["marked", "html2canvas", "jspdf"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    // Enable source maps only in dev
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "pinia",
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
    ],
  },
});
