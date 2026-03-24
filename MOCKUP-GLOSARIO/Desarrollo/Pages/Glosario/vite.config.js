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
  server: {
    port: 5175,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});
