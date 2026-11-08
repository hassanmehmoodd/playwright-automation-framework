import type { APIResponse } from '@playwright/test';
import { BaseClient } from './base.client';

export class AuthClient extends BaseClient {
  login(username: string, password: string): Promise<unknown> {
    return this.loginResponse(username, password).then((response) => this.json(response));
  }

  loginResponse(username: string, password: string): Promise<APIResponse> {
    return this.send('POST', '/auth/login', {
      data: { username, password, expiresInMins: 30 },
      headers: { 'Content-Type': 'application/json' },
    });
  }

  currentUser(accessToken: string): Promise<unknown> {
    return this.send('GET', '/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((response) => this.json(response));
  }
}
