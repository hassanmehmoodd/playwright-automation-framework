import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const testEnv = process.env.TEST_ENV?.trim() || 'local';

/**
 * Precedence (highest first):
 * 1. Variables already present in the process environment (shell, CI)
 * 2. A gitignored `.env` file for local overrides
 * 3. `config/environments/<TEST_ENV>.env`
 * 4. Built-in defaults for the public demo apps
 */
const envFiles = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'config', 'environments', `${testEnv}.env`),
];

for (const file of envFiles) {
  if (fs.existsSync(file)) {
    dotenv.config({ path: file, override: false, quiet: true });
  }
}

function read(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

export const env = {
  testEnv,
  envLabel: read('ENV_LABEL', testEnv),
  baseUrl: read('BASE_URL', 'https://www.saucedemo.com'),
  apiBaseUrl: read('API_BASE_URL', 'https://dummyjson.com').replace(/\/$/, ''),
  username: read('SAUCE_USERNAME', 'standard_user'),
  password: read('SAUCE_PASSWORD', 'secret_sauce'),
  apiUsername: read('API_USERNAME', 'emilys'),
  apiPassword: read('API_PASSWORD', 'emilyspass'),
};

export const authStoragePath = path.join('playwright', '.auth', 'user.json');
