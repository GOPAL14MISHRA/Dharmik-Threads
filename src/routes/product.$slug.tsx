import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Heart, Star, Truck, RefreshCw, Shield, Minus, Plus, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import { productService } from "@/services/productService";
import type { Product, ProductVariant, SizeOption } from "@/lib/types";
import { getDefaultImage, getBasePrice } from "@/lib/types";
import { inr } from "@/lib/format";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import { useUI } from "@/stores/ui";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/ProductCard";
import { ReviewMarquee, type ReviewItem } from "@/components/reviews/ReviewMarquee";

const EXTRA_REVIEWS: Omit<ReviewItem, "avatar">[] = [
  { name: "Devansh Rao", location: "Surat", rating: 5, title: "Devotion meets design", body: "The print quality is gallery-grade. Compliments every single time I wear it." },
  { name: "Tara Menon", location: "Chennai", rating: 5, title: "Felt sacred", body: "Unboxing felt like a ritual. Fabric is buttery, the cut is flattering." },
  { name: "Yash Patel", location: "Ahmedabad", rating: 4, title: "Premium and proud", body: "Thicker than expected in the best way. Holds shape after multiple washes." },
  { name: "Naina Gupta", location: "Kolkata", rating: 5, title: "My new favourite", body: "I wear it twice a week. The gold detailing is subtle but stunning under light." },
  { name: "Hari Krishnan", location: "Bengaluru", rating: 5, title: "Worth every rupee", body: "Finally apparel that respects the iconography it carries. Will buy again." },
  { name: "Zoya Khan", location: "Lucknow", rating: 5, title: "Beautifully done", body: "The colors stay rich, the stitching is clean. Highly recommend the larger size." },
];

