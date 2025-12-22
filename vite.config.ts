
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Позволяет запускать проект из любой подпапки (важно для GH Pages)
  build: {
    outDir: 'dist',
  },
});
