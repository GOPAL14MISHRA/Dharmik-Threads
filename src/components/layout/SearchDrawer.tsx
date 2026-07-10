import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useUI } from "@/stores/ui";
import { productService } from "@/services/productService";
import type { Product } from "@/lib/types";
import { getDefaultImage, getBasePrice } from "@/lib/types";
import { inr } from "@/lib/format";

export function SearchDrawer() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);
  const [query, setQuery] = useState("");
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      const unsubscribe = productService.subscribeProducts(setDbProducts);
      setTimeout(() => inputRef.current?.focus(), 50);
      return unsubscribe;
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return dbProducts
      .filter((p) => {
        const hay = [
          p.title,
          p.description,
          p.category,
          p.collection,
          ...(p.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
  }, [query, dbProducts]);

  const trending = ["Mahadev", "Krishna", "Hoodies", "Hanuman", "Posters"];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div className="relative bg-[color:var(--ivory)] shadow-2xl animate-fade-in">
        <div className="container-luxe py-5">
          <div className="flex items-center gap-3 border-b border-[color:var(--border)] pb-3">
            <Search className="size-5 text-foreground/60" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the Dharma collection…"
              className="flex-1 bg-transparent text-lg md:text-xl outline-none placeholder:text-foreground/40"
              aria-label="Search products"
            />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close search"
              className="p-2 hover:text-[color:var(--saffron)] transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mt-6 max-h-[60vh] overflow-y-auto">
            {!query.trim() && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/50 mb-3">
                  Trending
                </p>
                <div className="flex flex-wrap gap-2">
                  {trending.map((t) => (
                    <button
                      key={t}
                      onClick={() => setQuery(t)}
                      className="px-3 py-1.5 text-sm border border-[color:var(--border)] rounded-full hover:border-[color:var(--saffron)] hover:text-[color:var(--saffron)] transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <p className="text-sm text-foreground/60 py-6 text-center">
                No products match “{query}”.
              </p>
            )}

            {results.length > 0 && (
              <ul className="grid gap-2">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4 p-2 rounded-md hover:bg-black/5 transition-colors"
                    >
                      <img
                        src={getDefaultImage(p)}
                        alt={p.title}
                        className="size-14 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{p.title}</p>
                        <p className="text-xs text-foreground/60 capitalize">
                          {p.category} · {p.collection}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        {inr(getBasePrice(p))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
