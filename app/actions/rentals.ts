"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { accountExpiryStatus, isDurationType, priceForProduct, rentalEndAt } from "@/lib/rental";

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

  const startRaw = String(formData.get("start_at") ?? "").trim();
  const parsedStart = startRaw ? new Date(startRaw) : new Date();
  const startAt = Number.isNaN(parsedStart.getTime()) ? new Date() : parsedStart;
  const endAt = rentalEndAt(startAt, durationType);

  if (accountExpiryStatus(product.accountExpiryDate, startAt) === "expired") {
    return { error: "Akaun ini dah luput. Perbaharui tarikh luput sebelum sewa." };
  }

  const conflicts = await prisma.rental.count({
    where: {
      productId: product.id,
      status: { not: "cancelled" },
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
  });

  const slots = Math.max(product.quantity, 1);
  if (conflicts >= slots) {
    return {
      error: "Tempoh ini bertindih dengan sewaan lain untuk item ini. Pilih masa lain.",
    };
  }

  const tierPrice = priceForProduct(product, durationType);
  const priceRaw = String(formData.get("price") ?? "").trim();
  const parsedPrice = priceRaw ? Number(priceRaw) : tierPrice;
  const price = Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : tierPrice;
  const promoNote = String(formData.get("promo_note") ?? "").trim();
  const isPromo = price < tierPrice;

  await prisma.rental.create({
    data: {
      userId: user.id,
      productId: product.id,
      customerName,
      customerPhone,
      durationType,
      startAt,
      endAt,
      price,
      originalPrice: tierPrice,
      isPromo,
      promoNote,
      status: endAt.getTime() > Date.now() ? "active" : "completed",
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

export async function deleteRental(formData: FormData) {
  const user = await getSessionUser();

  const id = Number(formData.get("id"));
  const rental = await prisma.rental.findFirst({ where: { id, userId: user.id } });
  if (!rental) redirect("/rentals");

  await prisma.rental.delete({ where: { id } });

  revalidateAll();
  redirect("/rentals");
}
