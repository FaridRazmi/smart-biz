"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { isDurationType, priceForProduct, rentalEndAt } from "@/lib/rental";

export type RentState = { error?: string };

function revalidateAll() {
  revalidatePath("/rentals");
  revalidatePath("/products");
  revalidatePath("/dashboard");
}

export async function createRental(
  _prev: RentState,
  formData: FormData,
): Promise<RentState> {
  const user = await getSessionUser();

  const id = Number(formData.get("id"));
  const product = await prisma.product.findFirst({ where: { id, userId: user.id } });
  if (!product || !product.isRentable) redirect("/products");

  const durationType = String(formData.get("duration_type") ?? "");
  if (!isDurationType(durationType)) {
    return { error: "Pilih tempoh sewa yang sah." };
  }

  const customerName = String(formData.get("customer_name") ?? "").trim();
  if (!customerName) {
    return { error: "Nama pelanggan diperlukan." };
  }
  const customerPhone = String(formData.get("customer_phone") ?? "").trim();

  const now = new Date();
  const activeCount = await prisma.rental.count({
    where: { productId: product.id, status: "active", endAt: { gt: now } },
  });

  const slots = Math.max(product.quantity, 1);
  if (activeCount >= slots) {
    return { error: "Item ini sedang disewa. Tamatkan sewa semasa dahulu." };
  }

  await prisma.rental.create({
    data: {
      userId: user.id,
      productId: product.id,
      customerName,
      customerPhone,
      durationType,
      startAt: now,
      endAt: rentalEndAt(now, durationType),
      price: priceForProduct(product, durationType),
      status: "active",
    },
  });

  revalidateAll();
  redirect("/rentals");
}

export async function endRental(formData: FormData) {
  const user = await getSessionUser();

  const id = Number(formData.get("id"));
  const rental = await prisma.rental.findFirst({ where: { id, userId: user.id } });
  if (!rental) redirect("/rentals");

  await prisma.rental.update({
    where: { id },
    data: { status: "completed", endAt: new Date() },
  });

  revalidateAll();
  redirect("/rentals");
}
