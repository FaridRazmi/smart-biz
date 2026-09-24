import { prisma } from "./prisma";
import { EXPIRY_WARNING_DAYS } from "./rental";

export type Notification = { type: "warning" | "danger"; message: string };

export async function getNotifications(userId: number): Promise<Notification[]> {
  const now = new Date();

  const [lowStock, outOfStock, rentables] = await Promise.all([
    prisma.product.count({ where: { userId, quantity: { lt: 10, gt: 0 } } }),
    prisma.product.count({ where: { userId, quantity: 0 } }),
    prisma.product.findMany({
      where: { userId, isRentable: true, accountExpiryDate: { not: null } },
      select: { accountExpiryDate: true },
    }),
  ]);

  const notifications: Notification[] = [];

  if (lowStock > 0) {
    notifications.push({
      type: "warning",
      message: `${lowStock} product(s) are running low on stock (< 10 units left).`,
    });
  }

  if (outOfStock > 0) {
    notifications.push({
      type: "danger",
      message: `${outOfStock} product(s) are completely out of stock.`,
    });
  }

  const soon = new Date(now.getTime() + EXPIRY_WARNING_DAYS * 24 * 60 * 60 * 1000);
  const expired = rentables.filter(
    (product) => product.accountExpiryDate && product.accountExpiryDate < now,
  ).length;
  const expiring = rentables.filter(
    (product) =>
      product.accountExpiryDate &&
      product.accountExpiryDate >= now &&
      product.accountExpiryDate <= soon,
  ).length;

  if (expired > 0) {
    notifications.push({
      type: "danger",
      message: `${expired} rental account(s) have expired. Renew before renting them out.`,
    });
  }

  if (expiring > 0) {
    notifications.push({
      type: "warning",
      message: `${expiring} rental account(s) expire within ${EXPIRY_WARNING_DAYS} days.`,
    });
  }

  return notifications;
}
