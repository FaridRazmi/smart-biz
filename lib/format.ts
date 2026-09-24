export function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function rm(value: unknown, opts: { decimals?: number } = {}) {
  const n = toNumber(value);
  const decimals = opts.decimals ?? 0;
  return (
    "RM " +
    n.toLocaleString("en-MY", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: Math.max(decimals, 2),
    })
  );
}
