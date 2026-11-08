import { dataPaths } from '../../src/config/paths';
import { expect, test } from '../../src/fixtures';
import { uiProductRowSchema } from '../../src/schemas/test-data';
import { loadCsv } from '../../src/utils/data-loader';
import { isNonDecreasing, parseMoney } from '../../src/utils/money';

const catalogProducts = loadCsv(dataPaths.uiProducts, uiProductRowSchema);

test.describe('Inventory', () => {
  test(
    'lists the demo catalog',
    { tag: ['@smoke', '@regression', '@ui'] },
    async ({ inventoryPage }) => {
      await inventoryPage.open();
      await expect(inventoryPage.items).toHaveCount(6);
      await expect(
        inventoryPage.productNames.filter({ hasText: 'Sauce Labs Backpack' }),
      ).toBeVisible();
      await expect(
        inventoryPage.productNames.filter({ hasText: 'Sauce Labs Bike Light' }),
      ).toBeVisible();
    },
  );

  test(
    'sorts products by name from Z to A',
    { tag: ['@regression', '@ui'] },
    async ({ inventoryPage }) => {
      await inventoryPage.open();
      await inventoryPage.sortBy('za');
      await expect(inventoryPage.productNames.first()).toHaveText(
        'Test.allTheThings() T-Shirt (Red)',
      );
    },
  );

  test(
    'sorts products by price from low to high',
    { tag: ['@regression', '@ui'] },
    async ({ inventoryPage }) => {
      await inventoryPage.open();
      await inventoryPage.sortBy('lohi');
      await expect(inventoryPage.productNames.first()).toHaveText('Sauce Labs Onesie');
      await expect
        .poll(async () => {
          const amounts = (await inventoryPage.prices.allTextContents()).map(parseMoney);
          return isNonDecreasing(amounts);
        })
        .toBe(true);
    },
  );

  for (const product of catalogProducts) {
    test(
      `adds ${product.name} from the catalog data`,
      { tag: ['@regression', '@ui'] },
      async ({ inventoryPage }) => {
        await inventoryPage.open();
        await inventoryPage.addProduct(product.slug);
        await expect(inventoryPage.cartBadge).toHaveText('1');
        await expect(inventoryPage.removeButton(product.slug)).toBeVisible();
        await expect(inventoryPage.addButton(product.slug)).toHaveCount(0);
      },
    );
  }
});
