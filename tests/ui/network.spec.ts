import { expect, test } from '../../src/fixtures';
import { replaceImages } from '../../src/utils/network';

test.describe('Network interception', () => {
  test(
    'keeps the catalog usable when product images are replaced',
    { tag: ['@regression', '@ui', '@mock'] },
    async ({ page, inventoryPage }) => {
      const images = await replaceImages(page);
      await inventoryPage.open();
      await expect(inventoryPage.items).toHaveCount(6);
      await expect(inventoryPage.productNames.first()).toBeVisible();
      expect(images.intercepted()).toBeGreaterThan(0);
    },
  );

  test(
    'renders a title supplied by a mocked catalog response',
    { tag: ['@smoke', '@regression', '@ui', '@mock'] },
    async ({ page }) => {
      await page.route('https://dummyjson.com/products**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'access-control-allow-origin': new URL(page.url() || 'https://www.saucedemo.com')
              .origin,
          },
          body: JSON.stringify({
            products: [{ id: 9001, title: 'Intercepted Wireless Keyboard', price: 42 }],
            total: 1,
            skip: 0,
            limit: 1,
          }),
        });
      });

      await page.goto('/');
      await page.evaluate(async () => {
        const response = await fetch('https://dummyjson.com/products?limit=1');
        const data = (await response.json()) as { products: { title: string }[] };
        const title = document.createElement('p');
        title.dataset.test = 'mocked-product-title';
        title.textContent = data.products[0]?.title ?? 'missing';
        document.body.appendChild(title);
      });

      await expect(page.getByTestId('mocked-product-title')).toHaveText(
        'Intercepted Wireless Keyboard',
      );
    },
  );

  test(
    'patches one field on a live product response',
    { tag: ['@regression', '@ui', '@mock'] },
    async ({ page }) => {
      await page.route('https://dummyjson.com/products/1', async (route) => {
        const response = await route.fetch();
        const body = (await response.json()) as { id: number; title: string };
        body.title = 'Mutated Product Title';
        await route.fulfill({
          response,
          body: JSON.stringify(body),
          headers: {
            ...response.headers(),
            'content-type': 'application/json',
            'access-control-allow-origin': new URL(page.url() || 'https://www.saucedemo.com')
              .origin,
          },
        });
      });

      await page.goto('/');
      await page.evaluate(async () => {
        const response = await fetch('https://dummyjson.com/products/1');
        const product = (await response.json()) as { id: number; title: string };
        const title = document.createElement('p');
        title.dataset.test = 'mutated-product-title';
        title.dataset.productId = String(product.id);
        title.textContent = product.title;
        document.body.appendChild(title);
      });

      const title = page.getByTestId('mutated-product-title');
      await expect(title).toHaveText('Mutated Product Title');
      await expect(title).toHaveAttribute('data-product-id', '1');
    },
  );
});
