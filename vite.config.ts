import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { version, description, repo_url } from './package.json';
import path from 'path';

const basePath = process.env.VITE_BASE_PATH || '/';

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_DESCRIPTION__: JSON.stringify(description),
    __APP_BASE_PATH__: JSON.stringify(basePath), 
    __APP_REPO_URL__: JSON.stringify(repo_url),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
});
