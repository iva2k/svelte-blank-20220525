// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
// import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter({}),
    // ssr: false, // For Tauri // Moved to src/hooks.ts:handle() 1.0.0-next.222

    // Override http methods in the Todo forms
    methodOverride: {
      allowed: ['PATCH', 'DELETE']
    },

    alias: {
      // Place to add all aliases. Run 'svelte-kit sync' (or npm run prepare) to update paths in .svelte-kit/tsconfig.json
      // $components: resolve('./src/lib/components')
    }
  }
};

export default config;
