import { describe, expect, it } from "vitest";
import { discountPercent, formatNaira } from "@/lib/format";

describe("formatNaira", () => {
  it("prefixes the naira sign and groups thousands", () => {
    expect(formatNaira(185000)).toBe("₦185,000");
  });

  it("formats zero without separators", () => {
    expect(formatNaira(0)).toBe("₦0");
  });

  it("formats amounts under a thousand", () => {
    expect(formatNaira(750)).toBe("₦750");
  });

  it("groups millions", () => {
    expect(formatNaira(1250000)).toBe("₦1,250,000");
  });
});

describe("discountPercent", () => {
  it("returns the whole-number percentage saved", () => {
    expect(discountPercent(185000, 220000)).toBe(16);
  });

  it("rounds to the nearest whole percent", () => {
    // (100 - 66) / 100 = 34%
    expect(discountPercent(66, 100)).toBe(34);
    // (100 - 665) is nonsense; use a rounding case: 200 off 300 = 66.67 -> 67
    expect(discountPercent(100, 300)).toBe(67);
  });

  it("is zero when there is no price difference", () => {
    expect(discountPercent(100, 100)).toBe(0);
  });
});
