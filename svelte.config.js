// import adapter from '@sveltejs/adapter-auto';
import netlify from '@sveltejs/adapter-netlify';
import vercel from '@sveltejs/adapter-vercel';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
// import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true,
    scss: { includePaths: ['src', 'node_modules'] }
  }),

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
      // Place to add all aliases. Run 'svelte-kit sync' (or npm run prepare) to update paths in .svelte-kit/tsconfig.json
      // $components: resolve('./src/lib/components')
    },

    vite: () => ({
      plugins: [
        // copy is needed for vite to work in svelte:dev (especially under "tauri dev")
        viteStaticCopy({
          targets: [
            {
              src: 'node_modules/bootswatch/dist/darkly/*.css',
              dest: 'static/vendor/bootstrap/themes/darkly'
            },
            {
              src: 'node_modules/bootswatch/dist/flatly/*.css',
              dest: 'static/vendor/bootstrap/themes/flatly'
            }
          ]
        })
      ]
    })
  }
};

export default config;
