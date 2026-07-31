import { describe, expect, it } from "vitest";
import { badRequest, notFound, unauthorized } from "@/server/http";

describe("http helpers", () => {
  it("unauthorized() returns a 401 with a message", async () => {
    const res = unauthorized();
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ message: "Unauthorized" });
  });

  it("notFound() returns a 404 with a message", async () => {
    const res = notFound();
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ message: "Not found" });
  });

  it("badRequest() returns a 400 carrying the given message", async () => {
    const res = badRequest("price must be a whole number ≥ 0");
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      message: "price must be a whole number ≥ 0",
    });
  });
});
