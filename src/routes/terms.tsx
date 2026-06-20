import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/legal/Legal";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — Dharmik" }], links: [{ rel: "canonical", href: "/terms" }] }),
  component: () => <Legal title="Terms of Service" body={[
    ["Acceptance", "By using dharmik.in you agree to these terms. If you do not agree, please do not use the site."],
    ["Orders", "All orders are subject to availability. We reserve the right to cancel any order with a full refund."],
    ["Pricing", "All prices in INR, inclusive of GST. We may correct pricing errors before dispatch."],
    ["Intellectual property", "All artwork, prints, photography and copy are the property of Dharmik and may not be reproduced."],
    ["Governing law", "These terms are governed by the laws of India. Jurisdiction: Mumbai."],
  ]} />,
});
