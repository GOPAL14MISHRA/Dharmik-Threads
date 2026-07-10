import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "@/stores/cart";
import { inr } from "@/lib/format";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { authService } from "@/services/authService";
import type { Address, PaymentMethod, User } from "@/lib/types";
import { toast } from "sonner";
import { userService } from "@/services/userService";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Dharmik" }] }),
  component: CheckoutPage,
});

function getCheckoutItemImageStyleAndOverlay(color: string) {
  return { filterStyle: "", overlayElement: null };
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
  const [publicCoupons, setPublicCoupons] = useState<any[]>([]);

  function handleSelectCoupon(code: string) {
    setCoupon(code);
    cartService.applyCoupon(code, subtotal).then((res) => {
      if (res.valid) {
        setCouponStore(res.code!, res.discount ?? 0);
        toast.success(`Coupon ${res.code} applied`);
      } else {
        if (res.error === "expired") {
          toast.error("coupon is expired");
        } else {
          toast.error("Invalid coupon");
        }
      }
    });
  }
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Address>({
    id: "new", fullName: "", line1: "", line2: "", city: "", state: "", pincode: "", phone: "",
  });
  const [email, setEmail] = useState("");
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
      if (res.error === "expired") {
        toast.error("coupon is expired");
      } else {
        toast.error("Invalid coupon");
      }
    }
  }

  useEffect(() => {
    async function loadUser() {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setEmail(currentUser.email || "");
        setForm((prev) => ({
          ...prev,
          fullName: currentUser.name || "",
          phone: currentUser.phone || "",
          line1: currentUser.addresses?.[0]?.line1 || "",
          line2: currentUser.addresses?.[0]?.line2 || "",
          city: currentUser.addresses?.[0]?.city || "",
          state: currentUser.addresses?.[0]?.state || "",
          pincode: currentUser.addresses?.[0]?.pincode || "",
        }));
      }
      setAuthLoading(false);
    }
    loadUser();
    
    // Load available coupons
    cartService.getPublicCoupons().then(setPublicCoupons);
  }, []);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const finalUserId = user ? user.id : `guest-${Date.now()}`;
    const finalEmail = email.trim().toLowerCase();

    if (!finalEmail || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(finalEmail)) {
      toast.error("Email address must be a valid email containing @gmail.com");
      setLoading(false);
      return;
    }

    let cleanPhone = form.phone.replace(/\D/g, "");
    if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
      cleanPhone = cleanPhone.slice(2);
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith("0")) {
      cleanPhone = cleanPhone.slice(1);
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error("Mobile number must be exactly 10 digits and the first digit of mobile number should be greater than 5");
      setLoading(false);
      return;
    }

    if (payment === "razorpay") {
      alert("Currently Razorpay is not working, only Cash on Delivery is working. When I add Razorpay, we will enable this option too.");
      setLoading(false);
      return;
    }

    try {
      if (user) {
        try {
          await userService.updateProfile({ phone: cleanPhone });
        } catch (profileErr) {
          console.error("Failed to update user profile phone number during checkout:", profileErr);
        }
      }

      const order = await orderService.placeOrder({
        userId: finalUserId,
        items,
        shippingAddress: {
          ...form,
          phone: cleanPhone,
          email: finalEmail,
        } as any,
        paymentMethod: payment,
        subtotal,
        discount,
        tax: 0,
        total,
      });

      // For guest checkout: write their email to localStorage for notifications drawer automatic mapping
      if (!user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("dharmik_subscribed_email", finalEmail);
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("dharmik_subscription_change"));
        }
      }

      clear();
      setLoading(false);
      toast.success("Order placed successfully");
      router.navigate({ to: "/track", search: { id: order.orderId } as never });
    } catch (err: any) {
      console.error(err);
      const cleanMessage = (err.message || "Failed to place order")
        .replace(/firebase/gi, "Database")
        .replace(/firestore/gi, "Database");
      toast.error(cleanMessage);
      setLoading(false);
    }
  }

  if (authLoading) {
    return <div className="container-luxe py-24 text-center">Loading authentication...</div>;
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
      <form onSubmit={placeOrder} className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">
        {/* Form Fields Column */}
        <div className="w-full max-w-md mx-auto lg:max-w-none space-y-10 order-2 lg:order-1">
          <Section title="Contact">
            <Input label="Full name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
            <Input label="Email address" value={email} onChange={setEmail} required type="email" />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(v) => {
                let clean = v.replace(/\D/g, "");
                if (clean.length > 10) {
                  if (clean.length === 12 && clean.startsWith("91")) {
                    clean = clean.slice(2);
                  } else if (clean.length === 11 && clean.startsWith("0")) {
                    clean = clean.slice(1);
                  }
                }
                if (clean.length > 0 && !/^[6-9]/.test(clean)) {
                  clean = "";
                }
                clean = clean.slice(0, 10);
                setForm({ ...form, phone: clean });
              }}
              required
              type="tel"
              maxLength={10}
              pattern="[6-9][0-9]{9}"
              placeholder="10-digit mobile number"
            />
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
            className="w-full bg-[color:var(--ink)] text-[color:var(--ivory)] py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-[color:var(--saffron)] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Placing order…" : `Place order · ${inr(total)}`}
          </button>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="w-full max-w-md mx-auto lg:max-w-none bg-card border border-[color:var(--border)] p-6 md:p-8 h-fit lg:sticky lg:top-28 order-1 lg:order-2">
          <p className="eyebrow mb-5">Order summary</p>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {items.map((it) => {
              const { filterStyle, overlayElement } = getCheckoutItemImageStyleAndOverlay(it.color);
              return (
                <div key={it.productId + it.size + it.color} className="flex gap-3 items-center">
                  <div className="relative size-16 shrink-0 overflow-hidden bg-muted">
                    <img src={it.image} alt="" className="size-full object-cover" style={{ filter: filterStyle }} loading="lazy" />
                    {overlayElement}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{it.title}</p>
                    <p className="text-xs text-muted-foreground">{it.size} · {it.color} · ×{it.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">{inr(it.price * it.quantity)}</p>
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

          {publicCoupons.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2.5">Available Offers</p>
              <div className="space-y-2">
                {publicCoupons.map((c) => {
                  const isCurrent = couponCode === c.code;
                  return (
                    <div
                      key={c.code}
                      onClick={() => handleSelectCoupon(c.code)}
                      className={`group p-3 border rounded-lg transition-all duration-300 flex items-center justify-between cursor-pointer text-left ${
                        isCurrent
                          ? "border-[color:var(--saffron)] bg-[color:var(--saffron)]/[0.03]"
                          : "border-[color:var(--border)] hover:border-stone-400 bg-stone-50/30 hover:bg-stone-50"
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 border rounded ${
                            isCurrent
                              ? "bg-[color:var(--saffron)] text-white border-[color:var(--saffron)]"
                              : "bg-white text-stone-750 border-stone-200 group-hover:border-stone-300"
                          }`}>
                            {c.code}
                          </span>
                          {c.discountPct > 0 && (
                            <span className="text-[10px] font-bold text-[color:var(--saffron)]">
                              {c.discountPct}% OFF
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5 leading-snug truncate">{c.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCoupon(c.code);
                        }}
                        className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-250"
                            : "bg-[color:var(--ink)] text-[color:var(--ivory)] hover:bg-[color:var(--saffron)]"
                        }`}
                      >
                        {isCurrent ? "Applied" : "Apply"}
                      </button>
                    </div>
                  );
                })}
              </div>
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
      </form>
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

function Input({
  label,
  value,
  onChange,
  required,
  type = "text",
  disabled,
  maxLength,
  pattern,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  maxLength?: number;
  pattern?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        pattern={pattern}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent border-b border-[color:var(--border)] py-2 focus:outline-none focus:border-[color:var(--saffron)] disabled:opacity-50"
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
