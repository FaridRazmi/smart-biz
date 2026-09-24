import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function maskUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return {
      host: url.host,
      port: url.port,
      user: url.username,
      database: url.pathname.replace(/^\//, ""),
      params: url.search,
    };
  } catch {
    return "invalid-url";
  }
}

export async function GET() {
  const env = {
    DATABASE_URL: maskUrl(process.env.DATABASE_URL),
    DIRECT_URL: maskUrl(process.env.DIRECT_URL),
    SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
    NODE_ENV: process.env.NODE_ENV,
  };

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const rows = await prisma.$queryRawUnsafe<
      { exists: string | null }[]
    >(`SELECT to_regclass('public."User"')::text AS exists`);
    const userCount = await prisma.user.count();
    await prisma.$disconnect();

    return NextResponse.json({
      ok: true,
      env,
      userTable: rows[0]?.exists ?? null,
      userCount,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      env,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
