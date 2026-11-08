import { env } from '../../src/config/env';
import { dataPaths } from '../../src/config/paths';
import { expect, test } from '../../src/fixtures';
import { loginScenariosSchema, type LoginScenario } from '../../src/schemas/test-data';
import { loadJson } from '../../src/utils/data-loader';

const scenarios: LoginScenario[] = loadJson(dataPaths.loginScenarios, loginScenariosSchema);

test.describe('Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test(
    'signs in with the standard demo user',
    { tag: ['@smoke', '@regression', '@ui'] },
    async ({ loginPage, page }) => {
      await loginPage.open();
      await loginPage.signIn(env.username, env.password);
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.getByTestId('title')).toHaveText('Products');
    },
  );

  for (const scenario of scenarios) {
    test(`rejects ${scenario.name}`, { tag: ['@regression', '@ui'] }, async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.signIn(scenario.username, scenario.password);
      await expect(loginPage.error).toBeVisible();
      await expect(loginPage.error).toContainText(scenario.expectedError);
    });
  }
});