const avatarFor = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `https://i.pravatar.cc/120?img=${(h % 70) + 1}`;
};

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await productService.getBySlug(params.slug);
    if (!product) throw notFound();
    const related = await productService.getRelated(params.slug);
    return { product, related };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.title} — Dharmik` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.title },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:type", content: "product" },
          { property: "og:image", content: getDefaultImage(loaderData.product) },
        ]
      : [],
  }),
  errorComponent: ({ error }) => <div className="container-luxe py-32">{error.message}</div>,
  notFoundComponent: () => <div className="container-luxe py-32 text-center">Product not found.</div>,
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  return <ProductView product={product} related={related} />;
}

function ProductView({ product, related }: { product: Product; related: Product[] }) {
  // ── Variant state ────────────────────────────────────────────────────────
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(product.variants[0]);
  const [activeSize, setActiveSize]       = useState<SizeOption>(
    product.variants[0]?.sizes[1] ?? product.variants[0]?.sizes[0]
  );
  const [qty, setQty]         = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [expanded, setExpanded]   = useState(false);
  const [tab, setTab]             = useState<"details" | "fabric" | "shipping">("details");

  const add       = useCart((s) => s.add);
  const openCart  = useUI((s) => s.setCartOpen);
  const wished    = useWishlist((s) => s.ids.includes(product.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const router    = useRouter();

  // Reset image index when variant changes
  useEffect(() => { setActiveImg(0); }, [activeVariant.variantId]);
  useEffect(() => { setActiveImg(0); setExpanded(false); }, [product.slug]);

  // When user picks a new colour, default to first available size of that variant
  function handleVariantChange(variant: ProductVariant) {
    setActiveVariant(variant);
    setActiveSize(variant.sizes[1] ?? variant.sizes[0]);
  }

  const categoryLabel    = useMemo(() => product.category.replace("-", " "), [product.category]);
  const collectionLabel  = useMemo(() => product.collection.replace("-", " "), [product.collection]);
  const currentImages    = activeVariant.images;
  const currentStock     = activeSize?.stock ?? 0;
  const isOutOfStock     = currentStock === 0;

  // ── Colour-based image filter / overlay ─────────────────────────────────
  const { filterStyle, overlayElement } = useMemo(() => {
    const name = activeVariant.color.name.toLowerCase();
    const hex  = activeVariant.color.hex;
    const isFirst = activeVariant.variantId === product.variants[0]?.variantId;

    let filterStyle = "";
    let overlayElement = null;

    if (!isFirst) {
      if (name.includes("black") || name.includes("charcoal") || name.includes("midnight")) {
        filterStyle = "brightness(0.35) contrast(1.1) grayscale(0.85)";
      } else if (name.includes("saffron") || name.includes("orange")) {
        filterStyle = "sepia(0.3) saturate(1.25) hue-rotate(-10deg)";
        overlayElement = (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-color opacity-55 transition-all duration-300"
            style={{ backgroundColor: hex }}
          />
        );
      } else {
        overlayElement = (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-color opacity-50 transition-all duration-300"
            style={{ backgroundColor: hex }}
          />
        );
      }
    }
    return { filterStyle, overlayElement };
  }, [activeVariant, product.variants]);

  return (
    <>
      {/* Breadcrumb */}
      <div className="container-luxe pt-6 md:pt-8">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <button onClick={() => router.navigate({ to: "/" })} className="hover:text-foreground transition-colors">Home</button>
          <ChevronRight className="size-3" />
          <button onClick={() => router.navigate({ to: "/shop" })} className="hover:text-foreground transition-colors">Shop</button>
          <ChevronRight className="size-3" />
          <span className="hover:text-foreground capitalize">{categoryLabel}</span>
          <ChevronRight className="size-3" />
          <span className="text-foreground capitalize truncate">{product.title}</span>
        </nav>
      </div>

      <section className="container-luxe py-8 md:py-12 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16">
        {/* ── Gallery ───────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-[80px_1fr] md:gap-6 md:items-start">
          {/* Desktop thumbnails */}
          <div className="hidden md:flex flex-col gap-3 md:order-1">
            {currentImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-[4/5] overflow-hidden border-2 transition-colors ${activeImg === i ? "border-[color:var(--saffron)]" : "border-transparent opacity-70 hover:opacity-100"}`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img} alt="" className="size-full object-cover" style={{ filter: filterStyle }} loading="lazy" />
                {overlayElement}
              </button>
            ))}
          </div>

          {/* Main image */}
          <motion.div
            key={`${activeVariant.variantId}-${activeImg}`}
            initial={{ opacity: 0.6, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-[420px] mx-auto aspect-[4/5] overflow-hidden bg-muted group rounded-sm md:order-2 md:max-w-none"
          >
            <img
              src={currentImages[activeImg]}
              alt={product.title}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: filterStyle }}
            />
            {overlayElement}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-black text-xs uppercase tracking-widest px-4 py-2 font-semibold">Out of Stock</span>
              </div>
            )}
          </motion.div>

          {/* Mobile thumbnails */}
          <div className="md:hidden w-full max-w-[420px] mx-auto grid grid-cols-4 gap-2 order-2">
            {currentImages.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square overflow-hidden border-2 transition-colors ${activeImg === i ? "border-[color:var(--saffron)]" : "border-transparent opacity-70 hover:opacity-100"}`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img} alt="" className="size-full object-cover" style={{ filter: filterStyle }} loading="lazy" />
                {overlayElement}
              </button>
            ))}
          </div>
        </div>

        {/* ── Details ───────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="capitalize">{categoryLabel}</span>
            <ChevronRight className="size-3" />
            <span className="capitalize">{collectionLabel}</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl mt-3 leading-[1.05]">{product.title}</h1>

          <p className="mt-3 text-sm text-muted-foreground">
            By <span className="text-foreground font-medium">{product.brand}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`size-4 ${i < Math.floor(product.rating) ? "fill-[color:var(--gold)] text-[color:var(--gold)]" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{product.rating} · {product.reviewCount} reviews</span>
          </div>

          {/* Price — from selected size */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl text-[color:var(--saffron)]">{inr(activeSize?.price ?? getBasePrice(product))}</span>
            {currentStock > 0 && currentStock <= 5 && (
              <span className="text-xs text-red-500 uppercase tracking-wider font-medium">Only {currentStock} left</span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">Inclusive of all taxes</p>

          {/* SKU */}
          {activeSize && (
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">SKU: {activeSize.sku}</p>
          )}

          {/* Description */}
          <div className="mt-6">
            <p className={`text-foreground/80 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
              {product.description}
            </p>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-xs uppercase tracking-[0.2em] underline underline-offset-4 hover:text-[color:var(--saffron)]"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          </div>

          {/* ── Colour selector ── */}
          {product.variants.length > 1 && (
            <div className="mt-7">
              <p className="text-[11px] uppercase tracking-[0.2em] mb-3">
                Colour · <span className="normal-case tracking-normal text-foreground">{activeVariant.color.name}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v) => (
                  <button
                    key={v.variantId}
                    onClick={() => handleVariantChange(v)}
                    aria-label={v.color.name}
                    title={v.color.name}
                    className={`size-9 rounded-full border-2 transition-all ${
                      activeVariant.variantId === v.variantId
                        ? "border-[color:var(--saffron)] scale-110 shadow-md"
                        : "border-[color:var(--border)] hover:scale-105"
                    }`}
                    style={{ backgroundColor: v.color.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Size selector ── */}
          <div className="mt-7">
            <p className="text-[11px] uppercase tracking-[0.2em] mb-3">
              Size: <span className="normal-case tracking-normal text-foreground font-medium">{activeSize?.size}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {activeVariant.sizes.map((s) => {
                const outOfStock = s.stock === 0;
                return (
                  <button
                    key={s.sku}
                    onClick={() => !outOfStock && setActiveSize(s)}
                    disabled={outOfStock}
                    className={`min-w-14 px-4 py-3 text-sm font-medium border transition-all relative ${
                      activeSize?.sku === s.sku
                        ? "bg-[color:var(--ink)] text-[color:var(--ivory)] border-[color:var(--ink)]"
                        : outOfStock
                        ? "border-[color:var(--border)] text-muted-foreground/40 cursor-not-allowed line-through"
                        : "border-[color:var(--border)] hover:border-[color:var(--ink)]"
                    }`}
                  >
                    {s.size}
                    {!outOfStock && s.stock <= 3 && (
                      <span className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-red-500" title={`${s.stock} left`} />
                    )}
                  </button>
                );
              })}
            </div>
            {/* Price changes per size if needed */}
            {activeVariant.sizes.some((s, i, arr) => s.price !== arr[0].price) && (
              <p className="mt-2 text-xs text-muted-foreground">* Price may vary by size</p>
            )}
          </div>

          {/* ── Qty + Add to bag + Wishlist ── */}
          <div className="mt-7 flex items-stretch gap-3">
            <div className="flex items-center border border-[color:var(--border)]">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="p-3 hover:bg-muted"><Minus className="size-4" /></button>
              <span className="px-4 w-12 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="p-3 hover:bg-muted"><Plus className="size-4" /></button>
            </div>
            <button
              onClick={() => {
                if (!isOutOfStock && activeSize) {
                  add(product, activeVariant, activeSize, qty);
                  openCart(true);
                  toast.success("Added to bag");
                }
              }}
              disabled={isOutOfStock || !activeSize}
              className="flex-1 bg-[color:var(--saffron)] text-white py-4 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[color:var(--ink)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOutOfStock ? "Out of Stock" : "Add to bag"}
            </button>
            <button
              onClick={() => toggleWish(product.id)}
              aria-label="Wishlist"
              className={`px-4 border ${wished ? "bg-[color:var(--saffron)] border-[color:var(--saffron)] text-white" : "border-[color:var(--border)] hover:border-foreground"}`}
            >
              <Heart className={`size-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Size guide + delivery */}
          <div className="mt-5 space-y-2">
            <button className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] underline underline-offset-4 hover:text-[color:var(--saffron)]">
              <Ruler className="size-4" /> Size guide
            </button>
            <p className="text-sm text-muted-foreground">
              Estimated delivery: <span className="text-foreground font-medium">3 – 6 days</span>
            </p>
          </div>

          {/* Accordion tabs */}
          <div className="mt-8 border-t border-[color:var(--border)]">
            {(["details", "fabric", "shipping"] as const).map((key) => {
              const label = key === "details" ? "Product details" : key === "fabric" ? "Fabric & care" : "Shipping & returns";
              return (
                <div key={key} className="border-b border-[color:var(--border)]">
                  <button
                    onClick={() => setTab(tab === key ? ("" as never) : key)}
                    className="w-full flex justify-between items-center py-4 text-xs uppercase tracking-[0.2em]"
                  >
                    {label}
                    <span className="text-lg leading-none">{tab === key ? "−" : "+"}</span>
                  </button>
                  {tab === key && (
                    <div className="pb-5 text-sm text-foreground/75 leading-relaxed">
                      {key === "details" && <p>{product.description}</p>}
                      {key === "fabric" && (
                        <ul className="space-y-1 list-disc pl-5">
                          <li>240 GSM premium ring-spun cotton</li>
                          <li>Pre-shrunk, garment-washed for softness</li>
                          <li>Machine wash cold, inside out · Do not bleach</li>
                        </ul>
                      )}
                      {key === "shipping" && (
                        <ul className="space-y-1 list-disc pl-5">
                          <li>Free shipping on orders over ₹1,499</li>
                          <li>Easy 7-day returns and exchanges</li>
                          <li>Razorpay · UPI · Cards · Cash on delivery</li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Perks */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {([
              [Truck, "Free shipping", "Over ₹1,499"],
              [RefreshCw, "Easy returns", "Within 7 days"],
              [Shield, "Secure checkout", "Razorpay · COD"],
            ] as const).map(([Icon, k, v], i) => (
              <div key={i} className="text-center">
                <Icon className="size-5 mx-auto text-[color:var(--saffron)]" />
                <p className="text-xs font-medium mt-2">{k}</p>
                <p className="text-[11px] text-muted-foreground">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 border-t border-[color:var(--border)]">
        <div className="container-luxe flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Reviews</h2>
            <p className="text-sm text-muted-foreground mt-1">{product.rating} · {product.reviewCount} verified buyers</p>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`size-4 ${i < Math.floor(product.rating) ? "fill-[color:var(--gold)] text-[color:var(--gold)]" : "text-muted"}`} />
            ))}
          </div>
        </div>
        <ReviewMarquee
          speedSec={60}
          reviews={[
            ...product.reviews.map((r) => ({
              name: r.user,
              avatar: avatarFor(r.user),
              rating: r.rating,
              title: r.title,
              body: r.body,
            })),
            ...EXTRA_REVIEWS.map((r) => ({ ...r, avatar: avatarFor(r.name) })),
          ]}
        />
      </section>

      {/* Related */}
      <section className="py-16 border-t border-[color:var(--border)]">
        <div className="container-luxe">
          <h2 className="font-display text-3xl md:text-4xl mb-8">You may also love</h2>
        </div>
        <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="flex gap-4 md:gap-6 w-max marquee group-hover:[animation-play-state:paused]" style={{ animationDuration: "60s" }}>
            {[...related, ...related].map((p, i) => (
              <div key={`${p.id}-${i}`} className="w-[220px] md:w-[280px] shrink-0">
                <ProductCard p={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
