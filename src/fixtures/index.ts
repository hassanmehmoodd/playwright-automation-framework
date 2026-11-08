import { test as base } from '@playwright/test';
import { AuthClient } from '../api/clients/auth.client';
import { ProductsClient } from '../api/clients/products.client';
import { UsersClient } from '../api/clients/users.client';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

type FrameworkFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productsApi: ProductsClient;
  authApi: AuthClient;
  usersApi: UsersClient;
};

export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  productsApi: async ({ request }, use) => {
    await use(new ProductsClient(request));
  },
  authApi: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
  usersApi: async ({ request }, use) => {
    await use(new UsersClient(request));
  },
});

export { expect } from '@playwright/test';
