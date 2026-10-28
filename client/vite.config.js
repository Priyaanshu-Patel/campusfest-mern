import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // During development, send /api requests to the Express server
  server: { proxy: { '/api': 'http://localhost:5000' } },
});
