import react from '@vitejs/plugin-react';
import { mergeConfig } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default mergeConfig(defineVitestConfig({}), {
  plugins: [react(), tsconfigPaths()],
});
