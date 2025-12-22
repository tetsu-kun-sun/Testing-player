import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Для GitHub Pages лучше использовать относительные пути
  base: './',
  build: {
    outDir: 'dist',
  },
});