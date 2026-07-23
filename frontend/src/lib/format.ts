/** Format a Naira amount, e.g. 185000 -> "₦185,000". */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

/** Whole-number discount percentage, e.g. (185000, 220000) -> 16. */
export function discountPercent(price: number, oldPrice: number): number {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
