import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '/kids-youtube-dashboard/',   // ⭐ ADD THIS LINE
  plugins: [svelte()],
});
