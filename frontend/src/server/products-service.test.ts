import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProductRow } from "@/server/product.schema";

// --- Mock the data source and blob storage so the service runs without a real
// Postgres connection or a Vercel Blob token. -----------------------------

const deleteUpload = vi.fn(async (url: string | null): Promise<void> => {
  void url;
});
vi.mock("@/server/uploads", () => ({
  deleteUpload: (url: string | null) => deleteUpload(url),
}));

/** A tiny in-memory stand-in for the TypeORM repository the service uses. */
function makeRepo(seed: ProductRow[] = []) {
  const rows = [...seed];
  return {
    rows,
    find: vi.fn(async () => [...rows]),
    findOne: vi.fn(async ({ where: { id } }: { where: { id: string } }) => {
      return rows.find((r) => r.id === id) ?? null;
    }),
    create: vi.fn((data: Partial<ProductRow>) => ({ ...data }) as ProductRow),
    save: vi.fn(async (entity: ProductRow) => {
      const existing = rows.findIndex((r) => r.id === entity.id);
      const saved = { ...entity, id: entity.id ?? "generated-id" } as ProductRow;
      if (existing >= 0) rows[existing] = saved;
      else rows.push(saved);
      return saved;
    }),
    remove: vi.fn(async (entity: ProductRow) => {
      const i = rows.findIndex((r) => r.id === entity.id);
      if (i >= 0) rows.splice(i, 1);
      return entity;
    }),
  };
}

let repo: ReturnType<typeof makeRepo>;

vi.mock("@/server/db", () => ({
  getDataSource: async () => ({
    getRepository: () => repo,
  }),
}));

// Imported after the mocks are declared (vi.mock is hoisted anyway).
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  setProductImage,
  updateProduct,
} from "@/server/products-service";

function row(overrides: Partial<ProductRow> = {}): ProductRow {
  return {
    id: "p1",
    category: "Wigs",
    name: "Egg Curl 18″",
    detail: "HD lace",
    description: "Lovely.",
    lengths: [18],
    price: 185000,
    oldPrice: null,
    imageUrl: null,
    badge: null,
    createdAt: new Date(),
    ...overrides,
  } as ProductRow;
}

beforeEach(() => {
  repo = makeRepo();
});

describe("toProduct mapping (via the service)", () => {
  it("maps null columns to undefined and passes imageUrl through as image", async () => {
    repo = makeRepo([
      row({
        id: "p1",
        oldPrice: 220000,
        imageUrl: "https://cdn.example/x.jpg",
        badge: "New",
      }),
    ]);
    const [product] = await listProducts();
    expect(product).toEqual({
      id: "p1",
      category: "Wigs",
      name: "Egg Curl 18″",
      detail: "HD lace",
      description: "Lovely.",
      lengths: [18],
      price: 185000,
      oldPrice: 220000,
      image: "https://cdn.example/x.jpg",
      badge: "New",
    });
  });

  it("omits oldPrice/image/badge when the columns are null", async () => {
    repo = makeRepo([row()]);
    const [product] = await listProducts();
    expect(product.oldPrice).toBeUndefined();
    expect(product.image).toBeUndefined();
    expect(product.badge).toBeUndefined();
  });
});

describe("getProduct", () => {
  it("returns the product when found", async () => {
    repo = makeRepo([row({ id: "abc" })]);
    expect(await getProduct("abc")).toMatchObject({ id: "abc" });
  });

  it("returns null when missing", async () => {
    expect(await getProduct("nope")).toBeNull();
  });
});

describe("createProduct", () => {
  it("creates the row with a null image and returns the clean shape", async () => {
    const created = await createProduct({
      category: "Wigs",
      name: "New Wig",
      detail: "detail",
      description: "desc",
      lengths: [20],
      price: 100000,
      oldPrice: null,
      badge: null,
    });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New Wig", imageUrl: null }),
    );
    expect(repo.save).toHaveBeenCalled();
    expect(created.image).toBeUndefined();
    expect(created.name).toBe("New Wig");
  });
});

describe("updateProduct", () => {
  it("applies the patch and returns the updated product", async () => {
    repo = makeRepo([row({ id: "p1", price: 185000 })]);
    const updated = await updateProduct("p1", { price: 200000 });
    expect(updated?.price).toBe(200000);
    expect(repo.rows[0].price).toBe(200000);
  });

  it("returns null when the product does not exist", async () => {
    expect(await updateProduct("ghost", { price: 1 })).toBeNull();
    expect(repo.save).not.toHaveBeenCalled();
  });
});

describe("deleteProduct", () => {
  it("removes the row, deletes its photo, and returns true", async () => {
    repo = makeRepo([row({ id: "p1", imageUrl: "https://cdn/x.jpg" })]);
    expect(await deleteProduct("p1")).toBe(true);
    expect(deleteUpload).toHaveBeenCalledWith("https://cdn/x.jpg");
    expect(repo.remove).toHaveBeenCalled();
    expect(repo.rows).toHaveLength(0);
  });

  it("returns false and touches nothing when the product is missing", async () => {
    expect(await deleteProduct("ghost")).toBe(false);
    expect(deleteUpload).not.toHaveBeenCalled();
    expect(repo.remove).not.toHaveBeenCalled();
  });
});

describe("setProductImage", () => {
  it("deletes the previous blob and stores the new url", async () => {
    repo = makeRepo([row({ id: "p1", imageUrl: "https://cdn/old.jpg" })]);
    const updated = await setProductImage("p1", "https://cdn/new.jpg");
    expect(deleteUpload).toHaveBeenCalledWith("https://cdn/old.jpg");
    expect(updated?.image).toBe("https://cdn/new.jpg");
    expect(repo.rows[0].imageUrl).toBe("https://cdn/new.jpg");
  });

  it("returns null when the product does not exist", async () => {
    expect(await setProductImage("ghost", "https://cdn/x.jpg")).toBeNull();
  });
});
