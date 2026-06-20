import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

export const wishlistService = {
  async sync(userId: string, productIds: string[]) {
    const wishlistRef = doc(db, "wishlists", userId);
    await setDoc(wishlistRef, {
      userId,
      productIds,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { userId, productIds };
  },

  async fetch(userId: string): Promise<string[]> {
    const wishlistRef = doc(db, "wishlists", userId);
    const wishlistDoc = await getDoc(wishlistRef);
    if (!wishlistDoc.exists()) return [];
    const data = wishlistDoc.data();
    return Array.isArray(data.productIds) ? data.productIds : [];
  },
};
