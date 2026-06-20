import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import hero1 from "@/assets/hero-1.jpg";
import texture from "@/assets/texture-mandala.jpg";

export function Hero() {
  return (
    <section className="relative bg-[color:var(--ink)] text-[color:var(--ivory)] overflow-hidden">
      <img
        src={texture}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover opacity-[0.08] mix-blend-screen"
      />

      <div className="container-luxe relative grid lg:grid-cols-12 gap-10 lg:gap-6 pt-12 lg:pt-20 pb-16 lg:pb-24 min-h-[min(92dvh,900px)]">
        {/* Copy */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow text-[color:var(--gold)] flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[color:var(--gold)]" />
            Drop 04 · Sanatan Heritage
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.9] mt-6 tracking-tight"
          >
            Wear<br />
            Your <span className="italic text-gradient-gold">Dharma.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-7 max-w-md text-base md:text-lg text-white/70 leading-relaxed"
          >
            Modern streetwear inspired by the timeless craft of Sanatan heritage —
            hand-illustrated, heavyweight, and made to be lived in.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row gap-3"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center justify-center gap-3 bg-[color:var(--saffron)] text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-[color:var(--saffron-glow)] transition-colors"
            >
              Shop Collection
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/collections"
              className="inline-flex items-center justify-center gap-3 border border-white/25 text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-white hover:text-[color:var(--ink)] transition-colors"
            >
              Explore New Arrivals
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              ["240+ GSM", "Heavyweight craft"],
              ["50,000+", "Devotees worldwide"],
              ["4.9★", "12k+ reviews"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="font-display text-2xl text-[color:var(--gold)]">{k}</p>
                <p className="text-[11px] uppercase tracking-widest text-white/50 mt-1">{v}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Image */}
        <div className="lg:col-span-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] lg:aspect-auto lg:h-full overflow-hidden"
          >
            <img
              src={hero1}
              alt="Model wearing the Mahadev oversized tee"
              width={1080}
              height={1920}
              fetchPriority="high"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)] via-transparent to-transparent lg:hidden" />

            {/* floating tag */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:max-w-xs bg-[color:var(--ivory)]/95 backdrop-blur text-foreground p-5 shadow-luxe"
            >
              <p className="eyebrow text-[color:var(--saffron)]">Featured Drop</p>
              <p className="font-display text-xl mt-1.5">Mahadev Trishul Tee</p>
              <p className="text-xs text-muted-foreground mt-1">240 GSM · Ivory · Hand-illustrated</p>
              <Link
                to="/product/$slug"
                params={{ slug: "mahadev-trishul-tee" }}
                className="inline-flex items-center gap-2 mt-3 text-xs uppercase tracking-[0.2em] font-medium hover:text-[color:var(--saffron)]"
              >
                Shop · ₹1,499 →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
