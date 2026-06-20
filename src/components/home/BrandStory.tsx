import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import hero2 from "@/assets/hero-2.jpg";

export function BrandStory() {
  return (
    <section className="container-luxe py-24 md:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[4/5] overflow-hidden"
      >
        <img src={hero2} alt="Brand story" loading="lazy" className="size-full object-cover" />
        <div className="absolute -bottom-8 -right-8 w-40 h-40 hidden md:grid place-items-center bg-[color:var(--saffron)] text-white">
          <div className="text-center">
            <p className="font-display text-5xl leading-none">04</p>
            <p className="text-[10px] uppercase tracking-[0.2em] mt-2">Drops a year</p>
          </div>
        </div>
      </motion.div>

      <div>
        <p className="eyebrow text-[color:var(--saffron)]">Our promise</p>
        <h2 className="font-display text-4xl md:text-6xl mt-4 leading-[1]">
          Heritage,<br />
          worn <span className="italic">forward.</span>
        </h2>
        <div className="mt-8 space-y-5 text-foreground/80 leading-relaxed max-w-lg">
          <p>
            Dharmik began with a question: what if the world's oldest living culture
            were translated into the language of streetwear we wear every day?
          </p>
          <p>
            Every print is hand-illustrated by Indian artists. Every garment is woven
            from heavyweight cotton, garment-dyed, and built to outlast a decade of wear.
            We are not fast fashion. We are an offering.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 max-w-md">
          {[
            ["Hand-illustrated", "By Indian artists"],
            ["240+ GSM cotton", "Heavyweight craft"],
            ["Small batches", "Made to last"],
            ["100% in India", "Mumbai · Tirupur"],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-[color:var(--border)] pt-3">
              <p className="font-display text-lg">{k}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{v}</p>
            </div>
          ))}
        </div>

        <Link
          to="/story"
          className="inline-flex items-center gap-3 mt-10 text-xs uppercase tracking-[0.25em] font-medium border-b border-foreground pb-1 hover:text-[color:var(--saffron)] hover:border-[color:var(--saffron)]"
        >
          Read our manifesto →
        </Link>
      </div>
    </section>
  );
}
