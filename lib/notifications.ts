import { prisma } from "./prisma";

export type Notification = { type: "warning" | "danger"; message: string };

export async function getNotifications(userId: number): Promise<Notification[]> {
  const [lowStock, outOfStock] = await Promise.all([
    prisma.product.count({ where: { userId, quantity: { lt: 10, gt: 0 } } }),
    prisma.product.count({ where: { userId, quantity: 0 } }),
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

  return notifications;
}
