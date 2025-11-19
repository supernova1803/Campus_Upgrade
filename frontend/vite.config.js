import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config that proxies /api requests to the backend running on port 5000
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
