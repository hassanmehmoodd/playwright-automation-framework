import fs from 'node:fs';
import path from 'node:path';
import { chromium, selectors } from '@playwright/test';

selectors.setTestIdAttribute('data-test');

const outDir = path.resolve('docs/screenshots');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function save(name) {
  const target = path.join(outDir, name);
  await page.screenshot({ path: target });
  console.log(`saved ${target}`);
}

await page.goto('https://www.saucedemo.com/');
await page.getByTestId('login-button').waitFor();
await save('login.png');

await page.getByTestId('username').fill('standard_user');
await page.getByTestId('password').fill('secret_sauce');
await page.getByTestId('login-button').click();
await page.getByTestId('inventory-container').waitFor();
await save('inventory.png');

await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
await page.getByTestId('shopping-cart-badge').waitFor();
await page.getByTestId('shopping-cart-link').click();
await page.getByTestId('checkout').waitFor();
await save('cart.png');

await page.getByTestId('checkout').click();
await page.getByTestId('firstName').fill('Jordan');
await page.getByTestId('lastName').fill('Lee');
await page.getByTestId('postalCode').fill('54000');
await page.getByTestId('continue').click();
await page.getByTestId('finish').click();
await page.getByTestId('complete-header').waitFor();
await save('checkout-complete.png');

async function saveReport(url, filename, readyText) {
  const report = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await report.goto(url, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await report.getByText(readyText).first().waitFor({ timeout: 15_000 });
    const target = path.join(outDir, filename);
    await report.screenshot({ path: target });
    console.log(`saved ${target}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`skipped ${filename}: ${message}`);
  } finally {
    await report.close();
  }
}

await saveReport(
  process.env.PLAYWRIGHT_REPORT_URL ?? 'http://127.0.0.1:9323',
  'playwright-report.png',
  'Passed',
);
await saveReport(
  process.env.ALLURE_REPORT_URL ?? 'http://127.0.0.1:9324',
  'allure-report.png',
  'Allure',
);

await browser.close();
