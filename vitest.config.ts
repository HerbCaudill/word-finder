import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/vitest-setup.ts"],
    exclude: ["e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "virtual:pwa-register": path.resolve(
        __dirname,
        "node_modules/vite-plugin-pwa/dist/client/dev/register.js",
      ),
    },
  },
})
