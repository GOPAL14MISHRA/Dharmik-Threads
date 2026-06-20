import { createFileRoute, Link } from "@tanstack/react-router";
import { collections } from "@/lib/data/products";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Dharmik" },
      { name: "description", content: "Explore all Dharmik capsule collections devoted to Hindu gods, Sanskrit script and temple architecture." },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: AllCollections,
});

function AllCollections() {
  return (
    <>
      <section className="container-luxe py-20 md:py-28 text-center">
        <p className="eyebrow text-[color:var(--saffron)]">Capsules</p>
        <h1 className="font-display text-5xl md:text-7xl mt-3">All collections.</h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Seven worlds, one eternal dharma.</p>
      </section>
      <div className="container-luxe pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {collections.map((c) => (
          <Link
            key={c.slug}
            to="/collection/$slug"
            params={{ slug: c.slug }}
            className="group relative aspect-[4/5] overflow-hidden bg-muted"
          >
            <img src={c.image} alt={c.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold)]">{c.tagline}</p>
              <p className="font-display text-3xl mt-1">{c.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
