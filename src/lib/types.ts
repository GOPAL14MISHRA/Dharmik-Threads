// ─────────────────────────────────────────────────────────────────────────────
// Core enums
// ─────────────────────────────────────────────────────────────────────────────

export type Category =
  | "tshirts"
  | "hoodies"
  | "sweatshirts"
  | "polos"
  | "jackets"
  | "caps"
  | "accessories"
  | "wall-art";

export type Collection =
  | "mahadev"
  | "shri-ram"
  | "krishna"
  | "hanuman"
  | "bhagavad-gita"
  | "sanskrit"
  | "temple-architecture"
  | "durga";

// ─────────────────────────────────────────────────────────────────────────────
// Product — variant-based schema
// ─────────────────────────────────────────────────────────────────────────────

export interface Color {
  name: string;
  hex: string;
}

export interface SizeOption {
  size: string;
  price: number;
  stock: number;
  sku: string;
}

export interface ProductVariant {
  variantId: string;  // e.g. "p1-black"
  color: Color;
  images: string[];   // per-variant image set
  sizes: SizeOption[];
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  collection: Collection;
  brand: string;
  variants: ProductVariant[];  // ≥ 1 variant required
  rating: number;
  reviewCount: number;
  reviews: Review[];
  tags?: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  createdAt: string; // ISO date "YYYY-MM-DD"
}

// ─────────────────────────────────────────────────────────────────────────────
// Derived helpers — computed from variants
// ─────────────────────────────────────────────────────────────────────────────

/** Lowest price across all variants + sizes */
export function getBasePrice(product: Product): number {
  return Math.min(...product.variants.flatMap((v) => v.sizes.map((s) => s.price)));
}

/** Highest original price (for strike-through display) */
export function getMaxPrice(product: Product): number {
  return Math.max(...product.variants.flatMap((v) => v.sizes.map((s) => s.price)));
}

/** First image of first variant (used in cards, OG tags etc.) */
export function getDefaultImage(product: Product): string {
  return product.variants[0]?.images[0] ?? "";
}

/** All available colour options */
export function getColors(product: Product): Color[] {
  return product.variants.map((v) => v.color);
}

/** Sizes for a given variant (by color name) */
export function getSizesForColor(product: Product, colorName: string): SizeOption[] {
  return product.variants.find((v) => v.color.name === colorName)?.sizes ?? [];
}

/** Get a specific variant by color name */
export function getVariantByColor(product: Product, colorName: string): ProductVariant | undefined {
  return product.variants.find((v) => v.color.name === colorName);
}

/** Total stock across all variants */
export function getTotalStock(product: Product): number {
  return product.variants.flatMap((v) => v.sizes).reduce((sum, s) => sum + s.stock, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Address
// ─────────────────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// User
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
  joinedAt: string;
  orders: number;
  spent: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  variantId: string;   // which variant was selected
  slug: string;
  title: string;
  image: string;
  price: number;       // price at time of adding (from SizeOption.price)
  size: string;
  color: string;
  sku: string;
  quantity: number;
}

export interface Cart {
  userId?: string;
  items: CartItem[];
  subtotal: number;
  coupon?: string | null;
  discount?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Order
// ─────────────────────────────────────────────────────────────────────────────

export type OrderStatus = "placed" | "packed" | "shipped" | "out-for-delivery" | "delivered";
export type PaymentMethod = "razorpay" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "cod_pending";

export interface Order {
  orderId: string;
  userId: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Coupon
// ─────────────────────────────────────────────────────────────────────────────

export interface Coupon {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  description: string;
  active: boolean;
  expiryDate: string;
  uses: number;
}
