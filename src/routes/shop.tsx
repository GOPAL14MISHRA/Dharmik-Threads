import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { productService } from "@/services/productService";
import type { Product } from "@/lib/types";
import { getBasePrice } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, collections } from "@/lib/data/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — Dharmik" },
      { name: "description", content: "Browse the full Dharmik collection — premium oversized tees, hoodies, sweatshirts, jackets, caps and wall art." },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

function Shop() {
  const [items, setItems] = useState<Product[]>([]);
  const [cat, setCat] = useState<string>("all");
  const [col, setCol] = useState<string>("all");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    productService.getProducts().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (col !== "all") list = list.filter((p) => p.collection === col);
    if (sort === "low") list = [...list].sort((a, b) => getBasePrice(a) - getBasePrice(b));
    if (sort === "high") list = [...list].sort((a, b) => getBasePrice(b) - getBasePrice(a));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [items, cat, col, sort]);

  return (
    <>
      <section className="bg-[color:var(--ink)] text-[color:var(--ivory)] py-16 md:py-24">
        <div className="container-luxe">
          <p className="eyebrow text-[color:var(--gold)]">The full archive</p>
          <h1 className="font-display text-5xl md:text-7xl mt-3">Shop all.</h1>
          <p className="mt-4 text-white/60 max-w-xl">
            Every piece, every collection. Handcrafted apparel and art rooted in Sanatan dharma.
          </p>
        </div>
      </section>

      <div className="container-luxe py-10 md:py-14">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          {/* Filters */}
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <FilterGroup
              title="Category"
              options={[{ slug: "all", name: "All" }, ...categories]}
              value={cat}
              onChange={setCat}
            />
            <FilterGroup
              title="Collection"
              options={[{ slug: "all", name: "All" }, ...collections.map((c) => ({ slug: c.slug, name: c.name }))]}
              value={col}
              onChange={setCol}
            />
            <div>
              <p className="eyebrow mb-4">Sort</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-transparent border-b border-[color:var(--border)] py-2 text-sm focus:outline-none focus:border-[color:var(--saffron)]"
              >
                <option value="featured">Featured</option>
                <option value="low">Price · Low to High</option>
                <option value="high">Price · High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </aside>

          <div>
            <p className="text-sm text-muted-foreground mb-6">{filtered.length} products</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly { slug: string; name: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-2.5">
        {options.map((o) => (
          <li key={o.slug}>
            <button
              onClick={() => onChange(o.slug)}
              className={`text-sm transition-colors ${
                value === o.slug ? "text-[color:var(--saffron)] font-medium" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {o.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
