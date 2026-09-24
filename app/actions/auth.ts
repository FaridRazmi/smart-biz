"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { endSession, hashPassword, startSession, verifyPassword } from "@/lib/auth";

export type AuthState = { error?: string };

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password1 = String(formData.get("password1") ?? "");
  const password2 = String(formData.get("password2") ?? "");

  if (!username || !password1) {
    return { error: "Username and password are required" };
  }

  if (password1 !== password2) {
    return { error: "Passwords do not match" };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "Username already exists" };
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash: await hashPassword(password1),
    },
  });

  await startSession({
    id: user.id,
    username: user.username,
    isStaff: user.isStaff,
    isSuperuser: user.isSuperuser,
  });

  redirect("/onboarding");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid username or password. Please check and try again." };
  }

  await startSession({
    id: user.id,
    username: user.username,
    isStaff: user.isStaff,
    isSuperuser: user.isSuperuser,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await endSession();
  redirect("/login");
}
