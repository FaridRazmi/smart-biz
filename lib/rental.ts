export const DURATION_TYPES = ["3h", "day", "week", "month"] as const;
export type DurationType = (typeof DURATION_TYPES)[number];

export const DURATION_LABELS: Record<DurationType, string> = {
  "3h": "3 Jam",
  day: "1 Hari",
  week: "1 Minggu",
  month: "1 Bulan",
};

const DURATION_HOURS: Record<DurationType, number> = {
  "3h": 3,
  day: 24,
  week: 168,
  month: 720,
};

export function isDurationType(value: string): value is DurationType {
  return (DURATION_TYPES as readonly string[]).includes(value);
}

export function rentalEndAt(start: Date, type: DurationType) {
  return new Date(start.getTime() + DURATION_HOURS[type] * 60 * 60 * 1000);
}

type ProductPriceFields = {
  rentalPrice3h: unknown;
  rentalPriceDay: unknown;
  rentalPriceWeek: unknown;
  rentalPriceMonth: unknown;
};

export function priceForProduct(product: ProductPriceFields, type: DurationType): number {
  const map: Record<DurationType, unknown> = {
    "3h": product.rentalPrice3h,
    day: product.rentalPriceDay,
    week: product.rentalPriceWeek,
    month: product.rentalPriceMonth,
  };
  const value = Number(map[type]);
  return Number.isFinite(value) ? value : 0;
}

export function rentalPrices(product: ProductPriceFields): Record<DurationType, number> {
  return {
    "3h": priceForProduct(product, "3h"),
    day: priceForProduct(product, "day"),
    week: priceForProduct(product, "week"),
    month: priceForProduct(product, "month"),
  };
}

export function formatRemaining(endAt: Date, now: Date = new Date()) {
  const ms = endAt.getTime() - now.getTime();
  if (ms <= 0) return "Tamat";
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days} hari ${hours} jam`;
  if (hours > 0) return `${hours} jam ${minutes} min`;
  return `${minutes} min`;
}
