import type { ZodType } from 'zod';

export function parseWithSchema<T>(schema: ZodType<T>, data: unknown, label: string): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Schema validation failed for ${label}:\n${parsed.error.toString()}`);
  }
  return parsed.data;
}
