import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Address, CartItem, Order, PaymentMethod } from "@/lib/types";

function generateOrderId() {
  return `DT${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
}

function generateTrackingNumber() {
  return `TRK${Math.floor(100000000 + Math.random() * 900000000)}`;
}

export const orderService = {
  async placeOrder(input: {
    userId: string;
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  }): Promise<Order> {
    const orderId = generateOrderId();
    const trackingNumber = generateTrackingNumber();
    const orderRef = doc(db, "orders", orderId);

    await runTransaction(db, async (transaction) => {
      for (const item of input.items) {
        const productRef = doc(db, "products", item.productId);
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
          throw new Error(`Product ${item.productId} not found`);
        }
        const product = productDoc.data();
        // New variant-based schema: find the right variant and size
        const variants: any[] = product.variants ?? [];
        const variantIdx = variants.findIndex((v: any) => v.variantId === item.variantId);
        if (variantIdx === -1) {
          throw new Error(`Variant ${item.variantId} not found for ${item.title}`);
        }
        const sizes: any[] = variants[variantIdx]?.sizes ?? [];
        const sizeIdx = sizes.findIndex((s: any) => s.size === item.size);
        if (sizeIdx === -1 || sizes[sizeIdx].stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.title} — ${item.size}`);
        }
        // Mutate a copy of the variants array with the decremented stock
        const updatedVariants = variants.map((v: any, vi: number) =>
          vi === variantIdx
            ? {
                ...v,
                sizes: v.sizes.map((s: any, si: number) =>
                  si === sizeIdx ? { ...s, stock: s.stock - item.quantity } : s
                ),
              }
            : v
        );
        transaction.update(productRef, { variants: updatedVariants });
      }

      transaction.set(orderRef, {
        orderId,
        userId: input.userId,
        items: input.items,
        shippingAddress: input.shippingAddress,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === "cod" ? "cod_pending" : "pending",
        orderStatus: "placed",
        trackingNumber,
        subtotal: input.subtotal,
        discount: input.discount,
        tax: input.tax,
        total: input.total,
        createdAt: serverTimestamp(),
      });

      const cartRef = doc(db, "carts", input.userId);
      transaction.set(cartRef, {
        userId: input.userId,
        items: [],
        coupon: null,
        discount: 0,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    });

    return {
      orderId,
      userId: input.userId,
      items: input.items,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "cod" ? "cod_pending" : "pending",
      orderStatus: "placed",
      trackingNumber,
      subtotal: input.subtotal,
      discount: input.discount,
      tax: input.tax,
      total: input.total,
      createdAt: new Date().toISOString(),
    };
  },

  async getOrders(userId: string) {
    const ordersQuery = query(collection(db, "orders"), where("userId", "==", userId));
    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map((docSnapshot) => docSnapshot.data() as Order);
  },

  async getOrder(id: string) {
    const orderDoc = await getDoc(doc(db, "orders", id));
    if (!orderDoc.exists()) return null;
    return orderDoc.data() as Order;
  },

  async trackOrder(id: string) {
    const orderDoc = await getDoc(doc(db, "orders", id));
    if (!orderDoc.exists()) return null;
    const order = orderDoc.data() as Order;
    return { status: order.orderStatus, tracking: order.trackingNumber };
  },
};
