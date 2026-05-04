import { vitePreprocess } from '@astrojs/svelte';

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  compilerOptions: {
    // Forces Svelte 5 to run in Rune mode
    runes: true,
    css: 'external'
  }
};
