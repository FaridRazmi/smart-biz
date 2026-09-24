"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function toggleUserStatus(formData: FormData) {
  const admin = await getSessionUser();
  if (!admin || !(admin.isStaff || admin.isSuperuser)) redirect("/dashboard");

  const id = Number(formData.get("id"));
  if (!id) return;

  const user = await prisma.user.findFirst({
    where: { id, isStaff: false, isSuperuser: false },
  });
  if (!user) redirect("/admin-users");

  await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });

  revalidatePath("/admin-users");
  redirect("/admin-users");
}
