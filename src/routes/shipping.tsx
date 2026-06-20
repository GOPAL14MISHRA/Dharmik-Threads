import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping")({
  head: () => ({ meta: [{ title: "Shipping & Returns — Dharmik" }], links: [{ rel: "canonical", href: "/shipping" }] }),
  component: () => <Legal title="Shipping & Returns" body={[
    ["Domestic shipping", "Free across India on orders over ₹1,499. Flat ₹99 below that. Dispatch within 24–48 hours. Metro: 2–4 days. Rest of India: 4–7 days."],
    ["International shipping", "Available to 30+ countries. Calculated at checkout. 7–14 business days. Customs & duties payable by recipient."],
    ["Returns", "Unworn, unwashed garments with tags intact can be returned within 7 days of delivery. Initiate via your account or by emailing hello@dharmik.in. Refunds are processed within 5 business days of receipt."],
    ["Exchanges", "Free size exchanges within 7 days, subject to availability."],
    ["Damaged or wrong items", "Report within 48 hours of delivery with unboxing footage and we'll replace at our cost."],
  ]} />,
});

import { Legal } from "@/components/legal/Legal";
