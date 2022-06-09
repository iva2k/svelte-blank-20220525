const preprocess = require('svelte-preprocess');

module.exports = {
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-svelte-csf',
    '@storybook/addon-interactions'
  ],
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true
  },
  framework: '@storybook/svelte',
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  svelteOptions: {
    preprocess: preprocess()
  },
  features: {
    storyStoreV7: true // Enable on-demand stories loading/ Not loading .stories.svelte in storybook v6.5.3
  }
};
