"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export type SaleState = { error?: string };

export async function recordSale(
  _prev: SaleState,
  formData: FormData,
): Promise<SaleState> {
  const user = await getSessionUser();
  if (!user) redirect("/dashboard");

  const id = Number(formData.get("id"));
  const product = await prisma.product.findFirst({ where: { id, userId: user.id } });
  if (!product) redirect("/products");

  const quantitySold = Math.trunc(Number(formData.get("quantity_sold") ?? 0) || 0);

  if (!(quantitySold > 0) || quantitySold > product.quantity) {
    return {
      error: `Invalid quantity. You only have ${product.quantity} units in stock.`,
    };
  }

  await prisma.$transaction([
    prisma.sale.create({
      data: {
        userId: user.id,
        productId: product.id,
        quantitySold,
        totalPrice: Number(product.sellingPrice) * quantitySold,
      },
    }),
    prisma.product.update({
      where: { id: product.id },
      data: { quantity: product.quantity - quantitySold },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath("/sales/history");
  redirect("/dashboard");
}
