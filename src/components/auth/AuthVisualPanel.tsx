import { motion } from "framer-motion";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import shiva from "@/assets/product-shiva.jpg";
import hanuman from "@/assets/product-hanuman.jpg";
import krishna from "@/assets/product-krishna.jpg";
import texture from "@/assets/texture-mandala.jpg";

const FLOATING_PIECES = [
  { src: shiva, label: "Mahadev", delay: 0 },
  { src: hanuman, label: "Hanuman", delay: 0.15 },
  { src: krishna, label: "Krishna", delay: 0.3 },
];

export function AuthVisualPanel() {
  return (
    <div className="relative z-10 hidden lg:flex flex-1 items-center justify-center min-h-[520px] max-w-xl">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full aspect-[4/5] max-h-[620px] overflow-hidden rounded-3xl border border-[color:var(--border)] shadow-luxe"
      >
        {/* Ken Burns hero image */}
        <motion.img
          src={hero1}
          alt="Dharmik heritage streetwear collection"
          className="absolute inset-0 size-full object-cover"
          animate={{ scale: [1, 1.08] }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Secondary image crossfade layer */}
        <motion.img
          src={hero2}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover mix-blend-soft-light opacity-30"
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Mandala texture overlay */}
        <img
          src={texture}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-[0.12] mix-blend-overlay pointer-events-none"
        />

        {/* Brand gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)]/90 via-[color:var(--ink)]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--saffron)]/10 via-transparent to-[color:var(--gold)]/5" />

        {/* Rotating saffron ring */}
        <motion.div
          className="absolute top-8 right-8 size-20 rounded-full border border-[color:var(--saffron)]/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, ease: "linear", repeat: Infinity }}
        >
          <div className="absolute inset-2 rounded-full border border-dashed border-[color:var(--gold)]/40" />
        </motion.div>

        {/* Floating product cards */}
        {FLOATING_PIECES.map(({ src, label, delay }, i) => (
          <motion.div
            key={label}
            className="absolute size-16 overflow-hidden rounded-lg border border-white/20 shadow-lg"
            style={{
              top: `${18 + i * 22}%`,
              left: i % 2 === 0 ? "-8px" : "auto",
              right: i % 2 === 1 ? "-8px" : "auto",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.4 + delay },
              y: { duration: 4 + i, ease: "easeInOut", repeat: Infinity, delay: delay * 2 },
            }}
          >
            <img src={src} alt={label} className="size-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-[color:var(--ink)]/70 px-1.5 py-0.5">
              <p className="text-[8px] uppercase tracking-widest text-white/80 text-center truncate">{label}</p>
            </div>
          </motion.div>
        ))}

        {/* Brand copy */}
        <div className="absolute inset-x-0 bottom-0 p-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="eyebrow text-[color:var(--gold)] flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[color:var(--gold)]" />
            Sanatan Heritage
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-display text-4xl xl:text-5xl mt-3 text-[color:var(--ivory)] leading-[1.05]"
          >
            Wear Your <span className="italic text-gradient-gold">Dharma.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-3 text-sm text-white/60 max-w-xs leading-relaxed"
          >
            Hand-illustrated tees &amp; sacred streetwear — crafted with intention for the modern devotee.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-6 flex gap-6"
          >
            {[
              ["240+ GSM", "Heavyweight"],
              ["4.9★", "12k reviews"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="font-display text-xl text-[color:var(--gold)]">{k}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/45 mt-0.5">{v}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
