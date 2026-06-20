import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductVariant, SizeOption } from "@/lib/types";
import { getDefaultImage } from "@/lib/types";

interface CartState {
  items: CartItem[];
  coupon: string | null;
  discount: number;
  add: (p: Product, variant: ProductVariant, sizeOption: SizeOption, qty?: number) => void;
  remove: (productId: string, variantId: string, size: string) => void;
  setQty: (productId: string, variantId: string, size: string, qty: number) => void;
  setCoupon: (code: string, discount: number) => void;
  clearCoupon: () => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discount: 0,

      add: (p, variant, sizeOption, qty = 1) =>
        set((s) => {
          const i = s.items.findIndex(
            (x) => x.productId === p.id && x.variantId === variant.variantId && x.size === sizeOption.size
          );
          if (i >= 0) {
            const next = [...s.items];
            next[i] = { ...next[i], quantity: next[i].quantity + qty };
            return { items: next };
          }
          const newItem: CartItem = {
            productId: p.id,
            variantId: variant.variantId,
            slug: p.slug,
            title: p.title,
            image: variant.images[0] ?? getDefaultImage(p),
            price: sizeOption.price,
            size: sizeOption.size,
            color: variant.color.name,
            sku: sizeOption.sku,
            quantity: qty,
          };
          return { items: [...s.items, newItem] };
        }),

      remove: (productId, variantId, size) =>
        set((s) => ({
          items: s.items.filter(
            (x) => !(x.productId === productId && x.variantId === variantId && x.size === size)
          ),
        })),

      setQty: (productId, variantId, size, qty) =>
        set((s) => ({
          items: s.items.map((x) =>
            x.productId === productId && x.variantId === variantId && x.size === size
              ? { ...x, quantity: Math.max(1, qty) }
              : x
          ),
        })),

      setCoupon: (code, discount) => set({ coupon: code, discount }),
      clearCoupon: () => set({ coupon: null, discount: 0 }),
      clear: () => set({ items: [], coupon: null, discount: 0 }),
      subtotal: () => get().items.reduce((sum, x) => sum + x.price * x.quantity, 0),
      count: () => get().items.reduce((n, x) => n + x.quantity, 0),
    }),
    { name: "dharma-cart" }
  )
);
