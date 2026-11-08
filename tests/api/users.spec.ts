import { userListSchema } from '../../src/api/schemas/dummyjson';
import { expect, test } from '../../src/fixtures';
import { parseWithSchema } from '../../src/utils/schema';

test.describe('Users API', () => {
  test(
    'returns a page of users that matches the user schema',
    { tag: ['@regression', '@api'] },
    async ({ usersApi }) => {
      const body = parseWithSchema(userListSchema, await usersApi.list(5), 'GET /users');
      expect(body.limit).toBe(5);
      expect(body.users).toHaveLength(5);
      expect(body.total).toBeGreaterThanOrEqual(5);
      expect(new Set(body.users.map((user) => user.id)).size).toBe(body.users.length);
    },
  );
});
