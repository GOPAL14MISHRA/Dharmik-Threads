import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import type { Address, User } from "@/lib/types";

export const userService = {
  async updateProfile(patch: Partial<User>) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.email !== undefined ? { email: patch.email } : {}),
      ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
      updatedAt: serverTimestamp(),
    });
    return { ok: true, patch };
  },
  async addAddress(addr: Address) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    const userRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : null;
    const addresses = Array.isArray(userData?.addresses) ? userData.addresses : [];
    await updateDoc(userRef, {
      addresses: [...addresses, addr],
      updatedAt: serverTimestamp(),
    });
    return { ok: true, addr };
  },
  async subscribeNewsletter(email: string) {
    const newsletterRef = doc(db, "newsletter", email);
    await setDoc(newsletterRef, {
      email,
      subscribedAt: serverTimestamp(),
    });
    return { ok: true, email };
  },
};
