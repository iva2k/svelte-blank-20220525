import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['dot'], ['json', { outputFile: 'test-results.json' }]]
    : [['list'], ['json', { outputFile: 'test-results.json' }], ['html', { open: 'on-failure' }]],
  webServer: {
    command: 'pnpm run svelte:build:only && pnpm run svelte:preview', // TODO: (blocked by upstream) having "pnpm run svelte:build" calls "cap sync android", which hits a bug with no extension windows command file crashing in node --experimental-loader. Current workaround is to remove `cap` from playwright.
    port: 4173,
    timeout: 120 * 1000
  },
  testDir: 'tests'
  // TODO: (when needed) How to use Vite config? see https://github.com/microsoft/playwright/issues/14295#issuecomment-1132258917
  // use: {
  //   ctViteConfig: { }
  // }
};

export default config;
