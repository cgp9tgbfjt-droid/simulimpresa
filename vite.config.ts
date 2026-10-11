import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In produzione su GitHub Pages il sito vive sotto /<nome-repo>/.
// Il workflow imposta BASE_PATH; in locale resta '/'.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom'] },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
