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

  await prisma.product.delete({ where: { id } });

  revalidateApp();
  redirect("/products");
}
