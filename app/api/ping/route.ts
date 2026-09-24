import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function safeHost(value: string | undefined) {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return "invalid-url";
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasDirectUrl: Boolean(process.env.DIRECT_URL),
    hasSessionSecret: Boolean(process.env.SESSION_SECRET),
    databaseUrlHost: safeHost(process.env.DATABASE_URL),
    nodeEnv: process.env.NODE_ENV,
  });
}
