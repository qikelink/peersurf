import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   proxy: {
  //     '/': {
  //       target: 'https://localhost:5173',
  //       changeOrigin: true,
  //       secure: false
  //     }
  //   }
  // },
  preview: {
    // historyApiFallback is not a valid option for Vite's preview config.
    // No changes needed here.
  },
})
