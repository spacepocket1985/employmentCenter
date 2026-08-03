import react from '@vitejs/plugin-react';
import { mergeConfig } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

// Базовый конфиг
const baseConfig = defineVitestConfig({
  plugins: [react(), tsconfigPaths()],
});

// Расширяем для поддержки нескольких входных точек
export default mergeConfig(baseConfig, {
  build: {
    rollupOptions: {
      input: {
        psychology: resolve(__dirname, 'index.psychology.html'),
        corruption: resolve(__dirname, 'index.corruption.html'),
      },
    },
  },
});
