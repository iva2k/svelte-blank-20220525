import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['dot'], ['json', { outputFile: 'test-results.json' }]]
    : [['list'], ['json', { outputFile: 'test-results.json' }], ['html', { open: 'on-failure' }]],
  webServer: {
    command: 'pnpm run svelte:build && pnpm run preview',
    port: 3000,
    timeout: 120 * 1000
  }

  // TODO: How to use Vite config? see https://github.com/microsoft/playwright/issues/14295#issuecomment-1132258917
  // use: {
  //   ctViteConfig: { }
  // }
};

export default config;
