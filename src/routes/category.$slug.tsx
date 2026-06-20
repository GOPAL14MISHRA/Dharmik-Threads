import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import type { Product, Category } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { categories } from "@/lib/data/products";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    return {
      meta: [
        { title: `${cat?.name ?? "Category"} — Dharmik` },
        { name: "description", content: `Shop the ${cat?.name ?? ""} collection at Dharmik.` },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = categories.find((c) => c.slug === slug);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    productService.getProducts({ category: slug as Category }).then(setItems);
  }, [slug]);

  return (
    <>
      <section className="bg-[color:var(--ink)] text-[color:var(--ivory)] py-16 md:py-24">
        <div className="container-luxe">
          <p className="eyebrow text-[color:var(--gold)]">Category</p>
          <h1 className="font-display text-5xl md:text-7xl mt-3">{cat?.name ?? slug}</h1>
        </div>
      </section>
      <div className="container-luxe py-14 grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12">
        {items.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        {items.length === 0 && <p className="col-span-full text-center text-muted-foreground py-20">No products yet in this category.</p>}
      </div>
    </>
  );
}
