import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Reveal.js doesn't expose CSS in its exports field — bypass with explicit path
      'reveal.js/dist/reveal.css': path.resolve(
        __dirname,
        'node_modules/reveal.js/dist/reveal.css',
      ),
    },
  },
  optimizeDeps: {
    include: ['reveal.js'],
  },
})
