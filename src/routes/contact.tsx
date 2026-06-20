import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ title: "Contact — Dharmik" }],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  function send(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    toast.success("Message received. We'll respond within 24 hours.");
  }
  return (
    <div className="container-luxe py-20 md:py-28 grid lg:grid-cols-2 gap-16">
      <div>
        <p className="eyebrow text-[color:var(--saffron)]">Reach out</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">Let's talk.</h1>
        <p className="text-muted-foreground mt-5 max-w-md">
          Questions, collaborations, custom work — we read every message ourselves.
        </p>
        <div className="mt-12 space-y-6">
          {([
            [Mail, "Email", "hello@dharmik.in"],
            [Phone, "Phone", "+91 98765 43210"],
            [MapPin, "Studio", "Bandra West, Mumbai 400050"],
          ] as const).map(([Icon, k, v], i) => (
            <div key={i} className="flex gap-4 items-start">
              <Icon className="size-5 text-[color:var(--saffron)] mt-1" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{k}</p>
                <p className="font-display text-xl">{v}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={send} className="space-y-5">
        {sent ? (
          <div className="border border-[color:var(--saffron)] p-10 text-center">
            <p className="font-display text-3xl">Namaste.</p>
            <p className="text-muted-foreground mt-3">Your message reached us. Expect a reply within 24 hours.</p>
          </div>
        ) : (
          <>
            <Input label="Name" />
            <Input label="Email" type="email" />
            <Input label="Subject" />
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Message</span>
              <textarea required rows={5} className="mt-1 w-full bg-transparent border-b border-[color:var(--border)] py-2 focus:outline-none focus:border-[color:var(--saffron)] resize-none" />
            </label>
            <button className="w-full bg-[color:var(--ink)] text-[color:var(--ivory)] py-4 text-xs uppercase tracking-[0.25em] hover:bg-[color:var(--saffron)] transition-colors">
              Send message
            </button>
          </>
        )}
      </form>
    </div>
  );
}

function Input({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input required type={type} className="mt-1 w-full bg-transparent border-b border-[color:var(--border)] py-2.5 focus:outline-none focus:border-[color:var(--saffron)]" />
    </label>
  );
}
