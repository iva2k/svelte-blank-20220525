// import adapter from '@sveltejs/adapter-auto';
import netlify from '@sveltejs/adapter-netlify';
import vercel from '@sveltejs/adapter-vercel';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
// import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import assets from './assets.js';
import { optimizeImports } from 'carbon-preprocess-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
      scss: { includePaths: ['src', 'node_modules'] }
    }),
    optimizeImports()
  ],

  kit: {
    adapter: process.env.VERCEL
      ? vercel()
      : process.env.NETLIFY
      ? netlify()
      : adapter({
          // default options are shown:
          // pages: 'build',
          // assets: 'build',
          // fallback: null,
          // precompress: false
        }),

    prerender: {
      // This can be false when using a fallback (i.e. SPA mode)
      default: true
    },

    // Override http methods in the Todo forms
    methodOverride: {
      allowed: ['PATCH', 'DELETE']
    },

    alias: {
      // Place to add all aliases. Run 'svelte-kit sync' (or npm run prepare) to update paths in '.svelte-kit/tsconfig.json'.
      // $components: resolve('./src/lib/components')
    },

    vite: () => ({
      plugins: [
        // copy is needed for vite to work in svelte:dev (especially under "tauri dev")
        // All copy commands sould be duplicated in package.json:scripts.svelte:prebuild, for svelte:dev to work correctly.
        // TODO: DRY violation(between svelte.config.js and package.json) - remove duplication. Create 'assets.js' and use it from both places (for package.json, create 'scripts/copy-assets.js').
        viteStaticCopy({
          targets: assets,
          verbose: true
        })
      ]
    })
  }
};

export default config;
