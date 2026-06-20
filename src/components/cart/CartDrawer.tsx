import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/stores/cart";
import { useUI } from "@/stores/ui";
import { inr } from "@/lib/format";
import { cartService } from "@/services/cartService";

function getCartItemImageStyleAndOverlay(color: string) {
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

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const coupon = useCart((s) => s.coupon);
  const discount = useCart((s) => s.discount);
  const setCoupon = useCart((s) => s.setCoupon);
  const clearCoupon = useCart((s) => s.clearCoupon);
  const subtotal = items.reduce((a, x) => a + x.price * x.quantity, 0);
  const [code, setCode] = useState(coupon ?? "");
  const total = Math.max(0, subtotal - discount);

  async function apply() {
    if (!code.trim()) return;
    const res = await cartService.applyCoupon(code, subtotal);
    if (res.valid) {
      setCoupon(res.code!, res.discount ?? 0);
      toast.success(`Coupon ${res.code} applied`);
    } else {
      toast.error("Invalid coupon");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed top-0 right-0 z-[80] h-dvh w-full sm:w-[440px] bg-[color:var(--ivory)] text-foreground shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border)]">
              <p className="font-display text-2xl">Your Bag <span className="text-sm text-muted-foreground">({items.length})</span></p>
              <button aria-label="Close" onClick={() => setOpen(false)} className="p-2"><X className="size-5" /></button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 grid place-items-center text-center px-8">
                <div>
                  <p className="font-display text-3xl">Your bag is empty.</p>
                  <p className="text-sm text-muted-foreground mt-2">Begin your journey through the Dharma collection.</p>
                  <Link
                    to="/shop"
                    onClick={() => setOpen(false)}
                    className="inline-block mt-6 bg-[color:var(--ink)] text-[color:var(--ivory)] px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[color:var(--saffron)] transition-colors"
                  >
                    Shop now
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                  {items.map((it) => {
                    const { filterStyle, overlayElement } = getCartItemImageStyleAndOverlay(it.color);
                    return (
                      <div key={it.productId + it.size + it.color} className="flex gap-4">
                        <div className="relative size-24 shrink-0 overflow-hidden rounded-sm bg-muted">
                          <img src={it.image} alt={it.title} className="size-full object-cover" style={{ filter: filterStyle }} loading="lazy" />
                          {overlayElement}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{it.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{it.size} · {it.color}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center border border-[color:var(--border)]">
                              <button aria-label="Decrease" onClick={() => setQty(it.productId, it.size, it.color, it.quantity - 1)} className="p-1.5 hover:bg-muted"><Minus className="size-3" /></button>
                              <span className="px-3 text-sm">{it.quantity}</span>
                              <button aria-label="Increase" onClick={() => setQty(it.productId, it.size, it.color, it.quantity + 1)} className="p-1.5 hover:bg-muted"><Plus className="size-3" /></button>
                            </div>
                            <p className="font-semibold text-sm">{inr(it.price * it.quantity)}</p>
                          </div>
                          <button onClick={() => remove(it.productId, it.size, it.color)} className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-[color:var(--saffron)] mt-2">Remove</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[color:var(--border)] px-6 py-5 space-y-4">
                  <div>
                    <div className="flex gap-2">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Coupon code"
                        className="flex-1 border border-[color:var(--border)] px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--saffron)] bg-transparent"
                      />
                      <button type="button" onClick={apply} className="px-4 text-[11px] uppercase tracking-widest bg-[color:var(--ink)] text-[color:var(--ivory)] hover:bg-[color:var(--saffron)] transition-colors">Apply</button>
                    </div>
                    {coupon && (
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-[color:var(--saffron)]">{coupon} applied · −{inr(discount)}</span>
                        <button type="button" onClick={() => { clearCoupon(); setCode(""); }} className="uppercase tracking-widest text-muted-foreground hover:text-foreground">Remove</button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{inr(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="text-[color:var(--saffron)]">−{inr(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-1">
                      <span>Total</span>
                      <span>{inr(total)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Shipping &amp; taxes calculated at checkout.</p>
                  <Link
                    to="/checkout"
                    onClick={() => setOpen(false)}
                    className="block text-center bg-[color:var(--ink)] text-[color:var(--ivory)] py-4 text-xs uppercase tracking-[0.25em] hover:bg-[color:var(--saffron)] transition-colors"
                  >
                    Checkout — {inr(total)}
                  </Link>
                  <button onClick={() => setOpen(false)} className="w-full text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
