import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy API requests through Vite during local development.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
