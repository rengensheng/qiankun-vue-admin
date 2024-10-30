import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun';

export default defineConfig({
  plugins: [vue(), qiankun('sub1', { useDevMode: true }),],
  base: '/micro/sub1/',
  server: {
    origin: 'http://localhost:5174'
  }
})
