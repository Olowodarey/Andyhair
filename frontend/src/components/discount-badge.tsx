import { discountPercent } from "@/lib/format";

export function DiscountBadge({
  price,
  oldPrice,
}: {
  price: number;
  oldPrice: number;
}) {
  return (
    <span className="inline-flex items-center rounded-full bg-discount px-2.5 py-1 text-xs font-semibold tracking-wide text-ivory">
      -{discountPercent(price, oldPrice)}%
    </span>
  );
}
