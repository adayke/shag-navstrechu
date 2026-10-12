import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — собранную папку dist можно открыть или выложить по любому пути
export default defineConfig({
  plugins: [react()],
  base: './',
});
