import { defineConfig } from '@playwright/test';

/* E2E motion + interaction suite (tests/e2e). Runs against a production
   build of the port and, for the parity spec, the static prototype. Both
   servers bind loopback only. Uses the installed Google Chrome. */

export const APP_URL = 'http://127.0.0.1:4330';
export const PROTO_URL = 'http://127.0.0.1:4331/landing.html';

export default defineConfig({
  testDir: 'tests/e2e',
  // motion assertions are timing-sensitive: one page at a time
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [['list']],
  use: {
    baseURL: APP_URL,
    channel: 'chrome',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run build && npm run start -- -p 4330',
      url: APP_URL,
      timeout: 240_000,
      reuseExistingServer: false,
    },
    {
      command: 'python3 -m http.server 4331 --bind 127.0.0.1 --directory design/assets',
      url: PROTO_URL,
      reuseExistingServer: true,
    },
  ],
});
