import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import type { User } from "@/lib/types";

function mapUser(user: any, docData: any): User {
  return {
    id: user.uid,
    name: docData?.name ?? user.displayName ?? "",
    email: docData?.email ?? user.email ?? "",
    phone: docData?.phone ?? user.phoneNumber ?? "",
    addresses: docData?.addresses ?? [],
    joinedAt: docData?.joinedAt ?? "",
    orders: docData?.orders ?? 0,
    spent: docData?.spent ?? 0,
  };
}

export const authService = {
  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", credential.user.uid);
    const userDoc = await getDoc(userRef);
    const user = mapUser(credential.user, userDoc.exists() ? userDoc.data() : null);
    return { user, token: await credential.user.getIdToken() };
  },

  async signup(name: string, email: string, password: string, phone: string, address?: any) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    const addresses = address ? [{ ...address, id: Date.now().toString() }] : [];
    const user: User = {
      id: credential.user.uid,
      name,
      email,
      phone,
      addresses,
      joinedAt: new Date().toISOString(),
      orders: 0,
      spent: 0,
    };
    await setDoc(doc(db, "users", user.id), {
      uid: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
      createdAt: serverTimestamp(),
      role: "customer",
    });
    return { user, token: await credential.user.getIdToken() };
  },

  async logout() {
    await signOut(auth);
    return { ok: true };
  },

  async googleLogin() {
    const provider = new GoogleAuthProvider();
    
    // Configure OAuth scopes
    provider.addScope("profile");
    provider.addScope("email");
    
    try {
      console.log("Google OAuth sign-in initiated");

      const credential = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", credential.user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: credential.user.uid,
          name: credential.user.displayName ?? "",
          email: credential.user.email ?? "",
          phone: credential.user.phoneNumber ?? "",
          addresses: [],
          createdAt: serverTimestamp(),
          role: "customer",
        });
      }
      const user = mapUser(credential.user, userDoc.exists() ? userDoc.data() : null);
      return { user, token: await credential.user.getIdToken() };
    } catch (err: any) {
      // Surface Firebase error details for debugging in the UI/console.
      console.error("authService.googleLogin error:", err);
      throw err;
    }
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  },

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    const userRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    return mapUser(firebaseUser, userDoc.exists() ? userDoc.data() : null);
  },
};
