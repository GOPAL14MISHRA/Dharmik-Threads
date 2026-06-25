import { products as seedProducts } from "@/lib/data/products";
import type { Product, Order, OrderStatus } from "@/lib/types";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import { notificationService } from "@/services/notificationService";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedAt: string;
  orders: number;
  spent: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountPct: number;
  expires: string;
  uses: number;
  active: boolean;
  isPublic?: boolean;
}

interface AdminState {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  subscribers: any[];
}

const ORDER_STATUSES: OrderStatus[] = ["placed", "packed", "shipped", "out-for-delivery", "delivered"];

// Initialize local store state
let state: AdminState = {
  products: [],
  orders: [],
  customers: [],
  coupons: [],
  subscribers: [],
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

let registeredUsers: any[] = [];

// Rebuild customer records in real-time by combining registered users and order histories
function rebuildCustomers() {
  const customerMap = new Map<string, Customer>();

  // 1. Map registered users
  registeredUsers.forEach((u) => {
    customerMap.set(u.email.toLowerCase(), {
      id: u.uid || u.id,
      name: u.name || "N/A",
      email: u.email,
      phone: u.phone || "—",
      city: u.addresses?.[0]?.city || "—",
      joinedAt: u.createdAt?.toDate 
        ? u.createdAt.toDate().toISOString() 
        : u.createdAt 
          ? new Date(u.createdAt).toISOString()
          : new Date().toISOString(),
      orders: 0,
      spent: 0,
    });
  });

  // 2. Accumulate order metrics
  state.orders.forEach((o) => {
    const emailKey = o.shippingAddress.fullName.toLowerCase().replace(/\s/g, ".") + "@gmail.com";
    const userEmail = o.userId ? (registeredUsers.find((u) => (u.uid || u.id) === o.userId)?.email) : null;
    const lookupKey = (userEmail || o.shippingAddress.email || emailKey).toLowerCase();

    const existing = customerMap.get(lookupKey);
    if (existing) {
      existing.orders += 1;
      existing.spent += o.total;
      if (o.shippingAddress.city && existing.city === "—") {
        existing.city = o.shippingAddress.city;
      }
    } else {
      customerMap.set(lookupKey, {
        id: o.userId || `guest-${o.orderId}`,
        name: o.shippingAddress.fullName,
        email: o.shippingAddress.email || lookupKey,
        phone: o.shippingAddress.phone,
        city: o.shippingAddress.city,
        joinedAt: o.placedAt || new Date().toISOString(),
        orders: 1,
        spent: o.total,
      });
    }
  });

  state.customers = Array.from(customerMap.values());
  notify();
}

// Setup live observers on client
if (typeof window !== "undefined") {
  // Listen to Products
  onSnapshot(collection(db, "products"), (snapshot) => {
    state.products = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return { id: docSnapshot.id, ...data } as Product;
    });
    notify();
  });

  // Listen to Orders
  onSnapshot(collection(db, "orders"), (snapshot) => {
    state.orders = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      let placedAt = "";
      if (data.createdAt) {
        if (data.placedAt) {
          placedAt = data.placedAt;
        } else if (data.createdAt.toDate) {
          placedAt = data.createdAt.toDate().toISOString();
        } else if (data.createdAt.seconds) {
          placedAt = new Date(data.createdAt.seconds * 1000).toISOString();
        } else {
          placedAt = new Date(data.createdAt).toISOString();
        }
      } else {
        placedAt = new Date().toISOString();
      }
      return {
        ...data,
        orderId: docSnapshot.id,
        placedAt,
      } as unknown as Order;
    }).sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
    rebuildCustomers();
  });

  // Listen to Coupons
  onSnapshot(collection(db, "coupons"), (snapshot) => {
    state.coupons = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        code: docSnapshot.id,
        description: data.description || "",
        discountPct: data.discountValue || data.discountPct || 10,
        expires: data.expiryDate || data.expires || "",
        uses: data.uses || 0,
        active: data.active !== false,
        isPublic: data.isPublic !== false,
      } as Coupon;
    });
    notify();
  });

  // Listen to Registered Users
  onSnapshot(collection(db, "users"), (snapshot) => {
    registeredUsers = snapshot.docs.map((docSnapshot) => ({
      uid: docSnapshot.id,
      ...docSnapshot.data(),
    }));
    rebuildCustomers();
  });

  // Listen to Newsletter Subscribers
  onSnapshot(collection(db, "newsletter"), (snapshot) => {
    state.subscribers = snapshot.docs.map((docSnapshot) => ({
      email: docSnapshot.id,
      ...docSnapshot.data(),
    }));
    notify();
  });
}

