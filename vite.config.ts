import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// base './' → läuft unter jedem Pfad, z. B. https://<user>.github.io/boddy-boddy/
export default defineConfig({
  base: './',
  plugins: [svelte()],
  test: { include: ['src/**/*.test.ts'] },
});
