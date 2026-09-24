import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "sb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type SessionUser = {
  id: number;
  username: string;
  isStaff: boolean;
  isSuperuser: boolean;
};

function secretKey() {
  const value = process.env.SESSION_SECRET || "dev-only-session-secret-change-me";
  return new TextEncoder().encode(value);
}

export async function signSession(user: SessionUser) {
  return new SignJWT({
    id: user.id,
    username: user.username,
    isStaff: user.isStaff,
    isSuperuser: user.isSuperuser,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.id !== "number" || typeof payload.username !== "string") {
      return null;
    }
    return {
      id: payload.id,
      username: payload.username,
      isStaff: Boolean(payload.isStaff),
      isSuperuser: Boolean(payload.isSuperuser),
    };
  } catch {
    return null;
  }
}
