import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@glc/engine': fileURLToPath(new URL('../engine/src/index.ts', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: false,
  },
});
