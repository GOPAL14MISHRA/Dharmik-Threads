import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Tag, ArrowRight, Flame, Feather, Paintbrush, Landmark, Shirt, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import poster from "@/assets/product-poster.jpg";
import krishna from "@/assets/product-krishna.jpg";
import shiva from "@/assets/product-shiva.jpg";
import hanuman from "@/assets/product-hanuman.jpg";
import ram from "@/assets/product-ram.jpg";
import cap from "@/assets/product-cap.jpg";

const IMG_MAP: Record<string, string> = {
  hero1,
  hero2,
  poster,
  krishna,
  shiva,
  hanuman,
  ram,
  cap,
};

const CATEGORIES = [
  { slug: "all", label: "All Posts", icon: BookOpen },
  { slug: "culture", label: "Culture", icon: Flame },
  { slug: "craft", label: "Craft", icon: Paintbrush },
  { slug: "heritage", label: "Heritage", icon: Landmark },
  { slug: "process", label: "Process", icon: Feather },
  { slug: "style", label: "Style", icon: Shirt },
];

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Blog — Dharmik" },
      {
        name: "description",
        content:
          "Stories, craft, heritage, and style from the Dharmik universe. Explore our world of sacred apparel and Indian culture.",
      },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
  component: Blog,
});

function Blog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featured = BLOG_POSTS.find((p) => p.featured)!;
  const featuredImg = IMG_MAP[featured.imgKey] ?? hero1;

  const filtered =
    activeCategory === "all"
      ? BLOG_POSTS.filter((p) => !p.featured)
      : BLOG_POSTS.filter((p) => p.tagSlug === activeCategory && !p.featured);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  }

  return (
    <>
      {/* Hero Header */}
      <section className="bg-[color:var(--ink)] text-[color:var(--ivory)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B00' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container-luxe py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow text-[color:var(--gold)] mb-4">Dharmik Blog</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
              Stories &<br />
              <span className="text-[color:var(--saffron)]">Sacred craft.</span>
            </h1>
            <p className="mt-6 text-white/60 max-w-lg text-lg leading-relaxed">
              Exploring the intersection of Indian heritage, sacred iconography, and
              modern craft — one story at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <div className="sticky top-[calc(4rem+1px)] md:top-[calc(5rem+1px)] z-30 bg-[color:var(--ivory)]/90 backdrop-blur-md border-b border-[color:var(--border)]">
        <div className="container-luxe">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-medium whitespace-nowrap transition-all rounded-full ${
                    isActive
                      ? "bg-[color:var(--saffron)] text-white"
                      : "text-foreground/60 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-luxe py-12 md:py-16 space-y-16">
        {/* Featured Post */}
        {(activeCategory === "all" || activeCategory === featured.tagSlug) && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-[1fr_1fr] lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-center"
          >
            <div className="relative overflow-hidden rounded-sm aspect-[16/10] md:aspect-auto md:h-[520px] bg-muted">
              <img
                src={featuredImg}
                alt={featured.title}
                className="absolute inset-0 size-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-[color:var(--saffron)] text-white text-[10px] uppercase tracking-widest px-3 py-1.5 font-semibold">
                  Featured
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="flex items-center gap-1.5 text-[color:var(--saffron)]">
                  <Tag className="size-3" />
                  {featured.tag}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3" />
                  {featured.readTime}
                </span>
                <span>·</span>
                <span>{featured.date}</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.05]">
                {featured.title}
              </h2>
              <p className="text-foreground/70 leading-relaxed text-base md:text-lg">
                {featured.excerpt}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[color:var(--saffron)] grid place-items-center text-white text-sm font-semibold">
                    {featured.author[0]}
                  </div>
                  <span className="text-sm font-medium">{featured.author}</span>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* Divider */}
        {activeCategory === "all" && (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[color:var(--border)]" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Latest posts
            </span>
            <div className="flex-1 h-px bg-[color:var(--border)]" />
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {filtered.length === 0 ? (
            <div className="col-span-3 py-16 text-center">
              <p className="font-display text-3xl text-muted-foreground">
                No posts in this category yet.
              </p>
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-4 text-xs uppercase tracking-widest text-[color:var(--saffron)] underline underline-offset-4"
              >
                View all posts
              </button>
            </div>
          ) : (
            filtered.map((post, i) => {
              const postImg = IMG_MAP[post.imgKey] ?? hero1;
              return (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: Math.min(i * 0.07, 0.28), ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex flex-col">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-sm aspect-[4/3] bg-muted mb-5">
                      <img
                        src={postImg}
                        alt={post.title}
                        className="absolute inset-0 size-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-[color:var(--ink)]/80 backdrop-blur-sm text-[color:var(--ivory)] text-[9px] uppercase tracking-widest px-2.5 py-1">
                          {post.tag}
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readTime}
                      </span>
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>

                    {/* Title */}
                    <h2 className="font-display text-xl md:text-2xl leading-snug mb-3">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-foreground/65 text-sm leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-gradient-to-br from-[color:var(--saffron)] to-[color:var(--gold)] grid place-items-center text-white text-[11px] font-bold">
                          {post.author[0]}
                        </div>
                        <span className="text-xs text-muted-foreground">{post.author}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Newsletter CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-[color:var(--ink)] text-[color:var(--ivory)] rounded-sm p-10 md:p-16 text-center"
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FF6B00' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative">
            <p className="text-[color:var(--gold)] text-[11px] uppercase tracking-[0.3em] mb-4">
              ॥ ॐ ॥
            </p>
            <h2 className="font-display text-3xl md:text-5xl mb-4">
              The Dharma Dispatch
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8 text-base leading-relaxed">
              Stories on craft, culture, and sacred iconography — delivered to your
              inbox every fortnight. No spam. Only meaning.
            </p>
            {subscribed ? (
              <div className="inline-flex items-center gap-3 bg-[color:var(--saffron)]/20 border border-[color:var(--saffron)] px-8 py-4 text-[color:var(--saffron)] text-sm uppercase tracking-widest">
                ✓ &nbsp; You're on the list. Jai Shri Ram! 🙏
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[color:var(--saffron)] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[color:var(--saffron)] text-white px-7 py-3 text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-white hover:text-[color:var(--ink)] transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </motion.section>
      </div>
    </>
  );
}
