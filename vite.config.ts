import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { version, description, repo_url } from './package.json';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_DESCRIPTION__: JSON.stringify(description),
    __APP_REPO_URL__: JSON.stringify(repo_url),
  },
});
