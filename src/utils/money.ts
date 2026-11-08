export function parseMoney(value: string): number {
  const amount = Number(value.replace(/[^0-9.-]/g, ''));
  if (Number.isNaN(amount)) {
    throw new Error(`Unable to parse a money value from "${value}"`);
  }
  return amount;
}

export function isNonDecreasing(values: number[]): boolean {
  return values.every((value, index) => index === 0 || value >= values[index - 1]!);
}
