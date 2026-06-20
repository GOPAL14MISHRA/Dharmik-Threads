import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import shiva from "@/assets/product-shiva.jpg";
import krishna from "@/assets/product-krishna.jpg";
import hanuman from "@/assets/product-hanuman.jpg";
import ram from "@/assets/product-ram.jpg";
import cap from "@/assets/product-cap.jpg";
import poster from "@/assets/product-poster.jpg";

const items = [
  { slug: "tshirts", name: "Oversized Tees", image: shiva, span: "md:col-span-2 md:row-span-2" },
  { slug: "hoodies", name: "Hoodies", image: krishna, span: "" },
  { slug: "sweatshirts", name: "Sweatshirts", image: hanuman, span: "" },
  { slug: "jackets", name: "Jackets", image: ram, span: "" },
  { slug: "caps", name: "Caps", image: cap, span: "" },
  { slug: "wall-art", name: "Wall Art", image: poster, span: "md:col-span-2" },
];

export function CategoryGrid() {
  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="eyebrow text-[color:var(--saffron)]">Shop by category</p>
          <h2 className="font-display text-4xl md:text-6xl mt-3 tracking-tight">
            Crafted categories.
          </h2>
        </div>
        <Link to="/shop" className="text-xs uppercase tracking-[0.2em] hover:text-[color:var(--saffron)] inline-flex items-center gap-2">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 md:auto-rows-[260px]">
        {items.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.05 }}
            className={`relative group overflow-hidden bg-muted ${c.span}`}
          >
            <Link to="/category/$slug" params={{ slug: c.slug }} className="block size-full">
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-white">
                <p className="font-display text-xl md:text-3xl">{c.name}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mt-1 inline-flex items-center gap-2">
                  Shop now <span className="transition-transform group-hover:translate-x-1">→</span>
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
