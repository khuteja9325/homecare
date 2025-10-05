import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // This is the configuration for GitHub Pages.
  // Replace 'your-repo-name' with the actual name of your repository.
  // The leading and trailing slashes are important.
  base: '/homecare/',
});