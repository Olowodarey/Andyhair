// Note: ImageResponse (Satori) renders plain <img>; next/image is intentionally
// not used here — it doesn't apply to OG image generation.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { discountPercent } from "@/lib/format";
import { SITE } from "@/lib/site";
import { getProduct } from "@/server/products-service";

// DB-backed image; render per request so it reflects the live catalogue.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const alt = `${SITE.name} product`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette (mirrors the Tailwind theme tokens in globals.css).
const ESPRESSO = "#1B110C";
const COCOA = "#2A1A12";
const GOLD = "#C6913C";
const GOLD_LIGHT = "#E3B96A";
const CHAMPAGNE = "#EAD9C2";
const IVORY = "#FAF4EB";
const CLAY = "#8A5A38";
const DISCOUNT = "#B3312B";

/** Naira, glyph-safe for the default OG font (which lacks the ₦ symbol). */
function ngn(amount: number): string {
  return `NGN ${amount.toLocaleString("en-US")}`;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  // Brand wordmark, embedded as a data URI so no network fetch is needed.
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  const frame = {
    display: "flex",
    width: "100%",
    height: "100%",
    padding: 40,
    backgroundImage: `linear-gradient(135deg, ${ESPRESSO} 0%, ${COCOA} 100%)`,
  } as const;

  // Fallback card when the product is missing.
  if (!product) {
    return new ImageResponse(
      (
        <div style={frame}>
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid rgba(198,145,60,0.35)`,
              borderRadius: 28,
            }}
          >
            <img src={logoSrc} height={70} width={461} alt={SITE.name} />
          </div>
        </div>
      ),
      { ...size },
    );
  }

  const hasImage = Boolean(product.image);
  const nameSize = product.name.length > 26 ? 52 : 62;
  // Explicit wrap width for text (Satori measures wrapped height correctly only
  // with a concrete width). Derived from the frame/photo/padding geometry.
  const textWidth = hasImage ? 564 : 956;

  return new ImageResponse(
    (
      <div style={frame}>
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            borderRadius: 28,
            border: `2px solid rgba(198,145,60,0.35)`,
          }}
        >
          {hasImage && (
            <div
              style={{
                display: "flex",
                width: 440,
                height: "100%",
                flexShrink: 0,
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                width={440}
                height={546}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: hasImage ? "56px 56px" : "56px 80px",
              justifyContent: "center",
            }}
          >
            <img
              src={logoSrc}
              height={40}
              width={263}
              alt={SITE.name}
              style={{ marginBottom: 36 }}
            />

            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: GOLD,
              }}
            >
              {product.category}
            </div>

            <div
              style={{
                display: "flex",
                flexShrink: 0,
                width: textWidth,
                fontSize: nameSize,
                fontWeight: 700,
                lineHeight: 1.1,
                color: IVORY,
                marginTop: 14,
              }}
            >
              {truncate(product.name, 44)}
            </div>

            {product.detail && (
              <div
                style={{
                  display: "flex",
                  flexShrink: 0,
                  width: textWidth,
                  fontSize: 24,
                  lineHeight: 1.3,
                  color: CHAMPAGNE,
                  marginTop: 14,
                }}
              >
                {truncate(product.detail, 64)}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", marginTop: 32 }}>
              <div
                style={{
                  fontSize: 50,
                  fontWeight: 700,
                  color: GOLD_LIGHT,
                  whiteSpace: "nowrap",
                }}
              >
                {ngn(product.price)}
              </div>
              {product.oldPrice !== undefined && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginTop: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 26,
                      color: CLAY,
                      textDecoration: "line-through",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ngn(product.oldPrice)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 22,
                      fontWeight: 700,
                      color: IVORY,
                      backgroundColor: DISCOUNT,
                      borderRadius: 999,
                      padding: "6px 16px",
                    }}
                  >
                    Save {discountPercent(product.price, product.oldPrice)}%
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 40,
                fontSize: 22,
                color: "rgba(234,217,194,0.6)",
              }}
            >
              Order on WhatsApp · andyhair.xyz
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
