import { expect, test } from '../../src/fixtures';

test.describe('Cart', () => {
  test(
    'shows a badge after a product is added',
    { tag: ['@smoke', '@regression', '@ui'] },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.open();
      await inventoryPage.addProduct('sauce-labs-backpack');
      await expect(inventoryPage.cartBadge).toHaveText('1');

      await cartPage.open();
      await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack']);
      await expect(cartPage.cartBadge).toHaveText('1');
    },
  );

  test(
    'removes a product from the cart',
    { tag: ['@regression', '@ui'] },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.open();
      await inventoryPage.addProduct('sauce-labs-backpack');
      await inventoryPage.addProduct('sauce-labs-bike-light');

      await cartPage.open();
      await expect(cartPage.itemNames).toHaveCount(2);
      await cartPage.remove('sauce-labs-bike-light');
      await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack']);
      await expect(cartPage.cartBadge).toHaveText('1');
    },
  );
});
