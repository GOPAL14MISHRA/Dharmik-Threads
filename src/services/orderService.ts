import type { Address, CartItem, Order, PaymentMethod } from "@/lib/types";

// Removed redundant local cleanOrder function as backend will handle format

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
    const res = await fetch("/api/place_order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to place order");
    }
    return await res.json();
  },

  async getOrders(userId: string) {
    const res = await fetch(`/api/get_orders.php?uid=${userId}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async getOrder(id: string) {
    const res = await fetch(`/api/get_order.php?id=${id}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async trackOrder(id: string) {
    const res = await fetch(`/api/track_order.php?id=${id}`);
    if (!res.ok) return null;
    return await res.json();
  },
};
