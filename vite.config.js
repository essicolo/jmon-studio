import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'JmonStudio',
      fileName: 'jmon-studio',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: ['plotly.js'],
      output: {
        // Provide global variables for externalized deps in UMD build
        globals: {
          'plotly.js': 'Plotly'
        },
        // Use named exports only
        exports: 'named'
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