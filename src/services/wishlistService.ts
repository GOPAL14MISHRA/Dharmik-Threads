// Wishlist Service

export const wishlistService = {
  async sync(userId: string, productIds: string[]) {
    await fetch("/api/sync_wishlist.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productIds }),
    });
    return { userId, productIds };
  },

  async fetch(userId: string): Promise<string[]> {
    const res = await fetch(`/api/get_wishlist.php?uid=${userId}`);
    if (!res.ok) return [];
    return await res.json();
  },
};
