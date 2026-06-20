import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import type { Product, Collection } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { collections } from "@/lib/data/products";

export const Route = createFileRoute("/collection/$slug")({
  head: ({ params }) => {
    const col = collections.find((c) => c.slug === params.slug);
    return {
      meta: [
        { title: `${col?.name ?? "Collection"} Collection — Dharmik` },
        { name: "description", content: `${col?.tagline ?? ""} — Explore the ${col?.name ?? ""} collection.` },
      ],
      links: [{ rel: "canonical", href: `/collection/${params.slug}` }],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const col = collections.find((c) => c.slug === slug);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    productService.getProducts({ collection: slug as Collection }).then(setItems);
  }, [slug]);

  return (
    <>
      <section className="relative bg-[color:var(--ink)] text-[color:var(--ivory)] overflow-hidden">
        {col && <img src={col.image} alt="" className="absolute inset-0 size-full object-cover opacity-30" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--ink)] via-[color:var(--ink)]/80 to-transparent" />
        <div className="container-luxe relative py-24 md:py-36">
          <p className="eyebrow text-[color:var(--gold)]">{col?.tagline}</p>
          <h1 className="font-display text-6xl md:text-8xl mt-4">{col?.name ?? slug}</h1>
          <p className="mt-4 text-white/60 max-w-xl">A capsule devoted to the spirit, art and craft of {col?.name}.</p>
        </div>
      </section>
      <div className="container-luxe py-14 grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12">
        {items.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        {items.length === 0 && <p className="col-span-full text-center text-muted-foreground py-20">More from this collection coming soon.</p>}
      </div>
    </>
  );
}
