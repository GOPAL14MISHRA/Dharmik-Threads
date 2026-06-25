import { createFileRoute, notFound, Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Tag, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { getPost, getRelatedPosts, type BlogPost } from "@/lib/blogData";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import poster from "@/assets/product-poster.jpg";
import krishna from "@/assets/product-krishna.jpg";
import shiva from "@/assets/product-shiva.jpg";
import hanuman from "@/assets/product-hanuman.jpg";
import ram from "@/assets/product-ram.jpg";
import cap from "@/assets/product-cap.jpg";

// Map image keys to actual imported assets
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

export const Route = createFileRoute("/journal/$slug")({
  loader: async ({ params }) => {
    let post = getPost(params.slug);
    if (!post) {
      try {
        const blogRef = doc(db, "blogs", params.slug);
        const blogSnap = await getDoc(blogRef);
        if (blogSnap.exists()) {
          const data = blogSnap.data();
          post = {
            slug: params.slug,
            title: data.title,
            excerpt: data.excerpt || "",
            tag: data.category || "Culture",
            tagSlug: (data.category || "Culture").toLowerCase(),
            date: data.date || "June 20, 2026",
            readTime: data.readTime || "5 min read",
            featured: false,
            author: data.author || "Dharmik Atelier",
            imgKey: data.imgKey || "hero1",
            content: data.content || [],
            relatedSlugs: [],
          };
        }
      } catch (err) {
        console.error("Failed to load blog from Firestore:", err);
      }
    }
    if (!post) throw notFound();
    const related = getRelatedPosts(post);
    return { post, related };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Dharmik Blog` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:type", content: "article" },
          { property: "article:author", content: loaderData.post.author },
          { property: "article:published_time", content: loaderData.post.date },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container-luxe py-32 text-center">
      <p className="font-display text-3xl">Article not found.</p>
      <Link to="/journal" className="mt-6 inline-block text-xs uppercase tracking-widest underline text-[color:var(--saffron)]">
        Back to Blog
      </Link>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { post, related } = Route.useLoaderData();
  const router = useRouter();
  const img = IMG_MAP[post.imgKey] ?? hero1;

  return (
    <>
      {/* Hero */}
      <div className="relative h-[55vh] md:h-[70vh] overflow-hidden bg-[color:var(--ink)]">
        <motion.img
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={img}
          alt={post.title}
          className="absolute inset-0 size-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)] via-[color:var(--ink)]/40 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-8 left-0 right-0">
          <div className="container-luxe">
            <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="size-3" />
              <Link to="/journal" className="hover:text-white transition-colors">Blog</Link>
              <ChevronRight className="size-3" />
              <span className="text-white truncate max-w-[200px]">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-10 md:pb-14">
          <div className="container-luxe max-w-3xl">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/60 mb-4">
              <span className="text-[color:var(--saffron)] flex items-center gap-1.5">
                <Tag className="size-3" />
                {post.tag}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3" />
                {post.readTime}
              </span>
              <span>·</span>
              <span>{post.date}</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display text-3xl md:text-5xl lg:text-6xl text-[color:var(--ivory)] leading-[1.05]"
            >
              {post.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="container-luxe py-12 md:py-16 max-w-3xl">
        {/* Author Bar */}
        <div className="flex items-center justify-between mb-10 pb-8 border-b border-[color:var(--border)]">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-gradient-to-br from-[color:var(--saffron)] to-[color:var(--gold)] grid place-items-center text-white text-base font-bold">
              {post.author[0]}
            </div>
            <div>
              <p className="font-medium text-sm">{post.author}</p>
              <p className="text-xs text-muted-foreground">{post.date}</p>
            </div>
          </div>
          <button
            onClick={() => router.navigate({ to: "/journal" })}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-[color:var(--saffron)] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            All articles
          </button>
        </div>

        {/* Lead excerpt */}
        <p className="text-lg md:text-xl text-foreground/75 leading-relaxed font-light mb-10 border-l-4 border-[color:var(--saffron)] pl-6">
          {post.excerpt}
        </p>

        {/* Content Sections */}
        <div className="space-y-7 text-[15px] leading-[1.85] text-foreground/80">
          {post.content.map((section, i) => {
            if (section.type === "heading") {
              return (
                <h2 key={i} className="font-display text-2xl md:text-3xl text-foreground mt-12 mb-4">
                  {section.text}
                </h2>
              );
            }
            if (section.type === "paragraph") {
              return (
                <p key={i}>
                  {section.text}
                </p>
              );
            }
            if (section.type === "quote") {
              return (
                <blockquote
                  key={i}
                  className="relative my-10 py-7 px-8 bg-[color:var(--ink)]/5 border-l-4 border-[color:var(--saffron)]"
                >
                  <span className="absolute top-3 left-6 text-5xl text-[color:var(--saffron)]/30 font-serif leading-none">"</span>
                  <p className="relative text-base md:text-lg font-light italic text-foreground/80 leading-relaxed">
                    {section.text}
                  </p>
                </blockquote>
              );
            }
            if (section.type === "list" && section.items) {
              return (
                <ul key={i} className="space-y-3 my-6">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 rounded-full bg-[color:var(--saffron)] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            if (section.type === "divider") {
              return (
                <div key={i} className="flex items-center gap-4 my-10">
                  <div className="flex-1 h-px bg-[color:var(--border)]" />
                  <span className="text-[color:var(--gold)] text-lg">॥ ॐ ॥</span>
                  <div className="flex-1 h-px bg-[color:var(--border)]" />
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* End decoration */}
        <div className="flex items-center gap-4 mt-16 mb-12">
          <div className="flex-1 h-px bg-[color:var(--border)]" />
          <span className="text-[color:var(--gold)] text-xl">॥ ॐ ॥</span>
          <div className="flex-1 h-px bg-[color:var(--border)]" />
        </div>

        {/* Tags & Back */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] bg-[color:var(--saffron)]/10 text-[color:var(--saffron)] px-4 py-2 rounded-full">
            <Tag className="size-3" />
            {post.tag}
          </span>
          <Link
            to="/journal"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold hover:text-[color:var(--saffron)] transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="border-t border-[color:var(--border)] py-14 md:py-20">
          <div className="container-luxe">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-3xl md:text-4xl">You may also enjoy</h2>
              <Link
                to="/journal"
                className="hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-[color:var(--saffron)] transition-colors"
              >
                All articles <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {related.map((rel, i) => {
                const relImg = IMG_MAP[rel.imgKey] ?? hero1;
                return (
                  <motion.div
                    key={rel.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <div className="flex flex-col">
                      <div className="relative overflow-hidden rounded-sm aspect-[4/3] bg-muted mb-4">
                        <img
                          src={relImg}
                          alt={rel.title}
                          className="absolute inset-0 size-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[color:var(--ink)]/80 backdrop-blur-sm text-[color:var(--ivory)] text-[9px] uppercase tracking-widest px-2.5 py-1">
                            {rel.tag}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                        <Clock className="size-3" />
                        {rel.readTime}
                        <span>·</span>
                        {rel.date}
                      </div>
                      <h3 className="font-display text-xl leading-snug">
                        {rel.title}
                      </h3>
                      <p className="mt-2 text-sm text-foreground/65 leading-relaxed line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
