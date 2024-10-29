import { defineConfig, loadEnv } from 'vite'
import UnoCSS from 'unocss/vite'
import { visualizer } from "rollup-plugin-visualizer";
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
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
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
        },
      }
    },
  }
})
