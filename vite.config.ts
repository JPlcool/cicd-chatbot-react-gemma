import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` is set from BASE_PATH in CI so the build works under
// https://<user>.github.io/<repo>/ as well as locally at "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? '/',
});
