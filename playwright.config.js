import { defineConfig, devices } from '@playwright/test';

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL?.trim();
const localBaseURL = 'http://127.0.0.1:4173';
const DEFAULT_BROWSER_WORKERS = 4;
const workerOverride = Number.parseInt(process.env.PLAYWRIGHT_WORKERS || '', 10);
const workerCount = Number.isInteger(workerOverride) && workerOverride > 0
  ? workerOverride
  : DEFAULT_BROWSER_WORKERS;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: workerCount,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'npm run dev',
        url: localBaseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000
      },
  use: {
    baseURL: externalBaseURL || localBaseURL,
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } }
  ]
});
