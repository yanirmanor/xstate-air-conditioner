// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: "src/tests",
  workers: 4,
  use: {
    headless: true,
    baseURL: "http://localhost:3000/",
    browserName: "chromium",
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: "on-first-retry",
  },
};

module.exports = config;
