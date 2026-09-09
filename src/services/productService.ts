import { collections, categories } from "@/lib/data/products";
import type { Product, Category, Collection } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

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

async function getFirestoreProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((item) => mapProductDoc({ id: item.id, ...item.data() }));
}

async function getApiProducts(filters?: { category?: Category; collection?: Collection; q?: string }) {
  const params = new URLSearchParams();
  if (filters?.category) params.append("category", filters.category);
  if (filters?.collection) params.append("collection", filters.collection);
  if (filters?.q) params.append("q", filters.q);
  const res = await fetch(`/api/get_products.php?${params.toString()}`);
  return res.ok ? (await res.json()).map(mapProductDoc) : [];
}

export const productService = {
  async getProducts(filters?: { category?: Category; collection?: Collection; q?: string }) {
    try {
      let products = await getFirestoreProducts();
      if (filters?.category) products = products.filter((product) => product.category === filters.category);
      if (filters?.collection) products = products.filter((product) => product.collection === filters.collection);
      if (filters?.q) {
        const query = filters.q.toLowerCase();
        products = products.filter((product) =>
          product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
        );
      }
      return products;
    } catch (error) {
      console.warn("Firestore products unavailable, using API fallback:", error);
      return getApiProducts(filters);
    }
  },

  async getBySlug(slug: string) {
    try {
      const products = await getFirestoreProducts();
      return products.find((product) => product.slug === slug) ?? null;
    } catch (error) {
      console.warn("Firestore product unavailable, using API fallback:", error);
      const res = await fetch(`/api/get_product_by_slug.php?slug=${encodeURIComponent(slug)}`);
      const data = res.ok ? await res.json() : null;
      return data ? mapProductDoc(data) : null;
    }
  },

  async getBestSellers() {
    const products = await this.getProducts();
    return products.filter((product) => product.isBestSeller);
  },

  async getNewArrivals() {
    const products = await this.getProducts();
    return products.filter((product) => product.isNew);
  },

  async getRelated(slug: string) {
    const current = await this.getBySlug(slug);
    const products = await this.getProducts();
    return products.filter((product) =>
      product.slug !== slug && current && product.collection === current.collection,
    );
  },

  async getCollections() {
    return [...collections];
  },

  async getCategories() {
    return [...categories];
  },

  subscribeProducts(callback: (products: Product[]) => void, filters?: { category?: Category; collection?: Collection }) {
    let active = true;
    const fetchIt = async () => {
      try {
        const products = await this.getProducts(filters);
        if (active) callback(products);
      } catch (err) {
        console.error("Error subscribing to products:", err);
      }
    };
    fetchIt();
    const interval = setInterval(fetchIt, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  },

  subscribeProductBySlug(slug: string, callback: (product: Product | null) => void) {
    let active = true;
    const fetchIt = async () => {
      try {
        const product = await this.getBySlug(slug);
        if (active) callback(product);
      } catch (err) {
        console.error("Error subscribing to product by slug:", err);
      }
    };
    fetchIt();
    const interval = setInterval(fetchIt, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  },

  subscribeBestSellers(callback: (products: Product[]) => void) {
    let active = true;
    const fetchIt = async () => {
      try {
        const products = await this.getBestSellers();
        if (active) callback(products);
      } catch (err) {
        console.error("Error subscribing to best sellers:", err);
      }
    };
    fetchIt();
    const interval = setInterval(fetchIt, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  },
};

export type { Product };
