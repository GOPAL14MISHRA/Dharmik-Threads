import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { productService } from "@/services/productService";
import type { Product } from "@/lib/types";
import { getBasePrice } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, collections } from "@/lib/data/products";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — Dharmik" },
      { name: "description", content: "Browse the full Dharmik collection — premium oversized tees, hoodies, sweatshirts, jackets, and caps." },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

function Shop() {
  const [items, setItems] = useState<Product[]>([]);
  const [cat, setCat] = useState<string>("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [col, setCol] = useState<string>("all");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    return productService.subscribeProducts(setItems);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [cat, col, sort]);

  const filtered = useMemo(() => {
    let list = items;
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (col !== "all") list = list.filter((p) => p.collection === col);
    if (sort === "low") list = [...list].sort((a, b) => getBasePrice(a) - getBasePrice(b));
    if (sort === "high") list = [...list].sort((a, b) => getBasePrice(b) - getBasePrice(a));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [items, cat, col, sort]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  
  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page, itemsPerPage]);

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
          <aside className="hidden lg:block space-y-8 lg:sticky lg:top-28 lg:self-start">
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
            <div className="flex justify-between items-center mb-6 border-b border-[color:var(--border)] pb-4 lg:border-none lg:pb-0">
              <p className="text-sm text-muted-foreground">{filtered.length} products</p>
              
              {/* Mobile filter button */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-[color:var(--border)] px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold hover:border-foreground transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="size-3 text-[color:var(--saffron)]" /> Filters
              </button>

              {totalPages > 1 && (
                <p className="text-xs text-muted-foreground hidden sm:block">Page {page} of {totalPages}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12">
              {paginated.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-[color:var(--border)]">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-[color:var(--border)] rounded hover:border-[color:var(--saffron)] disabled:opacity-30 disabled:hover:border-[color:var(--border)] transition-colors cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  const active = page === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`size-10 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                        active
                          ? "bg-[color:var(--saffron)] text-white"
                          : "border border-[color:var(--border)] hover:border-[color:var(--saffron)] text-foreground/80"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-[color:var(--border)] rounded hover:border-[color:var(--saffron)] disabled:opacity-30 disabled:hover:border-[color:var(--border)] transition-colors cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          />
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 z-[60] w-full max-w-[300px] bg-[#FAF9F5] text-stone-800 p-6 shadow-2xl overflow-y-auto flex flex-col justify-between lg:hidden animate-fade-in">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <h2 className="font-display text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 hover:text-[color:var(--saffron)] transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
              
              <div className="space-y-8 text-left">
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
                    className="w-full bg-transparent border-b border-stone-200 py-2 text-sm focus:outline-none focus:border-[color:var(--saffron)]"
                  >
                    <option value="featured">Featured</option>
                    <option value="low">Price · Low to High</option>
                    <option value="high">Price · High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-stone-200">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[color:var(--ink)] text-[color:var(--ivory)] py-3.5 text-xs uppercase tracking-[0.25em] font-medium hover:bg-[color:var(--saffron)] transition-colors rounded shadow cursor-pointer"
              >
                Apply ({filtered.length})
              </button>
            </div>
          </div>
        </>
      )}
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
