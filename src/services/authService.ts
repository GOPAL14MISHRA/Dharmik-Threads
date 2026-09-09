import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase/auth";
import { authReady } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

async function getUserProfile(uid: string) {
  try {
    const snapshot = await getDoc(doc(db, "users", uid));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.warn("User profile could not be loaded from Firestore:", error);
    return null;
  }
}

async function saveUserProfile(user: User, role = "customer") {
  try {
    await setDoc(doc(db, "users", user.id), {
      uid: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      addresses: user.addresses,
      joinedAt: user.joinedAt ?? new Date().toISOString(),
      orders: user.orders ?? 0,
      spent: user.spent ?? 0,
      role,
    }, { merge: true });
  } catch (error) {
    console.warn("User profile could not be saved to Firestore:", error);
  }
}

export const authService = {
  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const userDocData = await getUserProfile(credential.user.uid);
    const user = mapUser(credential.user, userDocData);
    await saveUserProfile(user);
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
    await saveUserProfile(user);
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
      let userDocData = await getUserProfile(credential.user.uid);
      if (!userDocData) {
        userDocData = {
          uid: credential.user.uid,
          name: credential.user.displayName ?? "",
          email: credential.user.email ?? "",
          phone: credential.user.phoneNumber ?? "",
          addresses: [],
          createdAt: new Date().toISOString(),
          role: "customer",
        };
        await saveUserProfile(mapUser(credential.user, userDocData));
      }
      const user = mapUser(credential.user, userDocData);
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
    await authReady;
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    const userDocData = await getUserProfile(firebaseUser.uid);
    return mapUser(firebaseUser, userDocData);
  },
};
