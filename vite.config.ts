import { defineConfig, loadEnv } from 'vite'
import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { loadingIcon } from './scripts/icon'

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  await loadingIcon(env.VITE_PROXY_URL)
  return {
    plugins: [
      vue(),
      UnoCSS(),
      visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: 'test.html',
        open: true
      })
    ],
    base: '/',
    server: {
      proxy: {
        '/api': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true
        }
      }
    }
  }
})
