/**
 * vite.config.js
 * Configuración de Vite para la página Glosario en React.
 * Ejecutar desde MOCKUP-GLOSARIO/Desarrollo/Pages/Glosario/:
 *   npm install && npm run dev
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  cacheDir: '.vite',
  server: {
    port: 5175,
    open: true,
    // Proxy para desarrollo local: evita CORS al llamar a la API del banco
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://gobinfoana01-2:8510',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  css: {
    devSourcemap: false,
  },
});
