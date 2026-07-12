import { defineConfig } from 'vite';

// Relative base: works on GitHub Pages (/den/), Vercel, and even when
// opening dist/index.html straight from disk.
export default defineConfig({
  base: './',
});
