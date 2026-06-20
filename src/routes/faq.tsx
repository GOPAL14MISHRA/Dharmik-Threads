import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "What size should I order?", a: "Our fits are designed oversized. If you usually wear M, stick with M for a relaxed oversized look, or size down for a regular oversized fit. Each product page has a detailed size guide." },
  { q: "When will I receive my order?", a: "We dispatch within 24–48 hours. Metro cities receive orders in 2–4 days; the rest of India in 4–7 days. International shipping takes 7–14 days." },
  { q: "How is shipping calculated?", a: "Free shipping across India on orders over ₹1,499. Below that, a flat ₹99 fee applies. International rates are shown at checkout." },
  { q: "What is your return policy?", a: "Unworn, unwashed products with tags intact can be returned within 7 days of delivery. Custom and sale items are final sale." },
  { q: "Do you offer Cash on Delivery?", a: "Yes, COD is available across India for orders under ₹5,000. A small ₹49 COD handling fee may apply." },
  { q: "How do I care for my Dharmik piece?", a: "Cold wash inside out, no bleach, tumble dry low. Iron on reverse side to preserve the print. Your piece will only get better with time." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [{ title: "FAQ — Dharmik" }],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }),
    }],
  }),
  component: FAQ,
});

function FAQ() {
  return (
    <div className="container-luxe py-20 md:py-28 max-w-3xl">
      <p className="eyebrow text-[color:var(--saffron)]">Questions</p>
      <h1 className="font-display text-5xl md:text-6xl mt-3">Frequently asked.</h1>
      <Accordion type="single" collapsible className="mt-12">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`q${i}`} className="border-b border-[color:var(--border)]">
            <AccordionTrigger className="text-left font-display text-xl md:text-2xl py-6 hover:no-underline hover:text-[color:var(--saffron)]">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-foreground/80 leading-relaxed pb-6">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
