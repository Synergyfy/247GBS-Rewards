import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(root, './src') } },
  server: { host: '0.0.0.0', port: 8079, strictPort: true },
  preview: { host: '0.0.0.0', port: 8079, strictPort: true },
  build: {
    rollupOptions: {
      // The mock API builds its fixtures at import time; marking it side-effect free lets real builds
      // (VITE_USE_MOCKS unset or not 'true') drop it entirely instead of shipping fake data
      treeshake: { moduleSideEffects: (id) => !/[\\/]src[\\/]services[\\/]mock[\\/]/.test(id) },
      output: {
        // Long-lived vendor chunks: cached across app deploys and kept out of the app entry chunk
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react';
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('@tanstack') || id.includes('axios')) return 'vendor-data';
          return undefined;
        },
      },
    },
  },
});
