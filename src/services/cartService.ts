import type { Cart, CartItem } from "@/lib/types";

export const cartService = {
  async syncCart(userId: string, cart: Cart) {
    const payload = {
      userId,
      items: cart.items,
      coupon: cart.coupon,
      discount: cart.discount,
    };
    await fetch("/api/sync_cart.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return payload;
  },

  async fetchCart(userId: string): Promise<Cart | null> {
    const res = await fetch(`/api/get_cart.php?uid=${userId}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async applyCoupon(code: string, subtotal: number) {
    const res = await fetch("/api/apply_coupon.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal }),
    });
    return await res.json();
  },

  async getPublicCoupons() {
    try {
      const res = await fetch("/api/get_public_coupons.php");
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error("Failed to fetch active coupons:", err);
      return [];
    }
  },
};
