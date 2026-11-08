import fs from 'fs';
import path from 'path';
import { expect, test } from '@playwright/test';
import { authStoragePath, env } from '../../src/config/env';

test('authenticate the standard demo user', async ({ page }) => {
  fs.mkdirSync(path.dirname(authStoragePath), { recursive: true });

  await page.goto('/');
  await page.getByTestId('username').fill(env.username);
  await page.getByTestId('password').fill(env.password);
  await page.getByTestId('login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByTestId('title')).toHaveText('Products');
  await page.context().storageState({ path: authStoragePath });
});
