import { NextResponse } from "next/server";
import { isAdmin } from "@/server/auth";
import { badRequest, notFound, unauthorized } from "@/server/http";
import {
  deleteProduct,
  getProduct,
  updateProduct,
} from "@/server/products-service";
import { parseProductPatch, ValidationError } from "@/server/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Public: read one product. */
export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const product = await getProduct(id);
  return product ? NextResponse.json(product) : notFound();
}

/** Admin: update fields on a product. */
export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await isAdmin(request))) return unauthorized();
  const { id } = await params;
  try {
    const patch = parseProductPatch(await request.json());
    const updated = await updateProduct(id, patch);
    return updated ? NextResponse.json(updated) : notFound();
  } catch (err) {
    if (err instanceof ValidationError) return badRequest(err.message);
    throw err;
  }
}

/** Admin: delete a product (and its photo). */
export async function DELETE(request: Request, { params }: Ctx) {
  if (!(await isAdmin(request))) return unauthorized();
  const { id } = await params;
  const ok = await deleteProduct(id);
  return ok ? new NextResponse(null, { status: 204 }) : notFound();
}
