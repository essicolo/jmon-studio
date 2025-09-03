import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'JmonStudio',
      fileName: 'jmon-studio',
      formats: ['umd']
    },
    rollupOptions: {
      external: ['plotly.js'],
      output: {
        format: 'umd',
        name: 'JmonStudio',
        exports: 'named',
        globals: {
          'plotly.js': 'Plotly'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: false // Don't clear dist folder since we copy src files there too
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});