import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const username = process.env.ADMIN_USERNAME ?? "admin";
const password = process.env.ADMIN_PASSWORD ?? "admin123";

const passwordHash = await bcrypt.hash(password, 10);

const user = await prisma.user.upsert({
  where: { username },
  update: { passwordHash, isStaff: true, isSuperuser: true, isActive: true },
  create: {
    username,
    email: "",
    passwordHash,
    isStaff: true,
    isSuperuser: true,
    isActive: true,
  },
});

console.log(`Admin account ready: ${user.username}`);
await prisma.$disconnect();
