import { auth } from "@/lib/firebase/auth";
import type { Address, User } from "@/lib/types";
import { notificationService } from "./notificationService";

export const userService = {
  async updateProfile(patch: Partial<User>) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    await fetch("/api/update_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: currentUser.uid, patch }),
    });
    return { ok: true, patch };
  },
  async addAddress(addr: Address) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    await fetch("/api/add_address.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: currentUser.uid, address: addr }),
    });
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
