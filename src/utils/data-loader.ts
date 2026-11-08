import fs from 'fs';
import path from 'path';
import type { ZodType } from 'zod';

export function loadJson<T>(relativePath: string, schema: ZodType<T>): T {
  const fullPath = path.resolve(process.cwd(), relativePath);
  const raw: unknown = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid JSON in ${relativePath}:\n${parsed.error.toString()}`);
  }
  return parsed.data;
}

export function loadCsv<T>(relativePath: string, rowSchema: ZodType<T>): T[] {
  const fullPath = path.resolve(process.cwd(), relativePath);
  const text = fs.readFileSync(fullPath, 'utf8').trim();
  if (!text) {
    throw new Error(`CSV file is empty: ${relativePath}`);
  }

  const [headerLine, ...lines] = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!headerLine || lines.length === 0) {
    throw new Error(`CSV file needs a header and at least one row: ${relativePath}`);
  }

  const headers = parseCsvLine(headerLine);
  return lines.map((line, index) => {
    const values = parseCsvLine(line);
    const record = Object.fromEntries(
      headers.map((header, column) => [header, values[column] ?? '']),
    );
    const parsed = rowSchema.safeParse(record);
    if (!parsed.success) {
      throw new Error(
        `Invalid CSV row ${index + 2} in ${relativePath}:\n${parsed.error.toString()}`,
      );
    }
    return parsed.data;
  });
}

/**
 * Small RFC-style CSV splitter that understands quoted commas and escaped quotes.
 * Enough for the checked-in fixtures; it is not a general-purpose CSV library.
 */
export function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}
