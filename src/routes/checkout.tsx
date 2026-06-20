import { createFileRoute, useRouter, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "@/stores/cart";
import { inr } from "@/lib/format";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { authService } from "@/services/authService";
import type { Address, PaymentMethod, User } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Dharmik" }] }),
  beforeLoad: async () => {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw redirect({ to: "/account", replace: true });
    }
  },
  component: CheckoutPage,
});

function getCheckoutItemImageStyleAndOverlay(color: string) {
  const name = color.toLowerCase();
  let filterStyle = "";
  let overlayElement = null;

  if (name.includes("black") || name.includes("charcoal") || name.includes("midnight") || name.includes("ink")) {
    filterStyle = "brightness(0.35) contrast(1.1) grayscale(0.85)";
  } else if (name.includes("saffron") || name.includes("orange")) {
    filterStyle = "sepia(0.3) saturate(1.25) hue-rotate(-10deg)";
    overlayElement = (
      <div
        className="absolute inset-0 pointer-events-none mix-blend-color opacity-55"
        style={{ backgroundColor: "#FF6B00" }}
      />
    );
  }
  return { filterStyle, overlayElement };
}

function CheckoutPage() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const couponCode = useCart((s) => s.coupon);
  const discount = useCart((s) => s.discount);
  const setCouponStore = useCart((s) => s.setCoupon);
  const clearCoupon = useCart((s) => s.clearCoupon);
  const subtotal = items.reduce((a, x) => a + x.price * x.quantity, 0);
  const [coupon, setCoupon] = useState(couponCode ?? "");
  const [payment, setPayment] = useState<PaymentMethod>("razorpay");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Address>({
    id: "new", fullName: "", line1: "", line2: "", city: "", state: "", pincode: "", phone: "",
  });
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const shipping = subtotal > 1499 ? 0 : 99;
  const total = Math.max(0, subtotal - discount) + shipping;

  async function applyCoupon() {
    const res = await cartService.applyCoupon(coupon, subtotal);
    if (res.valid) {
      setCouponStore(res.code!, res.discount ?? 0);
      toast.success(`Coupon ${res.code} applied`);
    } else {
      toast.error("Invalid coupon");
    }
  }

  useEffect(() => {
    async function loadUser() {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setAuthLoading(false);
    }
    loadUser();
  }, []);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to complete your order.");
      router.navigate({ to: "/account" });
      return;
    }
    setLoading(true);
    const order = await orderService.placeOrder({
      userId: user.id,
      items,
      shippingAddress: form,
      paymentMethod: payment,
      subtotal,
      discount,
      tax: 0,
      total,
    });
    clear();
    setLoading(false);
    toast.success("Order placed");
    router.navigate({ to: "/track", search: { id: order.orderId } as never });
  }

  if (authLoading) {
    return <div className="container-luxe py-24 text-center">Loading authentication...</div>;
  }

  if (!user) {
    return (
      <div className="container-luxe py-24 text-center">
        <h1 className="font-display text-4xl">Sign in to checkout</h1>
        <p className="text-muted-foreground mt-3">You need an account to place an order and track it later.</p>
        <button
          onClick={() => router.navigate({ to: "/account" })}
          className="mt-8 bg-[color:var(--ink)] text-[color:var(--ivory)] px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-[color:var(--saffron)] transition-colors"
        >
          Go to account
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-luxe py-32 text-center">
        <h1 className="font-display text-4xl">Your bag is empty.</h1>
        <p className="text-muted-foreground mt-3">Add something before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl">Checkout</h1>
      <div className="mt-10 grid lg:grid-cols-[1fr_420px] gap-12">
        <form onSubmit={placeOrder} className="space-y-10">
          <Section title="Contact">
            <Input label="Full name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
          </Section>
          <Section title="Shipping address">
            <Input label="Address line 1" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} required />
            <Input label="Address line 2" value={form.line2 ?? ""} onChange={(v) => setForm({ ...form, line2: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
              <Input label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} required />
            </div>
            <Input label="Pincode" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} required />
          </Section>

          <Section title="Payment">
            <div className="space-y-3">
              {[
                { id: "razorpay" as const, label: "Razorpay", sub: "UPI · Cards · Net Banking · Wallets" },
                { id: "cod" as const, label: "Cash on Delivery", sub: "Pay at your doorstep" },
              ].map((p) => (
                <label key={p.id} className={`flex items-start gap-4 p-5 border cursor-pointer transition-colors ${payment === p.id ? "border-[color:var(--saffron)] bg-[color:var(--saffron)]/5" : "border-[color:var(--border)]"}`}>
                  <input type="radio" name="pay" checked={payment === p.id} onChange={() => setPayment(p.id)} className="mt-1 accent-[color:var(--saffron)]" />
                  <div>
                    <p className="font-medium">{p.label}</p>
                    <p className="text-sm text-muted-foreground">{p.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </Section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[color:var(--ink)] text-[color:var(--ivory)] py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-[color:var(--saffron)] transition-colors disabled:opacity-60"
          >
            {loading ? "Placing order…" : `Place order · ${inr(total)}`}
          </button>
        </form>

        <aside className="bg-card border border-[color:var(--border)] p-6 md:p-8 h-fit lg:sticky lg:top-28">
          <p className="eyebrow mb-5">Order summary</p>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {items.map((it) => {
              const { filterStyle, overlayElement } = getCheckoutItemImageStyleAndOverlay(it.color);
              return (
                <div key={it.productId + it.size + it.color} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden bg-muted">
                    <img src={it.image} alt="" className="size-full object-cover" style={{ filter: filterStyle }} loading="lazy" />
                    {overlayElement}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{it.title}</p>
                    <p className="text-xs text-muted-foreground">{it.size} · {it.color} · ×{it.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{inr(it.price * it.quantity)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-2">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="flex-1 border border-[color:var(--border)] px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--saffron)]" />
            <button type="button" onClick={applyCoupon} className="px-4 text-xs uppercase tracking-widest bg-[color:var(--ink)] text-[color:var(--ivory)]">Apply</button>
          </div>
          {couponCode && (
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[color:var(--saffron)]">{couponCode} applied</span>
              <button type="button" onClick={() => { clearCoupon(); setCoupon(""); }} className="uppercase tracking-widest text-muted-foreground hover:text-foreground">Remove</button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t space-y-2 text-sm">
            <Row label="Subtotal" value={inr(subtotal)} />
            {discount > 0 && <Row label="Discount" value={`− ${inr(discount)}`} accent />}
            <Row label="Shipping" value={shipping === 0 ? "Free" : inr(shipping)} />
            <div className="flex justify-between pt-3 border-t font-semibold text-base">
              <span>Total</span><span>{inr(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent border-b border-[color:var(--border)] py-2 focus:outline-none focus:border-[color:var(--saffron)]"
      />
    </label>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "text-[color:var(--saffron)] font-medium" : ""}>{value}</span>
    </div>
  );
}
