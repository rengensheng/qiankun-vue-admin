import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import qiankun from 'vite-plugin-qiankun';

// https://vite.dev/config/
const useDevMode = true
export default defineConfig({
  plugins: [
    // react(),
    qiankun('微服务页面2', { useDevMode: useDevMode })
  ],
  base: '/micro/sub1/second',
  server: {
    port: 5174,
    origin: 'http://localhost:5174',
  }
})
