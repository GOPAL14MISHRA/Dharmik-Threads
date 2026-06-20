import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { collections, categories } from "@/lib/data/products";
import type { Product, Category, Collection } from "@/lib/types";

const productsRef = collection(db, "products");

function mapProductDoc(doc: any): Product {
  // ── Backward compatibility: old docs have flat price/images/colors/sizes ──
  let variants = doc.variants;
  if (!variants || variants.length === 0) {
    // Convert old schema to a single-variant product
    const oldColors: Array<{ name: string; hex: string }> = doc.colors ?? [{ name: "Default", hex: "#111111" }];
    const oldSizes: string[] = doc.sizes ?? ["S", "M", "L", "XL"];
    const oldImages: string[] = doc.images ?? [];
    const oldPrice: number = doc.price ?? 999;
    const oldStock: number = doc.stock ?? 0;
    variants = oldColors.map((color, ci) => ({
      variantId: `${doc.id}-${color.name.toLowerCase().replace(/\s+/g, "-")}`,
      color,
      images: oldImages,
      sizes: oldSizes.map((size, si) => ({
        size,
        price: oldPrice,
        stock: ci === 0 ? oldStock : 0,
        sku: `${doc.id?.toUpperCase()}-${color.name.replace(/\s+/g, "").toUpperCase()}-${size}`,
      })),
    }));
  }
  // ─────────────────────────────────────────────────────────────────────────

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    collection: doc.collection,
    brand: doc.brand ?? "DharmikThreads",
    variants,
    rating: doc.rating ?? 0,
    reviewCount: doc.reviewCount ?? 0,
    reviews: doc.reviews ?? [],
    tags: doc.tags,
    isBestSeller: doc.isBestSeller,
    isNew: doc.isNew,
    createdAt: doc.createdAt ?? "",
  };
}

export const productService = {
  async getProducts(filters?: { category?: Category; collection?: Collection; q?: string }) {
    const clauses: any[] = [];
    if (filters?.category) clauses.push(where("category", "==", filters.category));
    if (filters?.collection) clauses.push(where("collection", "==", filters.collection));

    const productsQuery = clauses.length ? query(productsRef, ...clauses) : productsRef;
    const snapshot = await getDocs(productsQuery);
    let list = snapshot.docs.map((doc) => mapProductDoc({ id: doc.id, ...doc.data() }));

    if (filters?.q) {
      const q = filters.q.toLowerCase();
      list = list.filter((product) =>
        product.title.toLowerCase().includes(q) || product.description.toLowerCase().includes(q),
      );
    }

    return list;
  },

  async getBySlug(slug: string) {
    const snapshot = await getDocs(query(productsRef, where("slug", "==", slug), limit(1)));
    if (snapshot.empty) return null;
    return mapProductDoc({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
  },

  async getBestSellers() {
    const snapshot = await getDocs(query(productsRef, where("isBestSeller", "==", true)));
    return snapshot.docs.map((doc) => mapProductDoc({ id: doc.id, ...doc.data() }));
  },

  async getNewArrivals() {
    const snapshot = await getDocs(query(productsRef, where("isNew", "==", true)));
    return snapshot.docs.map((doc) => mapProductDoc({ id: doc.id, ...doc.data() }));
  },

  async getRelated(slug: string) {
    const snapshot = await getDocs(query(productsRef, limit(10)));
    return snapshot.docs
      .map((doc) => mapProductDoc({ id: doc.id, ...doc.data() }))
      .filter((product) => product.slug !== slug)
      .slice(0, 4);
  },

  async getCollections() {
    return [...collections];
  },

  async getCategories() {
    return [...categories];
  },
};

export type { Product };
