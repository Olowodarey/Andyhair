import { NextResponse } from "next/server";
import { isAdmin } from "@/server/auth";
import { badRequest, unauthorized } from "@/server/http";
import { createProduct, listProducts } from "@/server/products-service";
import { parseProductInput, ValidationError } from "@/server/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: list the whole catalogue. */
export async function GET() {
  return NextResponse.json(await listProducts());
}

/** Admin: create a product. */
export async function POST(request: Request) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const input = parseProductInput(await request.json());
    return NextResponse.json(await createProduct(input), { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) return badRequest(err.message);
    throw err;
  }
}
