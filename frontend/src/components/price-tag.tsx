import { formatNaira } from "@/lib/format";

export function PriceTag({
  price,
  oldPrice,
  size = "base",
}: {
  price: number;
  oldPrice?: number;
  size?: "base" | "lg";
}) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span
        className={`font-semibold text-espresso ${
          size === "lg" ? "text-2xl" : "text-base sm:text-lg"
        }`}
      >
        {formatNaira(price)}
      </span>
      {oldPrice !== undefined && (
        <s className="text-sm text-clay">{formatNaira(oldPrice)}</s>
      )}
    </p>
  );
}
