import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { authService } from "@/services/authService";
import { orderService } from "@/services/orderService";
import type { Order, User } from "@/lib/types";
import { toast } from "sonner";
import {
  User as UserIcon,
  Package,
  Settings,
  Ticket,
  LifeBuoy,
  MapPin,
  LogOut,
  Copy,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Dharmik" }] }),
  component: AccountPage,
});

type TabKey = "profile" | "orders" | "coupons" | "settings" | "support";

const NAV: { key: TabKey; label: string; icon: typeof UserIcon }[] = [
  { key: "profile", label: "Account", icon: UserIcon },
  { key: "orders", label: "Orders", icon: Package },
  { key: "coupons", label: "Coupons", icon: Ticket },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "support", label: "Support", icon: LifeBuoy },
];

const COUPONS = [
  { code: "DHARMA10", desc: "10% off your next order", expires: "Dec 31, 2026", tone: "saffron" },
  { code: "OMSHANTI", desc: "Free shipping on orders ₹1,499+", expires: "Sep 30, 2026", tone: "ink" },
  { code: "MAHADEV15", desc: "15% off Mahadev collection", expires: "Aug 15, 2026", tone: "saffron" },
];

function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<TabKey>("profile");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const u = await authService.getCurrentUser();
      setUser(u);
      if (u) {
        const orders = await orderService.getOrders(u.id);
        setOrders(orders);
      }
    }
    loadUser();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = mode === "login"
        ? await authService.login(email, password)
        : await authService.signup(name, email, password, phone);
      setUser(res.user);
      const orders = await orderService.getOrders(res.user.id);
      setOrders(orders);
      toast.success(`Welcome${res.user.name ? ", " + res.user.name.split(" ")[0] : ""}.`);
      if (mode === "signup") {
        // Ensure the user is shown their profile after creating an account
        router.navigate({ to: "/account" });
        setTab("profile");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const code = err?.code as string | undefined;
      let message = err?.message || "Login failed";
      if (code) {
        switch (code) {
          case 'auth/email-already-in-use':
            message = 'An account with this email already exists. Try signing in.';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            message = 'Password is too weak. Use at least 6 characters.';
            break;
          case 'auth/wrong-password':
            message = 'Incorrect password.';
            break;
          case 'auth/user-not-found':
            message = 'No account found with this email.';
            break;
          default:
            message = `${code} — ${message}`;
        }
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function loginWithGoogle() {
    try {
      setGoogleLoading(true);
      setLoading(true);
      const res = await authService.googleLogin();
      setUser(res.user);
      const orders = await orderService.getOrders(res.user.id);
      setOrders(orders);
      toast.success(`Welcome${res.user.name ? ", " + res.user.name.split(" ")[0] : ""}.`);
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorMessage = error.code 
        ? `Firebase Error: ${error.code} - ${error.message}`
        : error.message || "Google login failed";
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
      setLoading(false);
    }
  }

  async function logout() {
    await authService.logout();
    setUser(null);
    toast.success("Signed out");
  }

  const initials = useMemo(
    () => (user?.name ?? "").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
    [user?.name],
  );

  if (loading) {
    return (
      <div className="container-luxe py-24 grid place-items-center max-w-4xl">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!user) {
    if (mode === "signup" || mode === "login") {
      return (
        <div className="min-h-[70vh] flex items-center justify-between py-20 px-6 lg:px-20 gap-10 lg:gap-20 relative overflow-hidden">
          {/* Ambient brand glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 top-1/4 w-96 h-96 bg-gradient-to-br from-[color:var(--saffron)]/15 via-[color:var(--gold)]/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute right-1/3 bottom-1/4 w-80 h-80 bg-gradient-to-tr from-[color:var(--saffron)]/10 to-transparent rounded-full blur-3xl" />
          </div>

          <AuthVisualPanel />

          {/* Auth Card */}
          <div className="w-full max-w-md bg-white/90 backdrop-blur p-8 rounded-lg shadow-glow border border-[color:var(--border)] relative z-10 shrink-0">
            <h2 className="font-display text-xl text-center">{mode === "signup" ? "Create your account" : "Sign in"}</h2>
            <p className="text-sm text-muted-foreground text-center mt-2">{mode === "signup" ? "Welcome! Please fill in the details to get started." : "Welcome back! Please sign in to continue."}</p>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={googleLoading || loading}
                className="w-full bg-white border border-[color:var(--border)] text-[color:var(--ink)] py-3 text-sm rounded-md hover:bg-gray-50 flex items-center justify-center gap-3"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>{googleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>

              <div className="relative flex items-center gap-4 mt-2">
                <div className="flex-1 border-t border-[color:var(--border)]" />
                <span className="text-[11px] text-muted-foreground uppercase tracking-widest mx-3">or</span>
                <div className="flex-1 border-t border-[color:var(--border)]" />
              </div>

              <form onSubmit={submit} className="space-y-4 mt-4">
                <Input label="Email address" value={email} onChange={setEmail} type="email" required disabled={loading} />
                <Input label="Password" value={password} onChange={setPassword} type="password" required disabled={loading} />
                <button type="submit" disabled={loading} aria-busy={loading} className="w-full bg-[color:var(--ink)] text-[color:var(--ivory)] py-3 text-sm rounded-md hover:bg-[color:var(--saffron)] transition-colors disabled:opacity-60">{mode === "signup" ? "Create account" : "Sign in"}</button>
              </form>

              <div className="text-center text-sm text-muted-foreground mt-4">
                {mode === "signup" ? (
                  <>Already have an account? <button onClick={() => setMode('login')} className="text-[color:var(--ink)] hover:underline">Sign in</button></>
                ) : (
                  <>New here? <button onClick={() => setMode('signup')} className="text-[color:var(--ink)] hover:underline">Create an account</button></>
                )}
              </div>
            </div>

          </div>
        </div>
      );
    }

    return (
      <div className="container-luxe py-24 grid lg:grid-cols-[38%_62%] gap-16 max-w-5xl">
        <div>
          <p className="eyebrow text-[color:var(--saffron)]">{mode === "login" ? "Welcome back" : "Join the community"}</p>
          <h1 className="font-display text-5xl mt-3">{mode === "login" ? "Sign in." : "Create account."}</h1>
          <p className="text-muted-foreground mt-4">{mode === "login" ? "Continue your dharma." : "Begin your journey with Dharmik."}</p>
        </div>
        <form onSubmit={submit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2 hide-scrollbar bg-white/70 backdrop-blur p-8 rounded-lg shadow-glow border border-[color:var(--border)] lg:w-[95%]">
          {mode === "signup" && (
            <>
              <Input label="Name" value={name} onChange={setName} required disabled={loading} />
              <Input label="Mobile Number" value={phone} onChange={setPhone} type="tel" disabled={loading} />
            </>
          )}
          <Input label="Email" value={email} onChange={setEmail} type="email" required disabled={loading} />
          <Input label="Password" value={password} onChange={setPassword} type="password" required disabled={loading} />
          <button type="submit" disabled={loading} aria-busy={loading} className="w-full bg-[color:var(--ink)] text-[color:var(--ivory)] py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-[color:var(--saffron)] transition-colors disabled:opacity-60">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
          
          {mode === "login" && (
            <>
              <div className="relative flex items-center gap-4">
                <div className="flex-1 border-t border-[color:var(--border)]" />
                <span className="text-[11px] text-muted-foreground uppercase tracking-widest">Or</span>
                <div className="flex-1 border-t border-[color:var(--border)]" />
              </div>
              
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={googleLoading || loading}
                className="w-full bg-white border border-[color:var(--border)] text-[color:var(--ink)] py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <svg className="size-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {googleLoading ? "Signing in..." : "Sign in with Google"}
              </button>
            </>
          )}
          
          <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            {mode === "login" ? "New here? Create an account →" : "Have an account? Sign in →"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[color:var(--ivory)]">
      {/* Hero band */}
      <div className="relative overflow-hidden border-b border-[color:var(--border)] bg-gradient-to-br from-[color:var(--ink)] via-[#1a1410] to-[color:var(--ink)] text-[color:var(--ivory)]">
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="container-luxe relative py-14 md:py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-[color:var(--saffron)] text-[color:var(--ink)] grid place-items-center font-display text-3xl shadow-lg shadow-black/30">
              {initials || "॥"}
            </div>
            <div>
              <p className="eyebrow text-[color:var(--saffron)]">Namaste</p>
              <h1 className="font-display text-4xl md:text-5xl mt-2">{user.name}</h1>
              <p className="text-sm text-white/60 mt-1">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Stat label="Orders" value={String(orders.length)} />
            <Stat label="Saved" value={String(user.addresses.length)} />
            <Stat label="Coupons" value={String(COUPONS.length)} />
          </div>
        </div>
      </div>

      <div className="container-luxe py-12 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        {/* LEFT NAV */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="border border-[color:var(--border)] bg-white/60 backdrop-blur">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`group w-full flex items-center gap-3 px-5 py-4 text-sm border-l-2 transition-all ${
                    active
                      ? "border-[color:var(--saffron)] bg-[color:var(--saffron)]/10 text-[color:var(--ink)]"
                      : "border-transparent text-muted-foreground hover:text-[color:var(--ink)] hover:bg-black/[0.02]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-[color:var(--saffron)]" : ""}`} />
                  <span className="uppercase tracking-widest text-[11px] font-medium">{item.label}</span>
                  <ChevronRight className={`ml-auto h-3.5 w-3.5 transition-transform ${active ? "translate-x-0.5 text-[color:var(--saffron)]" : "opacity-0 group-hover:opacity-100"}`} />
                </button>
              );
            })}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-5 py-4 text-sm border-l-2 border-transparent text-muted-foreground hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="uppercase tracking-widest text-[11px] font-medium">Sign out</span>
            </button>
          </nav>
        </aside>

        {/* MIDDLE — main panel */}
        <main className="min-w-0 space-y-8">
          {tab === "profile" && <ProfilePanel user={user} />}
          {tab === "orders" && <OrdersPanel orders={orders} expanded />}
          {tab === "coupons" && <CouponsPanel />}
          {tab === "settings" && <SettingsPanel user={user} />}
          {tab === "support" && <SupportPanel />}
        </main>

        {/* RIGHT — orders rail */}
        <aside className="space-y-6">
          <SectionHead title="Recent orders" hint={`${orders.length} total`} />
          {orders.length === 0 ? (
            <div className="border border-dashed border-[color:var(--border)] p-6 text-center bg-white/60">
              <Package className="h-6 w-6 mx-auto text-[color:var(--saffron)]" />
              <p className="text-sm text-muted-foreground mt-3">
                No orders yet. Your devotional pieces will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <OrderCard key={o.orderId} order={o} compact />
              ))}
              {orders.length > 5 && (
                <button
                  onClick={() => setTab("orders")}
                  className="w-full text-xs uppercase tracking-widest text-[color:var(--saffron)] hover:underline pt-2"
                >
                  View all orders →
                </button>
              )}
            </div>
          )}

          <div className="border border-[color:var(--border)] p-5 bg-gradient-to-br from-[color:var(--saffron)]/15 to-transparent">
            <Sparkles className="h-5 w-5 text-[color:var(--saffron)]" />
            <p className="font-display text-lg mt-3 leading-tight">Rewards await</p>
            <p className="text-xs text-muted-foreground mt-2">
              Earn dharma points on every order. Redeem for exclusive drops.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Panels ---------- */

function ProfilePanel({ user }: { user: User }) {
  return (
    <>
      <SectionHead title="Account details" eyebrow="Profile" />
      <div className="grid sm:grid-cols-2 gap-4">
        <DetailTile label="Full name" value={user.name} />
        <DetailTile label="Email" value={user.email} />
        <DetailTile label="Phone" value={user.phone ?? "—"} />
        <DetailTile label="Member ID" value={user.id.slice(0, 10).toUpperCase()} />
      </div>

      <div className="pt-4">
        <SectionHead title="Saved addresses" hint={`${user.addresses.length} on file`} />
        <div className="grid sm:grid-cols-2 gap-4">
          {user.addresses.length === 0 && (
            <p className="text-sm text-muted-foreground">No addresses saved yet.</p>
          )}
          {user.addresses.map((a) => (
            <div key={a.id} className="relative border border-[color:var(--border)] p-5 bg-white/60 hover:border-[color:var(--saffron)] transition-colors">
              <MapPin className="absolute top-5 right-5 h-4 w-4 text-[color:var(--saffron)]" />
              <p className="font-medium">{a.fullName}</p>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
                {a.city}, {a.state} {a.pincode}
              </p>
              <p className="text-sm mt-2">{a.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function OrdersPanel({ orders, expanded }: { orders: Order[]; expanded?: boolean }) {
  return (
    <>
      <SectionHead title="Your orders" eyebrow="Orders" />
      {orders.length === 0 ? (
        <div className="border border-dashed border-[color:var(--border)] p-12 text-center bg-white/60">
          <Package className="h-8 w-8 mx-auto text-[color:var(--saffron)]" />
          <p className="font-display text-2xl mt-4">No orders yet</p>
          <p className="text-sm text-muted-foreground mt-2">Begin your collection — sacred wearables crafted with intent.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => <OrderCard key={o.orderId} order={o} compact={!expanded} />)}
        </div>
      )}
    </>
  );
}

function CouponsPanel() {
  return (
    <>
      <SectionHead title="Your coupons" eyebrow="Rewards" />
      <div className="grid sm:grid-cols-2 gap-4">
        {COUPONS.map((c) => (
          <div key={c.code} className="relative border border-[color:var(--border)] bg-white/70 overflow-hidden group hover:border-[color:var(--saffron)] transition-colors">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${c.tone === "saffron" ? "bg-[color:var(--saffron)]" : "bg-[color:var(--ink)]"}`} />
            <div className="p-5 pl-6">
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl tracking-wide">{c.code}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(c.code); toast.success(`Copied ${c.code}`); }}
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-[color:var(--saffron)] flex items-center gap-1"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-4">Expires {c.expires}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SettingsPanel({ user }: { user: User }) {
  return (
    <>
      <SectionHead title="Preferences" eyebrow="Settings" />
      <div className="space-y-2">
        <Toggle label="Order updates via email" defaultOn />
        <Toggle label="SMS shipping notifications" defaultOn />
        <Toggle label="Weekly journal & new drops" />
        <Toggle label="Festival exclusive previews" defaultOn />
      </div>
      <div className="pt-6">
        <SectionHead title="Security" />
        <div className="border border-[color:var(--border)] divide-y divide-[color:var(--border)] bg-white/60">
          <Row label="Email" value={user.email} action="Change" />
          <Row label="Password" value="••••••••" action="Update" />
          <Row label="Two-factor auth" value="Disabled" action="Enable" />
        </div>
      </div>
    </>
  );
}

function SupportPanel() {
  const items = [
    { q: "Where is my order?", a: "Track from the Orders tab or visit /track with your order ID." },
    { q: "Returns & exchanges", a: "Free 7-day returns on all unworn pieces with original packaging." },
    { q: "Size & fit", a: "All garments run true to size. Consult our size guide on each product page." },
    { q: "Care for sacred pieces", a: "Cold wash, inside-out. Air dry away from direct sunlight." },
  ];
  return (
    <>
      <SectionHead title="How can we help?" eyebrow="Support" />
      <div className="grid sm:grid-cols-2 gap-3">
        <ContactTile title="Email us" sub="care@dharmik.in" href="mailto:care@dharmik.in" />
        <ContactTile title="WhatsApp" sub="+91 98765 43210" href="https://wa.me/919876543210" />
      </div>
      <div className="pt-4 space-y-2">
        {items.map((i) => (
          <details key={i.q} className="border border-[color:var(--border)] bg-white/60 group">
            <summary className="px-5 py-4 cursor-pointer flex items-center justify-between text-sm font-medium">
              {i.q}
              <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 text-[color:var(--saffron)]" />
            </summary>
            <p className="px-5 pb-4 text-sm text-muted-foreground">{i.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}

/* ---------- Small parts ---------- */

function SectionHead({ title, eyebrow, hint }: { title: string; eyebrow?: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        {eyebrow && <p className="eyebrow text-[color:var(--saffron)]">{eyebrow}</p>}
        <h2 className="font-display text-2xl md:text-3xl mt-1">{title}</h2>
      </div>
      {hint && <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{hint}</span>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/15 px-5 py-3 min-w-[88px] text-center bg-white/[0.04]">
      <p className="font-display text-2xl text-[color:var(--saffron)]">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-white/60 mt-0.5">{label}</p>
    </div>
  );
}

function DetailTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[color:var(--border)] bg-white/60 p-5">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-medium truncate">{value}</p>
    </div>
  );
}

function OrderCard({ order, compact }: { order: Order; compact?: boolean }) {
  const date = new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="border border-[color:var(--border)] bg-white/60 p-4 hover:border-[color:var(--saffron)] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">#{order.orderId}</p>
          <p className="font-medium mt-1 truncate">
            {order.items.length} item{order.items.length > 1 ? "s" : ""} · ₹{order.total.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{date}</p>
        </div>
        <span className="text-[10px] uppercase tracking-widest bg-[color:var(--saffron)]/15 text-[color:var(--saffron)] px-2 py-1">
          {order.orderStatus}
        </span>
      </div>
      {!compact && (
        <div className="mt-3 pt-3 border-t border-[color:var(--border)] flex gap-2 overflow-x-auto">
          {order.items.slice(0, 4).map((it, idx) => (
            <img key={idx} src={it.image} alt={it.title} className="h-14 w-14 object-cover border border-[color:var(--border)]" />
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className="w-full flex items-center justify-between px-5 py-4 border border-[color:var(--border)] bg-white/60 hover:border-[color:var(--saffron)] transition-colors"
    >
      <span className="text-sm">{label}</span>
      <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-[color:var(--saffron)]" : "bg-[color:var(--border)]"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}

function Row({ label, value, action }: { label: string; value: string; action: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm mt-0.5">{value}</p>
      </div>
      <button className="text-xs uppercase tracking-widest text-[color:var(--saffron)] hover:underline">{action}</button>
    </div>
  );
}

function ContactTile({ title, sub, href }: { title: string; sub: string; href: string }) {
  return (
    <a href={href} className="border border-[color:var(--border)] bg-white/60 p-5 hover:border-[color:var(--saffron)] hover:bg-[color:var(--saffron)]/5 transition-colors block">
      <p className="font-display text-lg">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{sub}</p>
    </a>
  );
}

function Input({ label, value, onChange, type = "text", required, disabled }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; disabled?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent border-b border-[color:var(--border)] py-2.5 focus:outline-none focus:border-[color:var(--saffron)] disabled:opacity-60"
      />
    </label>
  );
}
