import { dataPaths } from '../../src/config/paths';
import { expect, test } from '../../src/fixtures';
import { checkoutCustomersSchema, type CheckoutCustomer } from '../../src/schemas/test-data';
import { loadJson } from '../../src/utils/data-loader';

const customers: CheckoutCustomer[] = loadJson(
  dataPaths.checkoutCustomers,
  checkoutCustomersSchema,
);

test.describe('Checkout', () => {
  for (const customer of customers) {
    test(`completes an order for ${customer.firstName} ${customer.lastName} ${customer.tags.join(' ')}`, async ({
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      await inventoryPage.open();
      await inventoryPage.addProduct('sauce-labs-backpack');
      await inventoryPage.addProduct('sauce-labs-bike-light');

      await cartPage.open();
      await expect(cartPage.itemNames).toHaveCount(2);
      await cartPage.checkout();

      await checkoutPage.fillInformation(customer);
      await checkoutPage.continue();
      await expect(checkoutPage.summaryNames).toHaveCount(2);
      await expect(checkoutPage.subtotal).toContainText('39.98');
      await expect(checkoutPage.total).toContainText('43.18');

      await checkoutPage.finish();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });
  }

  test(
    'requires a first name before continuing',
    { tag: ['@regression', '@ui'] },
    async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.open();
      await inventoryPage.addProduct('sauce-labs-onesie');
      await cartPage.open();
      await cartPage.checkout();
      await checkoutPage.continue();
      await expect(checkoutPage.error).toContainText('First Name is required');
    },
  );
});
