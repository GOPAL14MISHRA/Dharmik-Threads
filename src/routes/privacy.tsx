import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/legal/Legal";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Dharmik" }], links: [{ rel: "canonical", href: "/privacy" }] }),
  component: () => <Legal title="Privacy Policy" body={[
    ["What we collect", "Name, email, shipping address, phone, and order history. Payment info is handled by Razorpay; we never see card numbers."],
    ["How we use it", "To fulfill orders, send transactional updates, and (if you opt in) share new drops."],
    ["Sharing", "We share with logistics partners (Delhivery, Bluedart), Razorpay for payments, and analytics providers — never anyone else."],
    ["Your rights", "Email hello@dharmik.in to access, correct, or delete your data."],
    ["Cookies", "Used only for cart persistence and basic analytics."],
  ]} />,
});
