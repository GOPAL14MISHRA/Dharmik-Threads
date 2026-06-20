import { Link } from "@tanstack/react-router";
import { Heart, Star, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Product } from "@/lib/types";
import { getDefaultImage, getBasePrice, getMaxPrice } from "@/lib/types";
import { inr } from "@/lib/format";
import { useWishlist } from "@/stores/wishlist";
import { useCart } from "@/stores/cart";
import { useUI } from "@/stores/ui";
import { toast } from "sonner";

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const wished = useWishlist((s) => s.ids.includes(p.id));
  const toggle = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.setCartOpen);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [playing, setPlaying] = useState(false);

  const startReel = () => {
    setPlaying(true);
    if (tlRef.current) {
      tlRef.current.restart();
      return;
    }
    const img = imgRef.current;
    const stage = stageRef.current;
    if (!img || !stage) return;

    gsap.set(stage, { perspective: 1200 });
    gsap.set(img, { transformOrigin: "50% 50%", transformStyle: "preserve-3d" });

    // Animate the SAME image as if viewing the product from different angles:
    // subtle 3D yaw + slight zoom + horizontal pan, looping smoothly.
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: "sine.inOut", duration: 1.8 },
    });
    tl.fromTo(
      img,
      { rotateY: -14, rotateX: 2, scale: 1.08, xPercent: -3 },
      { rotateY: 14, rotateX: -2, scale: 1.12, xPercent: 3 }
    );
    tlRef.current = tl;
  };

  const stopReel = () => {
    setPlaying(false);
    tlRef.current?.pause(0);
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        xPercent: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  useEffect(() => () => { tlRef.current?.kill(); }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
      onMouseEnter={startReel}
      onMouseLeave={stopReel}
    >
      <Link to="/product/$slug" params={{ slug: p.slug }} className="block">
        <div ref={stageRef} className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img
            ref={imgRef}
            src={getDefaultImage(p)}
            alt={p.title}
            loading="lazy"
            width={800}
            height={1000}
            className="absolute inset-0 size-full object-cover will-change-transform"
          />

          {/* 360 indicator */}
          <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-2 py-1 transition-opacity duration-300 ${playing ? "opacity-100" : "opacity-0"}`}>
            <RotateCw className="size-2.5" />
            <span>360° View</span>
          </div>

          {/* badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {p.isNew && <span className="bg-[color:var(--ink)] text-[color:var(--ivory)] text-[10px] uppercase tracking-widest px-2 py-1">New</span>}
            {p.isBestSeller && <span className="bg-[color:var(--gold)] text-white text-[10px] uppercase tracking-widest px-2 py-1">Bestseller</span>}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(p.id);
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 size-9 grid place-items-center bg-white/85 backdrop-blur rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`size-4 ${wished ? "fill-[color:var(--saffron)] text-[color:var(--saffron)]" : ""}`} />
          </button>

          {/* quick add */}
          <button
            onClick={(e) => {
              e.preventDefault();
              const firstVariant = p.variants[0];
              const firstSize = firstVariant?.sizes[1] ?? firstVariant?.sizes[0];
              if (firstVariant && firstSize) {
                add(p, firstVariant, firstSize, 1);
                openCart(true);
                toast.success("Added to bag");
              }
            }}
            className="absolute inset-x-3 bottom-3 bg-[color:var(--ink)] text-[color:var(--ivory)] text-[11px] uppercase tracking-[0.2em] py-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[color:var(--saffron)]"
          >
            Quick Add
          </button>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Star className="size-3 fill-[color:var(--gold)] text-[color:var(--gold)]" />
            <span>{p.rating.toFixed(1)}</span>
            <span>·</span>
            <span>{p.reviewCount} reviews</span>
          </div>
          <h3 className="font-medium text-[15px] leading-snug">{p.title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold">{inr(getBasePrice(p))}</span>
            {getMaxPrice(p) > getBasePrice(p) && (
              <span className="text-xs text-muted-foreground">– {inr(getMaxPrice(p))}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
