import { describe, expect, it } from "vitest";
import { CATEGORIES, categoryToSlug, slugToCategory } from "@/data/products";

describe("categoryToSlug", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(categoryToSlug("Luxury Hair")).toBe("luxury-hair");
  });

  it("handles single-word categories", () => {
    expect(categoryToSlug("Wigs")).toBe("wigs");
  });
});

describe("slugToCategory", () => {
  it("resolves a known slug back to its category", () => {
    expect(slugToCategory("luxury-hair")).toBe("Luxury Hair");
    expect(slugToCategory("attachments")).toBe("Attachments");
  });

  it("returns null for an unknown slug", () => {
    expect(slugToCategory("does-not-exist")).toBeNull();
    expect(slugToCategory("all")).toBeNull();
  });

  it("round-trips every category through slug and back", () => {
    for (const category of CATEGORIES) {
      expect(slugToCategory(categoryToSlug(category))).toBe(category);
    }
  });
});
