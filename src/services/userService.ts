import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import type { Address, User } from "@/lib/types";
import { notificationService } from "./notificationService";

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
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) throw new Error("Email is required");

    const newsletterRef = doc(db, "newsletter", cleanEmail);
    await setDoc(newsletterRef, {
      email: cleanEmail,
      subscribedAt: serverTimestamp(),
    });

    // Write a welcome email notification if not already sent
    const emailId = `welcome-${cleanEmail.replace(/[^a-z0-9]/g, "_")}`;
    const welcomeRef = doc(db, "sent_emails", emailId);
    const subject = "Successfully Subscribed to Dharmik Threads!";
    const body = "Successfully Subscribed to Dharmik Threads!\nJai Shri Ram! 🙏\n\nYou have successfully subscribed to Dharmik Threads.\n\nWe preserve Sanatan culture through modern, premium craft. Whenever a new product is launched or a new story is posted on our blog, you will receive a notification here.\n\nThank you for joining our community.";
    
    await setDoc(welcomeRef, {
      to: cleanEmail,
      subject,
      body,
      type: "subscription",
      sentAt: new Date().toISOString(),
    });

    // Send the real transactional email directly
    await notificationService.sendDirectEmail(cleanEmail, subject, body);

    return { ok: true, email: cleanEmail };
  },
};
