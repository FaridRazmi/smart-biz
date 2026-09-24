"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/dashboard");
  return user;
}

function revalidateApp() {
  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath("/sales/history");
  revalidatePath("/rentals");
}

function parsePrice(formData: FormData, key: string): number | null {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function parseExpiry(formData: FormData): Date | null {
  const raw = String(formData.get("account_expiry") ?? "").trim();
  if (!raw) return null;
  const date = new Date(`${raw}T23:59:59`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function rentalFields(formData: FormData) {
  const isRentable = formData.get("is_rentable") === "on";
  return {
    isRentable,
    accountExpiryDate: isRentable ? parseExpiry(formData) : null,
    rentalPrice3h: isRentable ? parsePrice(formData, "rental_price_3h") : null,
    rentalPriceDay: isRentable ? parsePrice(formData, "rental_price_day") : null,
    rentalPriceWeek: isRentable ? parsePrice(formData, "rental_price_week") : null,
    rentalPriceMonth: isRentable ? parsePrice(formData, "rental_price_month") : null,
  };
}

export async function createProduct(formData: FormData) {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.product.create({
    data: {
      userId: user.id,
      name,
      quantity: Number(formData.get("quantity") ?? 0) || 0,
      buyingPrice: Number(formData.get("buying_price") ?? 0) || 0,
      sellingPrice: Number(formData.get("selling_price") ?? 0) || 0,
      ...rentalFields(formData),
    },
  });

  revalidateApp();
  redirect("/products");
}

export async function updateProduct(formData: FormData) {
  const user = await requireUser();

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;

  const product = await prisma.product.findFirst({ where: { id, userId: user.id } });
  if (!product) redirect("/products");

  await prisma.product.update({
    where: { id },
    data: {
      name,
      quantity: Number(formData.get("quantity") ?? 0) || 0,
      buyingPrice: Number(formData.get("buying_price") ?? 0) || 0,
      sellingPrice: Number(formData.get("selling_price") ?? 0) || 0,
      ...rentalFields(formData),
    },
  });

  revalidateApp();
  redirect("/products");
}

export async function deleteProduct(formData: FormData) {
  const user = await requireUser();

  const id = Number(formData.get("id"));
  if (!id) return;

  const product = await prisma.product.findFirst({ where: { id, userId: user.id } });
  if (!product) redirect("/products");

  const customerRecords = await prisma.sale.count({ where: { productId: id } });
  const rentalRecords = await prisma.rental.count({ where: { productId: id } });
  if (customerRecords > 0 || rentalRecords > 0) {
    redirect("/products");
  }

  await prisma.product.delete({ where: { id } });

  revalidateApp();
  redirect("/products");
}
