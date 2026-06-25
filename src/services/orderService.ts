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

function cleanOrder(id: string, data: any): Order {
  let placedAt = "";
  if (data.createdAt) {
    if (data.placedAt) {
      placedAt = data.placedAt;
    } else if (typeof data.createdAt.toDate === "function") {
      placedAt = data.createdAt.toDate().toISOString();
    } else if (data.createdAt.seconds) {
      placedAt = new Date(data.createdAt.seconds * 1000).toISOString();
    } else {
      placedAt = new Date(data.createdAt).toISOString();
    }
  } else {
    placedAt = new Date().toISOString();
  }

  return {
    ...data,
    orderId: id,
    placedAt,
    createdAt: placedAt,
  } as Order;
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
      const productDocs: { productRef: any; doc: any; item: CartItem }[] = [];
      
      // 1. Perform all reads first
      for (const item of input.items) {
        const productRef = doc(db, "products", item.productId);
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
          throw new Error(`Product ${item.productId} not found`);
        }
        productDocs.push({ productRef, doc: productDoc, item });
      }

      // 2. Perform validation and calculate stock changes locally
      const productVariantsMap = new Map<string, any[]>();

      for (const { doc: productDoc, item } of productDocs) {
        const productId = item.productId;
        const product = productDoc.data();
        
        const variants: any[] = productVariantsMap.get(productId) ?? product.variants ?? [];
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
        productVariantsMap.set(productId, updatedVariants);
      }

      // 3. Perform all writes
      const uniqueProductIds = new Set<string>();
      for (const { productRef, item } of productDocs) {
        if (!uniqueProductIds.has(item.productId)) {
          uniqueProductIds.add(item.productId);
          const updatedVariants = productVariantsMap.get(item.productId);
          transaction.update(productRef, { variants: updatedVariants });
        }
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
      placedAt: new Date().toISOString(),
    };
  },

  async getOrders(userId: string) {
    const ordersQuery = query(collection(db, "orders"), where("userId", "==", userId));
    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map((docSnapshot) => cleanOrder(docSnapshot.id, docSnapshot.data())).sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
  },

  async getOrder(id: string) {
    const orderDoc = await getDoc(doc(db, "orders", id));
    if (!orderDoc.exists()) return null;
    return cleanOrder(orderDoc.id, orderDoc.data());
  },

  async trackOrder(id: string) {
    const orderDoc = await getDoc(doc(db, "orders", id));
    if (!orderDoc.exists()) return null;
    const order = orderDoc.data() as Order;
    return { status: order.orderStatus, tracking: order.trackingNumber };
  },
};
