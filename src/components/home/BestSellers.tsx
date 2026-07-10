import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Link } from "@tanstack/react-router";

export function BestSellers() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    return productService.subscribeBestSellers(setItems);
  }, []);

  return (
    <section className="container-luxe py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <p className="eyebrow text-[color:var(--saffron)]">Most loved</p>
          <h2 className="font-display text-4xl md:text-6xl mt-3 tracking-tight">Best sellers.</h2>
          <p className="text-muted-foreground mt-3 max-w-md">
            The pieces our community keeps coming back to — heavyweight, intentional, eternal.
          </p>
        </div>
        <Link to="/shop" className="text-xs uppercase tracking-[0.2em] hover:text-[color:var(--saffron)]">
          Shop all →
        </Link>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="flex flex-row flex-nowrap gap-6 w-max marquee hover:[animation-play-state:paused] py-4">
          {[...items, ...items].map((p, i) => (
            <div key={p.id + "-" + i} className="w-[260px] md:w-[300px] shrink-0">
              <ProductCard p={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
