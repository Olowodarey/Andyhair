// @vitest-environment node
import { SignJWT } from "jose";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkPassword, isAdmin, signAdminToken } from "@/server/auth";

const ORIGINAL = { ...process.env };

beforeEach(() => {
  process.env.JWT_SECRET = "test-secret";
  process.env.ADMIN_PASSWORD = "hunter2";
});

afterEach(() => {
  process.env = { ...ORIGINAL };
});

function bearer(token: string): Request {
  return new Request("http://localhost/api/products", {
    headers: { authorization: `Bearer ${token}` },
  });
}

describe("checkPassword", () => {
  it("accepts the configured password", () => {
    expect(checkPassword("hunter2")).toBe(true);
  });

  it("rejects a wrong password", () => {
    expect(checkPassword("nope")).toBe(false);
  });

  it("throws when ADMIN_PASSWORD is not configured", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(() => checkPassword("hunter2")).toThrow(/ADMIN_PASSWORD/);
  });
});

describe("signAdminToken + isAdmin", () => {
  it("mints a token that isAdmin accepts", async () => {
    const token = await signAdminToken();
    expect(await isAdmin(bearer(token))).toBe(true);
  });

  it("rejects a request with no authorization header", async () => {
    expect(await isAdmin(new Request("http://localhost/"))).toBe(false);
  });

  it("rejects a malformed authorization header", async () => {
    const req = new Request("http://localhost/", {
      headers: { authorization: "Token abc" },
    });
    expect(await isAdmin(req)).toBe(false);
  });

  it("rejects a token signed with a different secret", async () => {
    const foreign = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode("some-other-secret"));
    expect(await isAdmin(bearer(foreign))).toBe(false);
  });

  it("rejects a validly-signed token whose role is not admin", async () => {
    const notAdmin = await new SignJWT({ role: "user" })
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode("test-secret"));
    expect(await isAdmin(bearer(notAdmin))).toBe(false);
  });

  it("rejects an expired token", async () => {
    const expired = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("-1h")
      .sign(new TextEncoder().encode("test-secret"));
    expect(await isAdmin(bearer(expired))).toBe(false);
  });
});
