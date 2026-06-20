import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Twitter } from "lucide-react";
import { useState } from "react";
import { userService } from "@/services/userService";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await userService.subscribeNewsletter(email);
    setLoading(false);
    setEmail("");
    toast.success("Welcome to the Dharma Community.");
  }

  const cols = [
    {
      title: "Shop",
      links: [
        { to: "/shop", label: "All Products" },
        { to: "/collections", label: "Collections" },
        { to: "/category/tshirts", label: "Oversized Tees" },
        { to: "/category/hoodies", label: "Hoodies" },
        { to: "/category/wall-art", label: "Wall Art" },
      ],
    },
    {
      title: "Help",
      links: [
        { to: "/track", label: "Track Order" },
        { to: "/shipping", label: "Shipping & Returns" },
        { to: "/faq", label: "FAQ" },
        { to: "/contact", label: "Contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { to: "/story", label: "Our Story" },
        { to: "/journal", label: "Journal" },
        { to: "/privacy", label: "Privacy Policy" },
        { to: "/terms", label: "Terms of Service" },
      ],
    },
  ] as const;

  return (
    <footer className="bg-[color:var(--ink)] text-[color:var(--ivory)] mt-32">
      <div className="container-luxe py-20">
        {/* Newsletter */}
        <div className="grid lg:grid-cols-2 gap-12 pb-16 border-b border-white/10">
          <div>
            <p className="eyebrow text-[color:var(--gold)]">Join the dharma community</p>
            <h3 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">
              Drops, stories &amp; sacred craft<br />
              <span className="text-gradient-gold">delivered with intention.</span>
            </h3>
          </div>
          <form onSubmit={onSubscribe} className="flex flex-col justify-end gap-3">
            <div className="flex border-b border-white/30 focus-within:border-[color:var(--saffron)] transition-colors">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                className="flex-1 bg-transparent py-3 outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={loading}
                className="uppercase tracking-[0.2em] text-xs font-semibold px-2 hover:text-[color:var(--saffron)] transition-colors"
              >
                {loading ? "..." : "Subscribe →"}
              </button>
            </div>
            <p className="text-xs text-white/50">We respect your inbox. Unsubscribe anytime.</p>
          </form>
        </div>

        {/* Nav */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 py-16">
          <div className="col-span-2">
            <p className="font-display text-3xl">Dharmik<span className="text-[color:var(--saffron)]">.</span></p>
            <p className="mt-4 text-sm text-white/60 max-w-sm leading-relaxed">
              A heritage streetwear house preserving Sanatan culture through modern, premium craft.
              Made in India, worn worldwide.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Youtube, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="size-10 grid place-items-center rounded-full border border-white/15 hover:bg-[color:var(--saffron)] hover:border-[color:var(--saffron)] transition-colors"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="eyebrow text-[color:var(--gold)]">{c.title}</p>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-[color:var(--saffron)] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} Dharmik. Crafted with reverence in Bharat.</p>
          <p className="font-devanagari tracking-wider text-[color:var(--gold)]">
            ॥ सर्वे भवन्तु सुखिनः ॥
          </p>
        </div>
      </div>
    </footer>
  );
}
