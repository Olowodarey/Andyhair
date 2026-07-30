import { SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

/** Floating WhatsApp button — opens a chat with the shop. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(`Hello ${SITE.name}! I'd like to make an order.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-whatsapp text-espresso shadow-lg shadow-espresso/20 transition hover:scale-105 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
