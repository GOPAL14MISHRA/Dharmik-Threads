import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:var(--ivory)] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle decorative frame */}
          <div className="fixed inset-6 md:inset-8 border border-[color:var(--border)]/40 pointer-events-none" />

          {/* Background aura glow */}
          <motion.div
            className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full bg-[color:var(--saffron)]/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          />

          {/* Logo container */}
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.88, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Icon with animated ring */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 mb-8 flex items-center justify-center">
              {/* Animated SVG ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  className="text-[color:var(--saffron)]/50"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                />
              </svg>

              {/* Inner subtle ring */}
              <motion.div
                className="absolute inset-3 rounded-full border border-[color:var(--saffron)]/15"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              />

              {/* Logo SVG */}
              <motion.svg
                width="40"
                height="40"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
              >
                <circle
                  cx="16"
                  cy="16"
                  r="15"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <path
                  d="M16 6 L16 26 M9 11 Q16 16 23 11 M9 21 Q16 16 23 21"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <circle cx="16" cy="16" r="2" fill="var(--saffron)" />
              </motion.svg>
            </div>

            {/* Wordmark */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            >
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-[0.2em] text-[color:var(--ink)]">
                Dharmik
                <span className="text-[color:var(--saffron)]">.</span>
              </h1>
              <motion.div
                className="mt-4 h-px w-10 bg-[color:var(--saffron)]/50 mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              />
              <motion.p
                className="mt-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                Wear Your Dharma
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