function seedCoupons(): Coupon[] {
  return [
    { code: "DHARMA10", description: "10% off your next order", discountPct: 10, expires: "2026-12-31", uses: 142, active: true, isPublic: true },
    { code: "OMSHANTI", description: "Free shipping on ₹1499+", discountPct: 0, expires: "2026-09-30", uses: 89, active: true, isPublic: true },
    { code: "MAHADEV15", description: "15% off Mahadev collection", discountPct: 15, expires: "2026-08-15", uses: 56, active: true, isPublic: false },
    { code: "DIWALI25", description: "25% off festival drop", discountPct: 25, expires: "2026-11-10", uses: 0, active: false, isPublic: true },
  ];
}

export const adminStore = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  getState() {
    return state;
  },

  // Products
  async addProduct(p: Product) {
    try {
      const productRef = doc(db, "products", p.id);
      await setDoc(productRef, p);
      toast.success(`Product "${p.title}" saved to database.`);
      
      // Dispatch subscriber notifications
      toast.promise(
        notificationService.notifyNewProduct({
          id: p.id,
          title: p.title,
          description: p.description,
          slug: p.slug
        }),
        {
          loading: "Sending exciting notifications to subscribed users...",
          success: "Subscribers successfully notified! 🎉",
          error: "Failed to notify subscribers.",
        }
      );
    } catch (error: any) {
      console.error("Error writing product to Firestore:", error);
      toast.error(`Database Error: ${error.message}`);
    }
  },
  async updateProduct(id: string, patch: Partial<Product>) {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, patch);
      toast.success("Product updated in database.");
    } catch (error: any) {
      console.error("Error updating product in Firestore:", error);
      toast.error(`Database Error: ${error.message}`);
    }
  },
  async deleteProduct(id: string) {
    try {
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);
      toast.success("Product deleted from database.");
    } catch (error: any) {
      console.error("Error deleting product from Firestore:", error);
      toast.error(`Database Error: ${error.message}`);
    }
  },

  // Orders
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { orderStatus: status });
      toast.success(`Order #${orderId} status set to ${status} in database.`);
    } catch (error: any) {
      console.error("Error updating order status in Firestore:", error);
      toast.error(`Database Error: ${error.message}`);
    }
  },

  // Coupons
  async addCoupon(c: Coupon) {
    try {
      const couponRef = doc(db, "coupons", c.code.toUpperCase());
      // Save in the exact schema that cartService.ts uses to verify coupons
      await setDoc(couponRef, {
        code: c.code.toUpperCase(),
        description: c.description,
        discountType: "percent",
        discountValue: c.discountPct,
        expiryDate: c.expires,
        minOrderAmount: 0,
        uses: c.uses,
        active: c.active,
        isPublic: c.isPublic ?? true,
      });
      toast.success(`Coupon "${c.code}" saved to database.`);
    } catch (error: any) {
      console.error("Error writing coupon to Firestore:", error);
      toast.error(`Database Error: ${error.message}`);
    }
  },
  async toggleCoupon(code: string) {
    try {
      const existing = state.coupons.find((c) => c.code === code);
      if (existing) {
        const couponRef = doc(db, "coupons", code);
        await updateDoc(couponRef, { active: !existing.active });
        toast.success(`Coupon ${code} status toggled in database.`);
      }
    } catch (error: any) {
      console.error("Error toggling coupon in Firestore:", error);
      toast.error(`Database Error: ${error.message}`);
    }
  },
  async toggleCouponPublic(code: string) {
    try {
      const existing = state.coupons.find((c) => c.code === code);
      if (existing) {
        const couponRef = doc(db, "coupons", code);
        await updateDoc(couponRef, { isPublic: !existing.isPublic });
        toast.success(`Coupon ${code} target group updated in database.`);
      }
    } catch (error: any) {
      console.error("Error toggling coupon public status in Firestore:", error);
      toast.error(`Database Error: ${error.message}`);
    }
  },
  async deleteCoupon(code: string) {
    try {
      const couponRef = doc(db, "coupons", code);
      await deleteDoc(couponRef);
      toast.success("Coupon removed from database.");
    } catch (error: any) {
      console.error("Error deleting coupon from Firestore:", error);
      toast.error(`Database Error: ${error.message}`);
    }
  },

  // Reset/Seeding
  async reset() {
    try {
      toast.info("Reseeding catalog to database...");
      // Upload default products
      for (const p of seedProducts) {
        await setDoc(doc(db, "products", p.id), p);
      }
      // Upload default coupons
      for (const cp of seedCoupons()) {
        await setDoc(doc(db, "coupons", cp.code), {
          code: cp.code,
          description: cp.description,
          discountType: "percent",
          discountValue: cp.discountPct,
          expiryDate: cp.expires,
          minOrderAmount: 0,
          uses: cp.uses,
          active: cp.active,
          isPublic: cp.isPublic ?? true,
        });
      }
      toast.success("Database re-seeded with demo data successfully.");
    } catch (error: any) {
      console.error("Error seeding Firestore demo data:", error);
      toast.error(`Database Seed Error: ${error.message}`);
    }
  },
};

export const ORDER_STATUS_LIST = ORDER_STATUSES;
