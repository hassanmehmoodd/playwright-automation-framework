import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async openPath(pathname: string): Promise<void> {
    await this.page.goto(pathname);
  }
}
