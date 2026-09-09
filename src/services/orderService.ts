import type { Address, CartItem, Order, PaymentMethod } from "@/lib/types";
import { authReady } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { collection, doc, getDoc, getDocs, query, where, setDoc } from "firebase/firestore";

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
    await authReady;
    const orderId = generateOrderId();
    const placedAt = new Date().toISOString();
    const order: Order = {
      ...input,
      orderId,
      paymentStatus: input.paymentMethod === "cod" ? "cod_pending" : "pending",
      orderStatus: "placed",
      trackingNumber: generateTrackingNumber(),
      createdAt: placedAt,
      placedAt,
    };
    await setDoc(doc(db, "orders", orderId), order);
    return order;
  },

  async getOrders(userId: string) {
    await authReady;
    const snapshot = await getDocs(query(collection(db, "orders"), where("userId", "==", userId)));
    return snapshot.docs.map((item) => item.data() as Order).sort((a, b) => b.placedAt.localeCompare(a.placedAt));
  },

  async getOrder(id: string) {
    await authReady;
    const snapshot = await getDoc(doc(db, "orders", id));
    return snapshot.exists() ? snapshot.data() as Order : null;
  },

  async trackOrder(id: string) {
    await authReady;
    const snapshot = await getDoc(doc(db, "orders", id));
    return snapshot.exists() ? snapshot.data() as Order : null;
  },
};
