import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriceTag } from "@/components/price-tag";

describe("PriceTag", () => {
  it("renders the formatted price", () => {
    render(<PriceTag price={185000} />);
    expect(screen.getByText("₦185,000")).toBeInTheDocument();
  });

  it("shows the old price with a strikethrough when discounted", () => {
    const { container } = render(<PriceTag price={185000} oldPrice={220000} />);
    const struck = container.querySelector("s");
    expect(struck).not.toBeNull();
    expect(struck).toHaveTextContent("₦220,000");
  });

  it("omits the old price when there is no discount", () => {
    const { container } = render(<PriceTag price={185000} />);
    expect(container.querySelector("s")).toBeNull();
  });
});
