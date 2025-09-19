import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 使用本地源码，实现热更新
      'zustand-state-monitor': path.resolve(__dirname, '../src/index.ts'),
    },
  },
  server: {
    port: 3000,
    hot: true,
  },
})