import { createFileRoute } from "@tanstack/react-router";
import { Check, Package, Truck, Home } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/track")({
  validateSearch: (s) => ({ id: typeof s.id === "string" ? s.id : "" }),
  head: () => ({ meta: [{ title: "Track Order — Dharmik" }] }),
  component: TrackPage,
});

const STAGES = [
  { label: "Order placed", icon: Check },
  { label: "Packed", icon: Package },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: Home },
];

function TrackPage() {
  const { id } = Route.useSearch();
  const [orderId, setOrderId] = useState(id || "");
  const [current] = useState(1); // mock stage

  return (
    <div className="container-luxe py-16 md:py-24 max-w-3xl">
      <p className="eyebrow text-[color:var(--saffron)]">Track</p>
      <h1 className="font-display text-5xl mt-3">Where is your order?</h1>

      <div className="mt-10 flex gap-3">
        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID (e.g. DT12345678)" className="flex-1 border border-[color:var(--border)] px-4 py-3 focus:outline-none focus:border-[color:var(--saffron)]" />
        <button className="bg-[color:var(--ink)] text-[color:var(--ivory)] px-8 text-xs uppercase tracking-widest">Track</button>
      </div>

      {orderId && (
        <div className="mt-12 bg-card border border-[color:var(--border)] p-8">
          <p className="text-sm text-muted-foreground">Order</p>
          <p className="font-display text-2xl">{orderId}</p>
          <div className="mt-10 relative">
            <div className="absolute left-5 top-5 bottom-5 w-px bg-[color:var(--border)]" />
            <div className="space-y-8">
              {STAGES.map((s, i) => {
                const done = i <= current;
                const Icon = s.icon;
                return (
                  <div key={s.label} className="relative flex items-start gap-5">
                    <div className={`relative z-10 size-10 rounded-full grid place-items-center border-2 ${done ? "bg-[color:var(--saffron)] border-[color:var(--saffron)] text-white" : "bg-background border-[color:var(--border)] text-muted-foreground"}`}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className={`font-medium ${done ? "" : "text-muted-foreground"}`}>{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{done ? "Completed" : "Pending"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
