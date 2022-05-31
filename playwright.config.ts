import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'pnpm run build && pnpm run preview',
    port: 3000,
    timeout: 120 * 1000
  }
};

export default config;
