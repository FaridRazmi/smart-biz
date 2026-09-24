import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    DIRECT_URL: Boolean(process.env.DIRECT_URL),
    SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
  };

  try {
    const rows = await prisma.$queryRaw<{ exists: string | null }[]>`
      SELECT to_regclass('public."User"')::text AS exists
    `;
    const userCount = await prisma.user.count();
    return NextResponse.json({
      ok: true,
      env,
      userTable: rows[0]?.exists ?? null,
      userCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        env,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
