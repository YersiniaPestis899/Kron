import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    // better-sqlite3 is a native module — do not bundle it, keep as external require()
    external: ['better-sqlite3'],
  }
});
