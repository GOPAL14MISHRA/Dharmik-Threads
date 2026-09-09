import { auth, authReady } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { Address, User } from "@/lib/types";
import { notificationService } from "./notificationService";

export const userService = {
  async updateProfile(patch: Partial<User>) {
    await authReady;
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    await updateDoc(doc(db, "users", currentUser.uid), patch);
    return { ok: true, patch };
  },
  async addAddress(addr: Address) {
    await authReady;
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    const userRef = doc(db, "users", currentUser.uid);
    const snapshot = await getDoc(userRef);
    const addresses = snapshot.exists() ? ((snapshot.data().addresses ?? []) as Address[]) : [];
    await updateDoc(userRef, { addresses: [...addresses, addr] });
    return { ok: true, addr };
  },
  async subscribeNewsletter(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) throw new Error("Email is required");

    await fetch("/api/subscribe_newsletter.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail }),
    });

    const subject = "Successfully Subscribed to Dharmik Threads!";
    const body = "Successfully Subscribed to Dharmik Threads!\nJai Shri Ram! 🙏\n\nYou have successfully subscribed to Dharmik Threads.\n\nWe preserve Sanatan culture through modern, premium craft. Whenever a new product is launched or a new story is posted on our blog, you will receive a notification here.\n\nThank you for joining our community.";

    // Save notification
    await fetch("/api/save_sent_email.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: `welcome-${cleanEmail.replace(/[^a-z0-9]/g, "_")}`,
        to: cleanEmail,
        subject,
        body,
        type: "subscription",
        sentAt: new Date().toISOString(),
      }),
    });

    // Send the real transactional email directly
    await notificationService.sendDirectEmail(cleanEmail, subject, body);

    return { ok: true, email: cleanEmail };
  },
};
