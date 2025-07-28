import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // historyApiFallback is not a valid option for Vite's server config.
    // If you want to enable SPA fallback, use the middleware in configureServer or set up a proxy.
    // For most React apps, Vite enables HTML5 history fallback by default.
  },
  preview: {
    // historyApiFallback is not a valid option for Vite's preview config.
    // No changes needed here.
  },
})
