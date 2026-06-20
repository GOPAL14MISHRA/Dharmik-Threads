import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { collections } from "@/lib/data/products";
import hero2 from "@/assets/hero-2.jpg";

export function CollectionShowcase() {
  return (
    <section className="bg-[color:var(--ink)] text-[color:var(--ivory)] py-24 md:py-32">
      <div className="container-luxe">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="eyebrow text-[color:var(--gold)]">Curated worlds</p>
            <h2 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95]">
              Seven collections.<br />
              <span className="italic text-gradient-gold">One eternal dharma.</span>
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed max-w-md">
              Each capsule is a meditation — an offering to a god, a verse, an idea.
              Designed in Mumbai, printed in small batches, built to be inherited.
            </p>
            <motion.img
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              src={hero2}
              alt=""
              aria-hidden
              className="mt-10 aspect-[4/3] object-cover w-full hidden lg:block"
              loading="lazy"
            />
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {collections.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.08 }}
                className={`group relative aspect-[4/5] overflow-hidden bg-white/5 ${i % 3 === 0 ? "sm:translate-y-10" : ""}`}
              >
                <Link to="/collection/$slug" params={{ slug: c.slug }} className="block size-full">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="size-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold)]">{c.tagline}</p>
                    <p className="font-display text-2xl md:text-3xl mt-2">{c.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mt-3 inline-flex items-center gap-2">
                      Enter collection <span className="transition-transform group-hover:translate-x-1">→</span>
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
