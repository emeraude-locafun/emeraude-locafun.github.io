// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';
import serviceWorker from "@ayco/astro-sw";
 
// https://astro.build/config
export default defineConfig({
    site: 'https://emeraude-locafun.github.io',

  integrations: [
      serviceWorker({
  path: "./src/sw.ts",
   registrationHooks: {
    afterRegistration: async () => {
      const sw = await navigator.serviceWorker.getRegistration();
      console.log(">>> registrered", sw);
    },
    installing: () => console.log("installing..."),
    waiting: () => console.log("waiting..."),
    active: () => console.log("active..."),
    error: (error) => console.error(error),
    unsupported: () => console.log(":("),
  },
}),
    vue(), mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});