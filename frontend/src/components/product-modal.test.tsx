import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Product } from "@/data/products";
import { ProductModal } from "@/components/product-modal";

// next/image renders a plain <img> in tests (no optimization pipeline).
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(props as Record<string, string>)} />;
  },
}));

const product: Product = {
  id: "p1",
  category: "Wigs",
  name: "Egg Curl 18″",
  detail: "HD lace, grade 12A",
  description: "A lovely, bouncy curly wig.",
  lengths: [18, 20],
  price: 185000,
  oldPrice: 220000,
  image: "https://cdn.example/x.jpg",
};

afterEach(() => {
  document.body.style.overflow = "";
});

describe("ProductModal", () => {
  it("renders the product details", () => {
    render(<ProductModal product={product} onClose={() => {}} />);
    expect(
      screen.getByRole("heading", { name: "Egg Curl 18″" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A lovely, bouncy curly wig.")).toBeInTheDocument();
    expect(screen.getByText("Save 16%")).toBeInTheDocument();
    // length chips are the list items under "Available lengths"
    const chips = screen.getAllByRole("listitem");
    expect(chips).toHaveLength(2);
    expect(chips[0]).toHaveTextContent("18");
    expect(chips[1]).toHaveTextContent("20");
  });

  it("has a WhatsApp order link for the product", () => {
    render(<ProductModal product={product} onClose={() => {}} />);
    const link = screen.getByRole("link", {
      name: /order this on whatsapp/i,
    });
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("locks body scroll while open and restores it on unmount", () => {
    const { unmount } = render(
      <ProductModal product={product} onClose={() => {}} />,
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("calls onClose when the X button is clicked", async () => {
    const onClose = vi.fn();
    render(<ProductModal product={product} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is clicked", async () => {
    const onClose = vi.fn();
    render(<ProductModal product={product} onClose={onClose} />);
    await userEvent.click(
      screen.getByRole("button", { name: /close product details/i }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    render(<ProductModal product={product} onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("pushes a history entry so the Back button has something to pop", () => {
    const pushState = vi.spyOn(window.history, "pushState");
    render(<ProductModal product={product} onClose={() => {}} />);
    expect(pushState).toHaveBeenCalledWith({ modal: true }, "");
    pushState.mockRestore();
  });

  it("closes when the browser Back button fires a popstate", () => {
    const onClose = vi.fn();
    render(<ProductModal product={product} onClose={onClose} />);
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
