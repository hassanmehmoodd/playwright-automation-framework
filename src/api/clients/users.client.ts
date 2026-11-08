import { BaseClient } from './base.client';

export class UsersClient extends BaseClient {
  list(limit = 5): Promise<unknown> {
    return this.send('GET', '/users', { params: { limit } }).then((response) =>
      this.json(response),
    );
  }
}
