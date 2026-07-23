import { WhatsAppIcon } from "@/components/whatsapp-icon";

/**
 * Floating WhatsApp button. Currently disabled — rendered as a non-interactive,
 * non-focusable element until WhatsApp chat goes live. Swap back to an anchor
 * (href={whatsappLink(...)}) to re-enable.
 */
export function WhatsAppButton() {
  return (
    <div
      aria-hidden
      title="WhatsApp chat coming soon"
      className="fixed bottom-5 right-5 z-40 flex size-14 cursor-not-allowed items-center justify-center rounded-full bg-whatsapp/60 text-espresso/70 shadow-lg shadow-espresso/20"
    >
      <WhatsAppIcon className="size-7" />
    </div>
  );
}
