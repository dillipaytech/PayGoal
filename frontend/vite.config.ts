import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In development, forward API calls to the local backend (backend/).
    proxy: { '/api': 'http://127.0.0.1:4100' },
  },
  preview: {
    proxy: { '/api': 'http://127.0.0.1:4100' },
  },
})
