import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { visualizer } from "rollup-plugin-visualizer";
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),UnoCSS(), visualizer({
    gzipSize: true,
    brotliSize: true,
    emitFile: false,
    filename: "test.html",
    open:true
  })],
  base: "./",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    }
  },
})
