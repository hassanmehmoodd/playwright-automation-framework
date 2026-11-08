import type { APIResponse } from '@playwright/test';
import { BaseClient } from './base.client';

export class ProductsClient extends BaseClient {
  list(limit = 10, skip = 0): Promise<unknown> {
    return this.send('GET', '/products', { params: { limit, skip } }).then((response) =>
      this.json(response),
    );
  }

  getById(id: number): Promise<unknown> {
    return this.send('GET', `/products/${id}`).then((response) => this.json(response));
  }

  getByIdResponse(id: number): Promise<APIResponse> {
    return this.send('GET', `/products/${id}`);
  }

  search(query: string): Promise<unknown> {
    return this.send('GET', '/products/search', { params: { q: query } }).then((response) =>
      this.json(response),
    );
  }
}
