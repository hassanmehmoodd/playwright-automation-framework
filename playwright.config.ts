import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import { authStoragePath, env } from './src/config/env';

/**
 * Tag filters are applied per test project, not globally.
 * That keeps the `setup` project running even when a tag such as @smoke
 * is selected, so storageState exists before authenticated UI tests.
 *
 * Prefer the npm scripts (`test:smoke`, `test:api`, ...). A raw `--grep`
 * flag is applied by Playwright to every project, including setup.
 */
const grepSource = process.env.TEST_GREP?.trim();
const testGrep = grepSource ? new RegExp(grepSource) : undefined;

const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { open: 'never', outputFolder: 'playwright-report' }],
  [
    'allure-playwright',
    {
      resultsDir: 'allure-results',
      environmentInfo: {
        testEnv: env.testEnv,
        envLabel: env.envLabel,
        baseUrl: env.baseUrl,
        apiBaseUrl: env.apiBaseUrl,
      },
    },
  ],
];

if (process.env.CI) {
  reporters.push(['github']);
}

const desktopChrome = {
  ...devices['Desktop Chrome'],
  viewport: { width: 1440, height: 900 },
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  outputDir: 'test-results',
  reporter: reporters,
  use: {
    baseURL: env.baseUrl,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...desktopChrome },
    },
    {
      name: 'chromium',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      grep: testGrep,
      dependencies: ['setup'],
      use: {
        ...desktopChrome,
        storageState: authStoragePath,
      },
    },
    {
      name: 'firefox',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      grep: testGrep,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 },
        storageState: authStoragePath,
      },
    },
    {
      name: 'webkit',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      grep: testGrep,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 },
        storageState: authStoragePath,
      },
    },
    {
      name: 'api',
      testMatch: /.*\/api\/.*\.spec\.ts/,
      grep: testGrep,
      use: {
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
  ],
});
