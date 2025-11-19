import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // "base: './'" is crucial for Home Assistant
  // It ensures the app looks for files relative to the current folder
  base: './', 
  server: {
    port: 3000,
  }
})