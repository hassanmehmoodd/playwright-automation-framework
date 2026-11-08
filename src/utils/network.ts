import type { Page, Route } from '@playwright/test';

/** 1x1 transparent PNG used when a test replaces product images. */
export const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

export async function replaceImages(page: Page): Promise<{ intercepted: () => number }> {
  let count = 0;
  await page.route('**/*', async (route: Route) => {
    if (route.request().resourceType() !== 'image') {
      await route.continue();
      return;
    }
    count += 1;
    await route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: TRANSPARENT_PNG,
    });
  });
  return { intercepted: () => count };
}
