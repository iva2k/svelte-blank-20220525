const preprocess = require('svelte-preprocess');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: '@storybook/svelte',
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true
  },
  svelteOptions: {
    preprocess: preprocess()
  },
  features: {
    storyStoreV7: true // Enable on-demand stories loading/ Not loading .stories.svelte in storybook v6.5.3
  }
};
