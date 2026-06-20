import { doc, getDoc, setDoc, serverTimestamp, Timestamp, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import type { Cart, CartItem } from "@/lib/types";

export const cartService = {
  async syncCart(userId: string, cart: Cart) {
    const cartRef = doc(db, "carts", userId);
    const payload = {
      userId,
      items: cart.items,
      coupon: cart.coupon,
      discount: cart.discount,
      updatedAt: serverTimestamp(),
    };
    await setDoc(cartRef, payload, { merge: true });
    return payload;
  },

  async fetchCart(userId: string): Promise<Cart | null> {
    const cartRef = doc(db, "carts", userId);
    const cartDoc = await getDoc(cartRef);
    if (!cartDoc.exists()) return null;
    return cartDoc.data() as Cart;
  },

  async applyCoupon(code: string, subtotal: number) {
    const couponQuery = query(collection(db, "coupons"), where("code", "==", code.toUpperCase()));
    const snapshot = await getDocs(couponQuery);
    if (snapshot.empty) {
      return { valid: false };
    }
    const coupon = snapshot.docs[0].data();
    const now = Timestamp.now();
    if (!coupon.active || coupon.expiryDate && coupon.expiryDate.toMillis ? coupon.expiryDate.toMillis() < now.toMillis() : new Date(coupon.expiryDate).getTime() < now.toMillis()) {
      return { valid: false };
    }
    if (subtotal < coupon.minOrderAmount) {
      return { valid: false };
    }
    const discount = coupon.discountType === "percent"
      ? Math.round(subtotal * (coupon.discountValue / 100))
      : coupon.discountValue;
    return {
      valid: true,
      code: coupon.code,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    };
  },
};
