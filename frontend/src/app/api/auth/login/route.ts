import { NextResponse } from "next/server";
import { checkPassword, signAdminToken } from "@/server/auth";
import { badRequest, unauthorized } from "@/server/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request body");
  }
  if (typeof body.password !== "string" || body.password === "") {
    return badRequest("Password is required");
  }
  if (!checkPassword(body.password)) {
    return unauthorized();
  }
  return NextResponse.json({ access_token: await signAdminToken() });
}
