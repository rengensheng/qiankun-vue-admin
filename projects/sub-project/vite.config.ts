import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun';

export default defineConfig({
  plugins: [vue(), qiankun('sub-vue3-app', { useDevMode: true }),],
})
