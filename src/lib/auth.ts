import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function sessionToken(): string {
  const secret = process.env.AUTH_SECRET || "dev-secret-change-me";
  return crypto
    .createHmac("sha256", secret)
    .update(adminPassword())
    .digest("hex");
}

export function verifyPassword(password: string): boolean {
  const expected = Buffer.from(adminPassword());
  const actual = Buffer.from(password);
  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  );
}

export async function createSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === sessionToken();
}
