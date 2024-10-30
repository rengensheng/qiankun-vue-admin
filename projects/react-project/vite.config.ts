import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import qiankun from 'vite-plugin-qiankun';

// https://vite.dev/config/
const useDevMode = true
export default defineConfig({
  plugins: [
    // react(),
    qiankun('sub2', { useDevMode: useDevMode })
  ],
  base: '/micro/sub2/',
  server: {
    port: 5802,
    origin: 'http://localhost:5802',
  }
})
