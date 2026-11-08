import type { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export abstract class BaseClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected url(pathname: string): string {
    return new URL(pathname, `${env.apiBaseUrl}/`).toString();
  }

  protected async send(
    method: 'GET' | 'POST',
    pathname: string,
    options: {
      params?: Record<string, string | number>;
      data?: unknown;
      headers?: Record<string, string>;
    } = {},
  ): Promise<APIResponse> {
    const target = this.url(pathname);
    const response = await this.request.fetch(target, {
      method,
      params: options.params,
      data: options.data,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
      timeout: 30_000,
    });
    logger.debug(`${method} ${response.status()} ${target}`);
    return response;
  }

  protected async json<T = unknown>(response: APIResponse, expectedStatus = 200): Promise<T> {
    if (response.status() !== expectedStatus) {
      const body = await response.text();
      throw new Error(
        `Expected HTTP ${expectedStatus} from ${response.url()} but received ${response.status()}\n${body}`,
      );
    }
    return (await response.json()) as T;
  }
}
