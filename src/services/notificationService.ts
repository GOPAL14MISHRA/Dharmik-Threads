// Notification Service

export interface NotificationEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: "subscription" | "new-product" | "new-blog";
  targetTitle?: string;
  targetSlug?: string;
  sentAt: string;
}

export const notificationService = {
  // Send real email directly using FormSubmit free AJAX endpoint
  async sendDirectEmail(to: string, subject: string, body: string) {
    try {
      console.log(`Sending real email directly to: ${to}`);
      const response = await fetch(`https://formsubmit.co/ajax/${to}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: "Dharmik Threads",
          _subject: subject,
          message: body,
          _captcha: "false"
        }),
      });
      const result = await response.json();
      console.log(`Direct email response for ${to}:`, result);
    } catch (err) {
      console.error(`Failed to send direct email to ${to}:`, err);
    }
  },

  // Notify all subscribers about a new product
  async notifyNewProduct(product: { id: string; title: string; description: string; slug: string }) {
    try {
      const res = await fetch("/api/get_newsletter_subscribers.php");
      const subscribers = res.ok ? await res.json() : [];
      const emails = subscribers.map((s: any) => s.email.trim().toLowerCase());
      
      console.log(`Sending new product notifications to:`, emails);
      
      for (const email of emails) {
        if (!email) continue;
        const cleanEmail = email.replace(/[^a-z0-9]/g, "_");
        const notifId = `prod-${product.id}-${cleanEmail}`;
        const subject = `🔥 NEW DROP: The Sacred "${product.title}" is Here! 🙏`;
        const body = `Pranams! 🙏\n\nWe are overjoyed to announce a new addition to the Dharmik Threads collection:\n\n✨ "${product.title}" ✨\n\n${product.description || "A premium heritage garment crafted with deep reverence and artistic devotion."}\n\nBe the first to experience this sacred creation.\n\n👉 Shop now: https://dharmik-threads.web.app/product/${product.slug}\n\nMay your day be filled with peace, devotion, and style.\n\nWarm regards,\nThe Dharmik Threads Team 🌸`;

        await fetch("/api/save_sent_email.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: notifId,
            to: email,
            subject,
            body,
            type: "new-product",
            targetTitle: product.title,
            targetSlug: product.slug,
            sentAt: new Date().toISOString(),
          }),
        });

        // Send direct email to user
        await this.sendDirectEmail(email, subject, body);
      }
    } catch (err) {
      console.error("Error in notifyNewProduct:", err);
      throw err;
    }
  },

  // Notify all subscribers about a new blog article
  async notifyNewBlog(blog: { id: string; title: string; category: string; readTime: string; slug: string; excerpt?: string }) {
    try {
      const res = await fetch("/api/get_newsletter_subscribers.php");
      const subscribers = res.ok ? await res.json() : [];
      const emails = subscribers.map((s: any) => s.email.trim().toLowerCase());

      console.log(`Sending new blog notifications to:`, emails);

      for (const email of emails) {
        if (!email) continue;
        const cleanEmail = email.replace(/[^a-z0-9]/g, "_");
        const notifId = `blog-${blog.id}-${cleanEmail}`;
        const subject = `New Blog Post: ${blog.title}`;
        const body = `A new article has been published on the Dharmik Blog:\n\n"${blog.title}"\nCategory: ${blog.category} · ${blog.readTime}\n\n${blog.excerpt || "Dive deep into the wisdom and artistic traditions behind our sacred apparel designs."}\n\nRead the full story on our blog.`;

        await fetch("/api/save_sent_email.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: notifId,
            to: email,
            subject,
            body,
            type: "new-blog",
            targetTitle: blog.title,
            targetSlug: blog.slug,
            sentAt: new Date().toISOString(),
          }),
        });

        // Send direct email to user
        await this.sendDirectEmail(email, subject, body);
      }
    } catch (err) {
      console.error("Error in notifyNewBlog:", err);
    }
  },

  // Fetch notifications for a given email address
  async getNotifications(email: string): Promise<NotificationEmail[]> {
    try {
      const q = email.trim().toLowerCase();
      if (!q) return [];
      const res = await fetch(`/api/get_notifications.php?email=${encodeURIComponent(q)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error("Error fetching notifications:", err);
      return [];
    }
  },
};
