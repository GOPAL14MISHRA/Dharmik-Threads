import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Check, Package, Truck, Home, ArrowLeft } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { orderService } from "@/services/orderService";
import type { Order } from "@/lib/types";
import { inr } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/track")({
  validateSearch: (s) => ({ id: typeof s.id === "string" ? s.id : "" }),
  head: () => ({ meta: [{ title: "Track Order — Dharmik" }] }),
  component: TrackPage,
});

const STAGES = [
  { label: "Order Placed", statusKey: "placed", icon: Check },
  { label: "Packed", statusKey: "packed", icon: Package },
  { label: "Shipped", statusKey: "shipped", icon: Truck },
  { label: "Out for Delivery", statusKey: "out-for-delivery", icon: Truck },
  { label: "Delivered", statusKey: "delivered", icon: Home },
];

function TrackPage() {
  const { id } = Route.useSearch();
  const router = useRouter();
  const [orderId, setOrderId] = useState(id || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTrack(searchId: string) {
    const cleanId = searchId.trim().toUpperCase();
    if (!cleanId) return;

    setLoading(true);
    setError(null);
    setOrder(null);
    
    // Update the search param in URL
    router.navigate({ to: "/track", search: { id: cleanId } });

    try {
      const res = await orderService.getOrder(cleanId);
      if (res) {
        setOrder(res);
      } else {
        setError("Order not found. Please verify your Order ID (e.g. DT12345678) and try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError("An error occurred while tracking. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-run tracking if search parameter exists in URL on mount
  useEffect(() => {
    if (id) {
      handleTrack(id);
    }
  }, [id]);

  return (
    <div className="container-luxe py-16 md:py-24 max-w-3xl">
      <p className="eyebrow text-[color:var(--saffron)]">Track</p>
      <h1 className="font-display text-5xl mt-3">Where is your order?</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTrack(orderId);
        }}
        className="mt-10 flex gap-3"
      >
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID (e.g. DT12345678)"
          required
          className="flex-1 border border-[color:var(--border)] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[color:var(--ink)] text-[color:var(--ivory)] px-8 text-xs uppercase tracking-widest hover:bg-[color:var(--saffron)] transition-colors cursor-pointer disabled:opacity-55"
        >
          {loading ? "Tracking..." : "Track"}
        </button>
      </form>

      {loading && (
        <div className="mt-12 text-center py-10 bg-white border border-[color:var(--border)] rounded-2xl shadow-sm">
          <p className="text-sm text-muted-foreground animate-pulse">Retrieving tracking details...</p>
        </div>
      )}

      {error && (
        <div className="mt-12 border border-red-200 bg-red-50/30 p-6 rounded-2xl text-center text-red-600 text-sm font-semibold leading-relaxed">
          {error}
        </div>
      )}

      {order && !loading && (
        <div className="mt-12 bg-white border border-[color:var(--border)] p-6 md:p-8 rounded-2xl shadow-sm space-y-8 animate-fade-in text-foreground">
          {/* Header summary */}
          <div className="flex flex-wrap justify-between items-start gap-4 pb-6 border-b border-[color:var(--border)]">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Order Details</p>
              <p className="font-display text-2xl font-bold mt-1 text-stone-850">{order.orderId}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) : "Recently"}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Status</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                order.orderStatus === "delivered" 
                  ? "bg-emerald-50 text-emerald-650"
                  : order.orderStatus === "placed"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-amber-50 text-amber-600"
              }`}>
                {order.orderStatus.replace(/-/g, " ")}
              </span>
              {order.trackingNumber && (
                <p className="text-[11px] text-muted-foreground mt-2">Tracking ID: <span className="font-mono font-semibold text-stone-700">{order.trackingNumber}</span></p>
              )}
            </div>
          </div>

          {/* Progress Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Delivery Timeline</h3>
            <div className="relative pl-6 md:pl-0 md:flex md:justify-between md:items-start gap-4">
              {/* Vertical line for mobile */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[color:var(--border)] md:hidden" />
              
              {STAGES.map((stage, i) => {
                const statusOrder = ["placed", "packed", "shipped", "out-for-delivery", "delivered"];
                const activeIndex = statusOrder.indexOf(order.orderStatus);
                const done = i <= activeIndex;
                const Icon = stage.icon;

                return (
                  <div key={stage.label} className="relative flex items-center gap-4 md:flex-col md:text-center md:gap-2 mb-6 last:mb-0 md:mb-0 md:flex-1">
                    {/* Circle Indicator */}
                    <div className={`relative z-10 size-10 rounded-full grid place-items-center border-2 transition-all duration-300 ${
                      done 
                        ? "bg-[color:var(--saffron)] border-[color:var(--saffron)] text-white shadow-md shadow-[color:var(--saffron)]/10" 
                        : "bg-white border-[color:var(--border)] text-muted-foreground"
                    }`}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${done ? "text-stone-850" : "text-muted-foreground"}`}>{stage.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase tracking-wider">{done ? "Completed" : "Pending"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-[color:var(--border)]">
            {/* Delivery Address */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Delivery Address</h4>
              <div className="text-sm leading-relaxed text-stone-700 font-medium">
                <p className="font-semibold text-stone-850 text-base">{order.shippingAddress.fullName}</p>
                <p className="mt-1">{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p className="mt-2 text-xs text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Payment Details</h4>
              <div className="text-sm bg-stone-50 border border-[color:var(--border)] rounded-xl p-4.5 space-y-2.5">
                <div className="flex justify-between items-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  <span>Method</span>
                  <span className="text-stone-850 font-semibold">{order.paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Prepaid (Razorpay)"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-medium">{inr(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-650 font-medium">
                    <span>Discount</span>
                    <span>-{inr(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Tax</span>
                  <span className="font-medium">{inr(order.tax || 0)}</span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-[color:var(--border)] font-semibold text-stone-855 text-base">
                  <span>Total</span>
                  <span className="text-[color:var(--saffron)] font-bold">{inr(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items list */}
          <div className="pt-8 border-t border-[color:var(--border)] space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Items in this order</h4>
            <div className="divide-y divide-[color:var(--border)]">
              {order.items.map((item) => (
                <div key={item.variantId + "-" + item.size} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <img src={item.image} alt={item.title} className="size-16 object-cover rounded-lg border border-[color:var(--border)] bg-stone-50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-sm truncate text-stone-850">{item.title}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">Variant: {item.color} · Size: {item.size}</p>
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm text-stone-800">{inr(item.price * item.quantity)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.quantity} x {inr(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
