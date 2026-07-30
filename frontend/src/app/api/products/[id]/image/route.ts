import { NextResponse } from "next/server";
import { isAdmin } from "@/server/auth";
import { badRequest, notFound, unauthorized } from "@/server/http";
import { setProductImage } from "@/server/products-service";
import { deleteUpload, saveUpload, UploadError } from "@/server/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Admin: upload/replace a product photo (multipart, field "file"). */
export async function POST(request: Request, { params }: Ctx) {
  if (!(await isAdmin(request))) return unauthorized();
  const { id } = await params;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return badRequest("No image file provided");

  try {
    const url = await saveUpload(file);
    const product = await setProductImage(id, url);
    if (!product) {
      await deleteUpload(url); // product vanished — don't orphan the blob
      return notFound();
    }
    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof UploadError) return badRequest(err.message);
    throw err;
  }
}
