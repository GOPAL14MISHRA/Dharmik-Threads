import { products as seedProducts } from "@/lib/data/products";
import type { Product, Order, OrderStatus } from "@/lib/types";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedAt: string;
  orders: number;
  spent: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountPct: number;
  expires: string;
  uses: number;
  active: boolean;
}

const LS_KEY = "dharmik_admin_v1";

interface AdminState {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
}

const ORDER_STATUSES: OrderStatus[] = ["placed", "packed", "shipped", "out-for-delivery", "delivered"];

function seedOrders(prods: Product[]): Order[] {
  const cities: [string, string, string][] = [
    ["Mumbai", "MH", "400001"],
    ["Bengaluru", "KA", "560001"],
    ["Delhi", "DL", "110001"],
    ["Pune", "MH", "411001"],
    ["Jaipur", "RJ", "302001"],
    ["Varanasi", "UP", "221001"],
    ["Chennai", "TN", "600001"],
    ["Kolkata", "WB", "700001"],
  ];
  const names = ["Aarav Sharma", "Priya Kapoor", "Rohan Mehta", "Ananya Patel", "Kabir Dixit", "Ishaan Rao", "Diya Nair", "Vivaan Singh"];
  const out: Order[] = [];
  for (let i = 0; i < 18; i++) {
    const p1 = prods[i % prods.length];
    const p2 = prods[(i + 3) % prods.length];
    const qty1 = 1 + (i % 2);
    const p1v = p1.variants[0];
    const p1s = p1v?.sizes[0];
    const p2v = p2.variants[0];
    const p2s = p2v?.sizes[0];
    const price1 = p1s?.price ?? 999;
    const price2 = p2s?.price ?? 999;
    const total = price1 * qty1 + price2;
    const c = cities[i % cities.length];
    const name = names[i % names.length];
    const days = i * 2;
    out.push({
      orderId: `DT${(10000000 + i * 137).toString().slice(-8)}`,
      items: [
        { productId: p1.id, variantId: p1v?.variantId ?? "", slug: p1.slug, title: p1.title, image: p1v?.images[0] ?? "", price: price1, size: p1s?.size ?? "M", color: p1v?.color.name ?? "Default", sku: p1s?.sku ?? "", quantity: qty1 },
        { productId: p2.id, variantId: p2v?.variantId ?? "", slug: p2.slug, title: p2.title, image: p2v?.images[0] ?? "", price: price2, size: p2s?.size ?? "M", color: p2v?.color.name ?? "Default", sku: p2s?.sku ?? "", quantity: 1 },
      ],
      shippingAddress: {
        id: `a${i}`,
        fullName: name,
        line1: `${100 + i} Temple Road`,
        line2: "Sector 4",
        city: c[0],
        state: c[1],
        pincode: c[2],
        phone: `+91 9${(800000000 + i * 7919).toString().slice(0, 9)}`,
      },
      paymentMethod: i % 3 === 0 ? "cod" : "razorpay",
      orderStatus: ORDER_STATUSES[i % ORDER_STATUSES.length],
      trackingNumber: `TRK${(100000000 + i * 9173).toString()}`,
      total,
      placedAt: new Date(Date.now() - days * 86400000).toISOString(),
    });
  }
  return out;
}

function seedCustomers(orders: Order[]): Customer[] {
  const map = new Map<string, Customer>();
  orders.forEach((o, i) => {
    const key = o.shippingAddress.fullName;
    const existing = map.get(key);
    if (existing) {
      existing.orders += 1;
      existing.spent += o.total;
    } else {
      map.set(key, {
        id: `c${i}`,
        name: key,
        email: key.toLowerCase().replace(/\s/g, ".") + "@gmail.com",
        phone: o.shippingAddress.phone,
        city: o.shippingAddress.city,
        joinedAt: new Date(Date.now() - (60 + i * 5) * 86400000).toISOString(),
        orders: 1,
        spent: o.total,
      });
    }
  });
  return Array.from(map.values());
}

function seedCoupons(): Coupon[] {
  return [
    { code: "DHARMA10", description: "10% off your next order", discountPct: 10, expires: "2026-12-31", uses: 142, active: true },
    { code: "OMSHANTI", description: "Free shipping on ₹1499+", discountPct: 0, expires: "2026-09-30", uses: 89, active: true },
    { code: "MAHADEV15", description: "15% off Mahadev collection", discountPct: 15, expires: "2026-08-15", uses: 56, active: true },
    { code: "DIWALI25", description: "25% off festival drop", discountPct: 25, expires: "2026-11-10", uses: 0, active: false },
  ];
}

function load(): AdminState {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
  }
  const ords = seedOrders(seedProducts);
  return {
    products: seedProducts.map((p) => ({ ...p })),
    orders: ords,
    customers: seedCustomers(ords),
    coupons: seedCoupons(),
  };
}

let state: AdminState = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  }
  listeners.forEach((l) => l());
}

export const adminStore = {
  subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn); },
  getState() { return state; },
  reset() { localStorage.removeItem(LS_KEY); state = load(); persist(); },

  // products
  updateProduct(id: string, patch: Partial<Product>) {
    state.products = state.products.map((p) => (p.id === id ? { ...p, ...patch } : p));
    persist();
  },
  deleteProduct(id: string) {
    state.products = state.products.filter((p) => p.id !== id);
    persist();
  },
  addProduct(p: Product) {
    state.products = [p, ...state.products];
    persist();
  },

  // orders
  updateOrderStatus(orderId: string, status: OrderStatus) {
    state.orders = state.orders.map((o) => (o.orderId === orderId ? { ...o, orderStatus: status } : o));
    persist();
  },

  // coupons
  toggleCoupon(code: string) {
    state.coupons = state.coupons.map((c) => (c.code === code ? { ...c, active: !c.active } : c));
    persist();
  },
  addCoupon(c: Coupon) {
    state.coupons = [c, ...state.coupons];
    persist();
  },
  deleteCoupon(code: string) {
    state.coupons = state.coupons.filter((c) => c.code !== code);
    persist();
  },
};

export const ORDER_STATUS_LIST = ORDER_STATUSES;
