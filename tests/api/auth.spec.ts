import {
  apiErrorSchema,
  authSessionSchema,
  currentUserSchema,
} from '../../src/api/schemas/dummyjson';
import { env } from '../../src/config/env';
import { expect, test } from '../../src/fixtures';
import { parseWithSchema } from '../../src/utils/schema';

test.describe('Auth API', () => {
  test(
    'issues a bearer token for the public demo user',
    { tag: ['@smoke', '@regression', '@api'] },
    async ({ authApi }) => {
      const session = parseWithSchema(
        authSessionSchema,
        await authApi.login(env.apiUsername, env.apiPassword),
        'POST /auth/login',
      );
      expect(session.username).toBe(env.apiUsername);
      expect(session.email).toContain('@');
      expect(session.accessToken).not.toBe(session.refreshToken);
    },
  );

  test(
    'returns the current user for a valid bearer token',
    { tag: ['@regression', '@api'] },
    async ({ authApi }) => {
      const session = parseWithSchema(
        authSessionSchema,
        await authApi.login(env.apiUsername, env.apiPassword),
        'POST /auth/login',
      );
      const me = parseWithSchema(
        currentUserSchema,
        await authApi.currentUser(session.accessToken),
        'GET /auth/me',
      );
      expect(me.id).toBe(session.id);
      expect(me.username).toBe(env.apiUsername);
      expect(me.firstName).toBe(session.firstName);
    },
  );

  test('rejects an invalid password', { tag: ['@regression', '@api'] }, async ({ authApi }) => {
    const response = await authApi.loginResponse(env.apiUsername, 'definitely-wrong');
    expect(response.status()).toBe(400);
    const body = parseWithSchema(apiErrorSchema, await response.json(), 'POST /auth/login invalid');
    expect(body.message).toContain('Invalid credentials');
  });
});
