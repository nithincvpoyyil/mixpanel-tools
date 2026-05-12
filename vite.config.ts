import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        panel: resolve(__dirname, 'src/main.tsx'),
      },
      output: {
        entryFileNames: 'panel/[name].js',
        chunkFileNames: 'panel/[name].js',
        assetFileNames: 'panel/[name].[ext]',
      },
    },
  },
});
