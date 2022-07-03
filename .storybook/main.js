const path = require('path');

const preprocess = require('svelte-preprocess');

module.exports = {
  // Customize Vite config
  async viteFinal(config, { configType }) {
    // Resolve 'Error: [vite-plugin-mdx] "@mdx-js/react" must be installed'
    // https://github.com/storybookjs/builder-vite/issues/237#issuecomment-1047819614
    // https://github.com/storybookjs/builder-vite/issues/55
    config.root = path.dirname(require.resolve('@storybook/builder-vite'));

    return config;
  },

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-svelte-csf',
    '@storybook/addon-interactions'
  ],
  core: {
    // we still have to use webpack in build mode because of babel-runtime issues of rollup
    // https://github.com/eirslett/storybook-builder-vite/issues/143
    builder: process.env.STORYBOOK_BUILD
      ? {
          name: 'webpack5',
          options: {
            lazyCompilation: true,
            fsCache: true
          }
        }
      : '@storybook/builder-vite',
    disableTelemetry: true
  },
  framework: '@storybook/svelte',
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  svelteOptions: {
    preprocess: preprocess()
  },
  features: {
    // storyStoreV7: false, // Disable on-demand stories loading. Not loading any stories in storybook v6.5.3
    storyStoreV7: true // Enable on-demand stories loading. Not loading .stories.svelte in storybook v6.5.3
  }
};
