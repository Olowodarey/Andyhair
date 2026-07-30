import { SignJWT, jwtVerify } from "jose";

function secret(): Uint8Array {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(value);
}

/** True when the submitted password matches the configured admin password. */
export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not configured");
  return password === expected;
}

/** Mint a 7-day admin session token. */
export function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

/** Verify the request carries a valid admin bearer token. */
export async function isAdmin(request: Request): Promise<boolean> {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  try {
    const { payload } = await jwtVerify(header.slice("Bearer ".length), secret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
