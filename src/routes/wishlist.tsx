import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useWishlist } from "@/stores/wishlist";
import { productService } from "@/services/productService";
import { authService } from "@/services/authService";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Dharmik" }] }),
  beforeLoad: async () => {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw redirect({ to: "/account", replace: true });
    }
  },
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    productService.getProducts().then((all) => setItems(all.filter((p) => ids.includes(p.id))));
  }, [ids]);

  return (
    <div className="container-luxe py-16 md:py-24">
      <p className="eyebrow text-[color:var(--saffron)]">Saved for later</p>
      <h1 className="font-display text-5xl md:text-6xl mt-3">Your wishlist.</h1>
      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted-foreground">Nothing saved yet.</p>
          <Link to="/shop" className="inline-block mt-6 bg-[color:var(--ink)] text-[color:var(--ivory)] px-8 py-3 text-xs uppercase tracking-[0.25em]">Explore shop</Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12">
          {items.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
