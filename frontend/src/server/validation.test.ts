import { describe, expect, it } from "vitest";
import {
  parseProductInput,
  parseProductPatch,
  ValidationError,
} from "@/server/validation";

const valid = {
  category: "Wigs",
  name: "Egg Curl 18″",
  detail: "HD lace, grade 12A",
  description: "A lovely wig.",
  lengths: [18, 20, 22],
  price: 185000,
  oldPrice: 220000,
  badge: "New",
};

describe("parseProductInput", () => {
  it("accepts and normalises a valid payload", () => {
    const out = parseProductInput(valid);
    expect(out).toEqual({
      category: "Wigs",
      name: "Egg Curl 18″",
      detail: "HD lace, grade 12A",
      description: "A lovely wig.",
      lengths: [18, 20, 22],
      price: 185000,
      oldPrice: 220000,
      badge: "New",
    });
  });

  it("trims surrounding whitespace on string fields", () => {
    const out = parseProductInput({ ...valid, name: "  Padded  " });
    expect(out.name).toBe("Padded");
  });

  it("treats empty oldPrice/badge as null (no discount, no badge)", () => {
    const out = parseProductInput({ ...valid, oldPrice: "", badge: "" });
    expect(out.oldPrice).toBeNull();
    expect(out.badge).toBeNull();
  });

  it("rejects an unknown category", () => {
    expect(() => parseProductInput({ ...valid, category: "Shoes" })).toThrow(
      ValidationError,
    );
  });

  it("rejects a missing / blank name", () => {
    expect(() => parseProductInput({ ...valid, name: "   " })).toThrow(
      /name is required/,
    );
  });

  it("rejects a name longer than 120 characters", () => {
    expect(() =>
      parseProductInput({ ...valid, name: "x".repeat(121) }),
    ).toThrow(/120 characters/);
  });

  it("rejects a negative price", () => {
    expect(() => parseProductInput({ ...valid, price: -1 })).toThrow(
      ValidationError,
    );
  });

  it("rejects a non-integer price", () => {
    expect(() => parseProductInput({ ...valid, price: 10.5 })).toThrow(
      ValidationError,
    );
  });

  it("rejects empty lengths", () => {
    expect(() => parseProductInput({ ...valid, lengths: [] })).toThrow(
      /non-empty/,
    );
  });

  it("rejects lengths containing a non-positive or non-integer value", () => {
    expect(() => parseProductInput({ ...valid, lengths: [18, 0] })).toThrow(
      ValidationError,
    );
    expect(() => parseProductInput({ ...valid, lengths: [18, 20.5] })).toThrow(
      ValidationError,
    );
  });

  it("rejects a badge other than 'New'", () => {
    expect(() => parseProductInput({ ...valid, badge: "Hot" })).toThrow(
      /badge/,
    );
  });

  it("throws on a null/undefined body", () => {
    expect(() => parseProductInput(undefined)).toThrow(ValidationError);
    expect(() => parseProductInput(null)).toThrow(ValidationError);
  });
});

describe("parseProductPatch", () => {
  it("returns only the provided keys", () => {
    const patch = parseProductPatch({ price: 200000 });
    expect(patch).toEqual({ price: 200000 });
  });

  it("returns an empty object for an empty patch", () => {
    expect(parseProductPatch({})).toEqual({});
  });

  it("validates the keys that are present", () => {
    expect(() => parseProductPatch({ category: "Nope" })).toThrow(
      ValidationError,
    );
    expect(() => parseProductPatch({ price: -5 })).toThrow(ValidationError);
  });

  it("normalises oldPrice to null when cleared", () => {
    expect(parseProductPatch({ oldPrice: "" })).toEqual({ oldPrice: null });
  });

  it("does not touch keys that are absent", () => {
    const patch = parseProductPatch({ name: "  Renamed  " });
    expect(patch).toEqual({ name: "Renamed" });
    expect("price" in patch).toBe(false);
  });
});
