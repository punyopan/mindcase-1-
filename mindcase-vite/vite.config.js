import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // GitHub Pages deploys to /mindcase/ subpath
  base: '/mindcase/',
  build: {
    // The app is large (128KB+ main component), suppress chunk size warnings
    chunkSizeWarningLimit: 1500,
  },
})
