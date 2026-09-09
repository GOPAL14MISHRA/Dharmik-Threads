import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { adminStore, ORDER_STATUS_LIST, type Coupon, type Customer } from "@/lib/admin/adminStore";
import type { Order, OrderStatus, Product } from "@/lib/types";
import { getDefaultImage, getBasePrice, getTotalStock } from "@/lib/types";
import { toast } from "sonner";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";
import { BLOG_POSTS } from "@/lib/blogData";
import { notificationService } from "@/services/notificationService";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, authReady } from "@/lib/firebase/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  Search,
  TrendingUp,
  IndianRupee,
  ShoppingCart,
  UserPlus,
  Lock,
  LogOut,
  Plus,
  Trash2,
  X,
  Menu,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Eye,
  EyeOff,
  Ban,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Dharmik" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const SESSION_KEY = "dharmik_admin_session";

type TabKey = "dashboard" | "products" | "orders" | "customers" | "blogs" | "coupons";
const NAV: { key: TabKey; label: string; icon: typeof Package }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "customers", label: "Users", icon: Users },
  { key: "blogs", label: "Blogs", icon: BookOpen },
  { key: "coupons", label: "Coupons", icon: Ticket },
];

function useAdminState() {
  return useSyncExternalStore(
    (cb) => adminStore.subscribe(cb),
    () => adminStore.getState(),
    () => adminStore.getState(),
  );
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [customersTabMode, setCustomersTabMode] = useState<"users" | "subscribers">("users");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      authReady.then(() => {
        setAuthed(Boolean(auth.currentUser) && sessionStorage.getItem(SESSION_KEY) === "1");
      });
    }
  }, []);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
    setMobileSidebarOpen(false);
  }, [tab]);

  if (!authed) return <AdminLogin onAuthed={() => setAuthed(true)} />;  return (
    <div className="h-screen overflow-hidden bg-[#FAF9F5] text-stone-855 font-sans antialiased relative">
      <div className="grid grid-rows-[auto_1fr] lg:grid-rows-none lg:grid-cols-[240px_minmax(0,1fr)] h-screen overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#F5F4F0] border-b border-stone-200 col-span-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="font-display text-lg font-bold text-stone-855">
              Dharmik<span className="text-[color:var(--saffron)]">.</span>
            </p>
          </div>
          <p className="text-[8px] uppercase tracking-[0.2em] text-stone-400 font-bold">Admin Console</p>
        </header>

        {/* Sidebar Backdrop Overlay on Mobile */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-60 border-r border-stone-200 bg-[#F5F4F0] transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-full flex flex-col justify-between ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div>
            <div className="p-6 border-b border-stone-200">
              <p className="font-display text-2xl font-bold text-stone-855">
                Dharmik<span className="text-[color:var(--saffron)]">.</span>
              </p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-stone-400 mt-1 font-bold">Admin Console</p>
            </div>
            <nav className="p-3 space-y-1">
              {NAV.map((n) => {
                const Icon = n.icon;
                const active = tab === n.key;
                return (
                  <button
                    key={n.key}
                    onClick={() => {
                      if (n.key === "customers") {
                        setCustomersTabMode("users");
                      }
                      setTab(n.key);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest transition-all font-bold ${
                      active
                        ? "bg-white text-stone-850 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200/50"
                        : "text-stone-500 hover:text-stone-800 hover:bg-stone-200/30"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-[color:var(--saffron)]" : ""}`} />
                    {n.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="p-3 border-t border-stone-200 mt-auto">
            <button
              onClick={async () => {
                await signOut(auth);
                sessionStorage.removeItem(SESSION_KEY);
                setAuthed(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold text-stone-500 hover:text-red-650 hover:bg-red-50/50 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main ref={mainRef} className="min-w-0 bg-[#FAF9F5] h-full overflow-y-auto">
          {tab === "dashboard" && (
            <Dashboard
              onNav={setTab}
              onNavCustomers={(mode) => {
                setCustomersTabMode(mode);
                setTab("customers");
              }}
            />
          )}
          {tab === "products" && <ProductsView />}
          {tab === "orders" && <OrdersView />}
          {tab === "customers" && (
            <CustomersView
              initialViewMode={customersTabMode}
              onViewModeChange={setCustomersTabMode}
            />
          )}
          {tab === "blogs" && <BlogsView />}
          {tab === "coupons" && <CouponsView />}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Login ---------------- */
function AdminLogin({ onAuthed }: { onAuthed: () => void }) {
  const [email, setEmail] = useState("");
  const [p, setP] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), p);
      sessionStorage.setItem(SESSION_KEY, "1");
      toast.success("Welcome, admin.");
      onAuthed();
      window.location.reload();
    } catch (error: any) {
      console.error("Admin Firebase login failed:", error);
      toast.error(error?.code === "auth/invalid-credential" ? "Invalid admin email or password" : error?.message ?? "Admin login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-tr from-orange-50/20 via-stone-50/40 to-yellow-50/20 text-stone-800 p-6">
      <div className="w-full max-w-md border border-stone-200/80 bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-luxe relative">
        {/* Decorative corner accents */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[color:var(--saffron)]/30 rounded-tl" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[color:var(--saffron)]/30 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[color:var(--saffron)]/30 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[color:var(--saffron)]/30 rounded-br" />

        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-[color:var(--saffron)] text-[color:var(--ink)] grid place-items-center">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-bold">Admin Console</p>
            <p className="text-xs text-stone-500">Dharmik — restricted access</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <Field label="Admin email" value={email} onChange={setEmail} type="email" />
          <Field label="Password" value={p} onChange={setP} type="password" />
          <button disabled={loading} className="w-full bg-[color:var(--ink)] text-[color:var(--ivory)] py-3 text-[10px] uppercase tracking-[0.25em] font-bold rounded shadow-md hover:bg-[color:var(--saffron)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 mt-2 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-[10px] text-stone-400 text-center font-bold uppercase tracking-wider">Use your Firebase admin account</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", disabled = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean }) {
  return (
    <label className="block text-left">
      <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 w-full bg-stone-50/50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 transition-all duration-300 disabled:opacity-60 disabled:bg-stone-100"
        required
      />
    </label>
  );
}

/* ---------------- Header / Shell ---------------- */
function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
      <div>
        <h1 className="font-display text-3xl font-semibold text-stone-800">{title}</h1>
        {sub && <p className="text-sm text-stone-500 mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard({
  onNav,
  onNavCustomers,
}: {
  onNav: (t: TabKey) => void;
  onNavCustomers: (mode: "users" | "subscribers") => void;
}) {
  const { orders, products, customers, coupons, subscribers } = useAdminState();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;
  const pending = orders.filter((o) => o.orderStatus !== "delivered").length;
  const subscribedCount = subscribers?.length ?? 0;

  const topProducts = useMemo(() => {
    const counts: Record<string, { product: Product; qty: number; revenue: number }> = {};
    orders.forEach((o) => {
      o.items.forEach((it) => {
        const p = products.find((x) => x.id === it.productId);
        if (!p) return;
        if (!counts[p.id]) counts[p.id] = { product: p, qty: 0, revenue: 0 };
        counts[p.id].qty += it.quantity;
        counts[p.id].revenue += it.price * it.quantity;
      });
    });
    return Object.values(counts).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders, products]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader title="Dashboard" sub="Overview of your storefront stats." />
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard label="Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} icon={IndianRupee} accent />
        <StatCard label="Orders" value={String(orders.length)} icon={ShoppingCart} hint={`${pending} pending`} onClick={() => onNav("orders")} />
        <StatCard label="Customers" value={String(customers.length)} icon={UserPlus} onClick={() => onNavCustomers("users")} />
        <StatCard label="Subscribed Users" value={String(subscribedCount)} icon={Mail} onClick={() => onNavCustomers("subscribers")} />
        <StatCard label="Avg. order value" value={`₹${aov.toLocaleString("en-IN")}`} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mt-8">
        <Panel title="Top products" action={<button onClick={() => onNav("products")} className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--saffron)] hover:underline">Manage →</button>}>
          <div className="divide-y divide-stone-100">
            {topProducts.map(({ product, qty, revenue }) => (
              <div key={product.id} className="flex items-center gap-4 py-3.5">
                <img src={getDefaultImage(product)} alt={product.title} className="h-12 w-12 object-cover rounded-lg border border-stone-200" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-850 truncate">{product.title}</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-stone-800">₹{revenue.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-stone-450">{qty} sold</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-stone-400 py-4">No sales yet.</p>}
          </div>
        </Panel>

        <Panel title="Recent orders" action={<button onClick={() => onNav("orders")} className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--saffron)] hover:underline">View all →</button>}>
          <div className="space-y-4">
            {orders.slice(0, 5).map((o) => (
              <div key={o.orderId} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-stone-800 truncate">{o.shippingAddress.fullName}</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">#{o.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-stone-800">₹{o.total.toLocaleString("en-IN")}</p>
                  <div className="mt-0.5"><StatusPill status={o.orderStatus} mini /></div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <MiniCard label="Active coupons" value={String(coupons.filter((c) => c.active).length)} sub={`${coupons.length} total`} />
        <MiniCard label="Low stock" value={String(products.filter((p) => (p.variants[0]?.sizes[0]?.stock ?? 0) < 5).length)} sub="below 5 units" />
        <MiniCard label="Collections" value={String(new Set(products.map((p) => p.collection)).size)} sub="active lines" />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent,
  onClick,
}: {
  label: string;
  value: string;
  icon: typeof Package;
  hint?: string;
  accent?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{label}</p>
        <Icon className={`h-4.5 w-4.5 ${accent ? "text-[color:var(--saffron)]" : "text-stone-400"}`} />
      </div>
      <p className="font-display text-3xl font-bold mt-3 text-stone-800">{value}</p>
      {hint && <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider font-bold">{hint}</p>}
    </>
  );

  const className = `border p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md text-left w-full block ${
    accent ? "border-[color:var(--saffron)]/40 bg-gradient-to-br from-[color:var(--saffron)]/10 via-white to-white" : "border-stone-200 bg-white"
  }`;

  if (onClick) {
    return (
      <button onClick={onClick} className={`${className} cursor-pointer`}>
        {content}
      </button>
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}

function MiniCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border border-stone-200 bg-white p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{label}</p>
      <p className="font-display text-2xl font-bold mt-2 text-stone-800">{value}</p>
      <p className="text-xs text-stone-400 mt-1">{sub}</p>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border border-stone-200 bg-white p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-stone-800">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ---------------- Products ---------------- */
function ProductsView() {
  const { products } = useAdminState();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Reset to first page when search changes
  useEffect(() => {
    setPage(1);
  }, [q]);

  const filtered = products.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  
  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader
        title="Products"
        sub={`${products.length} items across your catalog.`}
        action={
          <button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-[color:var(--saffron)] text-[color:var(--ink)] px-5 py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-[color:var(--ink)] hover:text-white transition-all duration-300 shadow">
            <Plus className="h-4 w-4" /> New product
          </button>
        }
      />

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 text-stone-805 placeholder-stone-400 font-medium shadow-sm"
        />
      </div>

      <div className="border border-stone-200/80 bg-white rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[600px] md:min-w-0">
          <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500 font-bold">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
              <th className="text-right px-4 py-3">Price</th>
              <th className="text-right px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {paginated.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={getDefaultImage(p)} alt={p.title} className="h-12 w-12 object-cover rounded-lg border border-stone-200 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-800 truncate text-sm">{p.title}</p>
                      <p className="text-[10px] text-stone-400 truncate tracking-wide">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600 font-medium capitalize hidden md:table-cell">{p.category}</td>
                <td className="px-4 py-3 text-right text-stone-800 font-semibold">₹{getBasePrice(p).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${(p.variants[0]?.sizes[0]?.stock ?? 0) < 5 ? "bg-red-50 text-red-650" : "bg-stone-100 text-stone-650"}`}>{p.variants[0]?.sizes[0]?.stock ?? 0}</span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(p)} className="text-[10px] uppercase tracking-widest font-bold text-[color:var(--saffron)] hover:text-amber-605 transition-colors mr-3">Edit</button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.title}"?`)) {
                        adminStore.deleteProduct(p.id);
                      }
                    }}
                    className="text-stone-400 hover:text-red-500 transition-colors inline-flex items-center align-middle"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-stone-400 bg-white">No products match your search.</td></tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="bg-stone-50 border-t border-stone-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-stone-500 font-medium">
              Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} products
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-stone-200 bg-white rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pNum = idx + 1;
                const active = page === pNum;
                return (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      active
                        ? "bg-[color:var(--saffron)] text-white shadow-sm"
                        : "border border-stone-200 bg-white hover:bg-stone-50 text-stone-650"
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-stone-200 bg-white rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {editing && <ProductDrawer product={editing} onClose={() => setEditing(null)} />}
      {creating && <ProductDrawer product={null} onClose={() => setCreating(false)} />}
    </div>
  );
}

function ProductDrawer({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const isNew = !product;
  const [form, setForm] = useState<Product>(
    product ?? {
      id: `p${Date.now()}`,
      slug: "",
      title: "",
      description: "",
      brand: "DharmikThreads",
      category: "tshirts",
      collection: "mahadev",
      variants: [
        {
          variantId: `v${Date.now()}`,
          color: { name: "Matte Black", hex: "#111111" },
          images: ["https://placehold.co/400x500/111111/F8F5F0?text=Dharmik"],
          sizes: [
            { size: "S", price: 999, stock: 10, sku: "NEW-BLK-S" },
            { size: "M", price: 999, stock: 10, sku: "NEW-BLK-M" },
            { size: "L", price: 999, stock: 10, sku: "NEW-BLK-L" },
            { size: "XL", price: 999, stock: 10, sku: "NEW-BLK-XL" },
          ],
        },
      ],
      rating: 5,
      reviewCount: 0,
      reviews: [],
      createdAt: new Date().toISOString().slice(0, 10),
    },
  );

  const firstVariant = form.variants[0];
  const firstSize = firstVariant?.sizes[0];

  function save() {
    if (!form.title || !form.slug) { toast.error("Title and slug required"); return; }
    const finalSlug = form.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!finalSlug) { toast.error("Valid slug required"); return; }

    const productId = isNew ? finalSlug : form.id;
    
    // Update the variants to match the product ID
    const updatedVariants = form.variants.map((v) => {
      const colorSuffix = v.color.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const variantId = `${productId}-${colorSuffix}`;
      
      const updatedSizes = v.sizes.map((sz) => {
        const prefix = productId.substring(0, 10).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        const colAbbr = v.color.name.substring(0, 3).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        const sku = `${prefix}-${colAbbr}-${sz.size.toUpperCase()}`;
        return {
          ...sz,
          sku: sz.sku.startsWith("NEW-") || isNew ? sku : sz.sku,
        };
      });
      
      return {
        ...v,
        variantId,
        sizes: updatedSizes,
      };
    });

    const finalForm = {
      ...form,
      id: productId,
      slug: finalSlug,
      variants: updatedVariants,
    };

    if (isNew) adminStore.addProduct(finalForm);
    else adminStore.updateProduct(form.id, finalForm);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-[#FAF9F5] border-l border-stone-200 overflow-y-auto flex flex-col justify-between">
        <div>
          <div className="sticky top-0 bg-[#FAF9F5]/90 backdrop-blur border-b border-stone-200 p-6 flex items-center justify-between z-10">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">{isNew ? "New" : "Edit"}</p>
              <h3 className="font-display text-xl font-bold text-stone-850 mt-1">{isNew ? "Add product" : form.title}</h3>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-750 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="p-6 space-y-4">
            <Field
              label="Title"
              value={form.title}
              onChange={(v) => {
                if (isNew) {
                  const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                  setForm({ ...form, title: v, slug });
                } else {
                  setForm({ ...form, title: v });
                }
              }}
            />
            <Field
              label="Slug"
              value={form.slug}
              onChange={(v) => setForm({ ...form, slug: v.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
              disabled={!isNew}
            />
            <label className="block text-left">
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="mt-1.5 w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 transition-all duration-300 text-stone-855"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-left">
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Base price (₹)</span>
                <input
                  type="text"
                  value={firstSize?.price ?? 999}
                  onChange={(e) => {
                    const cleanVal = e.target.value.replace(/\D/g, "");
                    const numVal = cleanVal ? parseInt(cleanVal, 10) : 0;
                    setForm({
                      ...form,
                      variants: form.variants.map((vt) => ({
                        ...vt,
                        sizes: vt.sizes.map((s) => ({ ...s, price: numVal }))
                      })),
                    });
                  }}
                  className="mt-1.5 w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 transition-all duration-300 text-stone-850"
                />
              </label>
              <NumField
                label="Edit stock"
                value={firstSize?.stock ?? 0}
                onChange={(v) => setForm({
                  ...form,
                  variants: form.variants.map((vt) => ({
                    ...vt,
                    sizes: vt.sizes.map((s) => ({ ...s, stock: v }))
                  })),
                })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Category"
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v as Product["category"] })}
                options={["tshirts", "hoodies", "sweatshirts", "polos", "jackets", "caps", "accessories"]}
              />
              <SelectField
                label="Collection"
                value={form.collection}
                onChange={(v) => setForm({ ...form, collection: v as Product["collection"] })}
                options={["mahadev", "shri-ram", "krishna", "hanuman", "bhagavad-gita", "sanskrit", "durga"]}
              />
            </div>
            <Field
              label="Primary image URL"
              value={firstVariant?.images[0] ?? ""}
              onChange={(v) => setForm({
                ...form,
                variants: form.variants.map((vt, vi) =>
                  vi === 0 ? { ...vt, images: [v, ...vt.images.slice(1)] } : vt
                ),
              })}
            />
          </div>
        </div>
        <div className="p-6 border-t border-stone-200 bg-stone-50 flex gap-3">
          <button onClick={save} className="flex-1 bg-[color:var(--ink)] text-[color:var(--ivory)] py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow hover:bg-[color:var(--saffron)] transition-all duration-300">
            {isNew ? "Add product" : "Save changes"}
          </button>
          <button onClick={onClose} className="px-6 border border-stone-200 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white hover:border-stone-300 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block text-left">
      <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const cleanVal = e.target.value.replace(/\D/g, "");
          onChange(cleanVal ? parseInt(cleanVal, 10) : 0);
        }}
        className="mt-1.5 w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 transition-all duration-300 text-stone-855"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block text-left">
      <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-white border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 transition-all duration-350 capitalize text-stone-800 font-medium"
      >
        {options.map((o) => <option key={o} value={o} className="bg-white">{o.replace(/-/g, " ")}</option>)}
      </select>
    </label>
  );
}

/* ---------------- Orders ---------------- */
function OrdersView() {
  const { orders } = useAdminState();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredByStatus = filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  const list = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) return filteredByStatus;
    return filteredByStatus.filter(
      (o) =>
        o.orderId.toLowerCase().includes(cleanQuery) ||
        o.shippingAddress.fullName.toLowerCase().includes(cleanQuery)
    );
  }, [filteredByStatus, searchQuery]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader title="Orders" sub={`${orders.length} total orders.`} />

      <div className="flex flex-wrap gap-2 mb-6">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>All ({orders.length})</Chip>
        {ORDER_STATUS_LIST.map((s) => {
          const count = orders.filter((o) => o.orderStatus === s).length;
          return (
            <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>
              {s.replace(/-/g, " ")} ({count})
            </Chip>
          );
        })}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Order ID (e.g. DT12345678) or customer name..."
          className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 text-stone-800 placeholder-stone-400 font-medium shadow-sm animate-fade-in"
        />
      </div>

      <div className="space-y-4">
        {list.map((o) => <OrderRow key={o.orderId} order={o} />)}
        {list.length === 0 && <p className="text-center text-stone-400 py-12 bg-white border border-stone-200 rounded-2xl">No orders found.</p>}
      </div>
    </div>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold rounded-lg border transition-all duration-200 ${
        active ? "border-[color:var(--saffron)] bg-[color:var(--saffron)]/10 text-[color:var(--saffron)]" : "border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-stone-850"
      }`}
    >
      {children}
    </button>
  );
}

function OrderRow({ order }: { order: Order }) {
  const date = new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="border border-stone-200 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-300">
      <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-center">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-stone-450 font-bold">#{order.orderId}</p>
          <p className="font-semibold text-stone-800 text-sm mt-0.5">{order.shippingAddress.fullName}</p>
          <p className="text-xs text-stone-500 mt-0.5">{order.shippingAddress.city}, {order.shippingAddress.state} · {date}</p>
        </div>
        <div className="flex items-center gap-2.5">
          {order.items.slice(0, 4).map((it, i) => (
            <img key={i} src={it.image} alt={it.title} className="h-12 w-12 object-cover rounded-lg border border-stone-200" />
          ))}
          <div className="ml-2">
            <p className="text-sm font-semibold text-stone-800">₹{order.total.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{order.paymentMethod}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={order.orderStatus} />
          <select
            value={order.orderStatus}
            onChange={(e) => {
              adminStore.updateOrderStatus(order.orderId, e.target.value as OrderStatus);
            }}
            className="bg-stone-55 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 transition-all text-stone-700 font-medium capitalize"
          >
            {ORDER_STATUS_LIST.map((s) => <option key={s} value={s} className="bg-white">{s.replace(/-/g, " ")}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status, mini }: { status: OrderStatus; mini?: boolean }) {
  const colors: Record<OrderStatus, string> = {
    placed: "bg-blue-50 text-blue-600",
    packed: "bg-amber-50 text-amber-600",
    shipped: "bg-purple-50 text-purple-650",
    "out-for-delivery": "bg-cyan-50 text-cyan-600",
    delivered: "bg-emerald-50 text-emerald-600",
  };
  return (
    <span className={`inline-block ${colors[status]} ${mini ? "text-[9px] px-1.5 py-0.5" : "text-[9px] px-2.5 py-1"} rounded-full font-bold uppercase tracking-widest`}>
      {status.replace(/-/g, " ")}
    </span>
  );
}

/* ---------------- Customers (Users) ---------------- */
function CustomersView({
  initialViewMode = "users",
  onViewModeChange,
}: {
  initialViewMode?: "users" | "subscribers";
  onViewModeChange?: (mode: "users" | "subscribers") => void;
}) {
  const { customers, subscribers } = useAdminState();
  const [q, setQ] = useState("");
  const [viewMode, setViewMode] = useState<"users" | "subscribers">(initialViewMode);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Sync state if initialViewMode changes from outside
  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  const handleViewModeChange = (mode: "users" | "subscribers") => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  };

  const list = useMemo(() => {
    const cleanQ = q.trim().toLowerCase();
    if (viewMode === "users") {
      return customers.filter(
        (c) => c.name.toLowerCase().includes(cleanQ) || c.email.toLowerCase().includes(cleanQ)
      );
    } else {
      return (subscribers || []).filter(
        (s) => s.email.toLowerCase().includes(cleanQ)
      );
    }
  }, [customers, subscribers, q, viewMode]);

  const totalUsers = customers.length;
  const subscribedCount = subscribers?.length ?? 0;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-stone-850">User Management</h1>
        <p className="text-stone-500 text-sm mt-1">Manage customer accounts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Total Users Summary Card */}
        <button
          onClick={() => handleViewModeChange("users")}
          className={`bg-white border text-center relative overflow-hidden transition-all hover:shadow-md p-6 rounded-2xl shadow-sm cursor-pointer text-left ${
            viewMode === "users" ? "border-[color:var(--saffron)]/70 ring-1 ring-[color:var(--saffron)]/10" : "border-stone-200/80"
          }`}
        >
          <p className="font-display text-4xl font-bold text-stone-800">{totalUsers}</p>
          <p className="text-stone-500 text-xs mt-1.5 uppercase tracking-wider font-bold">Total Users</p>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[color:var(--saffron)]" />
        </button>

        {/* Subscribed Users Summary Card */}
        <button
          onClick={() => handleViewModeChange("subscribers")}
          className={`bg-white border text-center relative overflow-hidden transition-all hover:shadow-md p-6 rounded-2xl shadow-sm cursor-pointer text-left ${
            viewMode === "subscribers" ? "border-emerald-500/70 ring-1 ring-emerald-500/10" : "border-stone-200/80"
          }`}
        >
          <p className="font-display text-4xl font-bold text-stone-800">{subscribedCount}</p>
          <p className="text-stone-500 text-xs mt-1.5 uppercase tracking-wider font-bold">Subscribed Users</p>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-stone-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={viewMode === "users" ? "Search by name or email..." : "Search subscribers..."}
          className="w-full bg-white border border-stone-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 transition-all duration-300 text-stone-800 placeholder-stone-400 font-medium shadow-sm"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((item) => {
          if (viewMode === "users") {
            const c = item as Customer;
            const initials = c.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className="bg-white border border-stone-200/85 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-stone-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Circle Avatar */}
                      <div className="h-11 w-11 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-display text-sm font-semibold flex-shrink-0">
                        {initials || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-855 truncate text-sm">{c.name}</p>
                        <p className="text-[11px] text-stone-400 truncate mt-0.5">{c.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Email Section with mail icon */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-stone-500 text-xs">
                    <Mail className="h-3.5 w-3.5 text-stone-400" />
                    <a
                      href={`mailto:${c.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="truncate hover:text-[color:var(--saffron)] transition-colors"
                    >
                      {c.email}
                    </a>
                  </div>
                </div>
              </div>
            );
          } else {
            const s = item as { email: string; subscribedAt?: any };
            const formattedDate = s.subscribedAt
              ? (typeof s.subscribedAt.toDate === "function"
                  ? s.subscribedAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : new Date(s.subscribedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }))
              : "Subscribed";

            return (
              <div
                key={s.email}
                className="bg-white border border-stone-200/85 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-stone-300 transition-all duration-300 flex flex-col justify-between animate-fade-in"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Circle Avatar */}
                      <div className="h-11 w-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-855 truncate text-sm">{s.email}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">Joined: {formattedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-stone-100">
                  <a
                    href={`mailto:${s.email}`}
                    className="h-8 px-3 border border-stone-200 text-stone-600 rounded-lg flex items-center justify-center gap-1.5 hover:bg-stone-50 hover:text-stone-900 transition-all duration-200 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    title="Send Email"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email
                  </a>
                </div>
              </div>
            );
          }
        })}
      </div>

      {selectedCustomer && (
        <CustomerDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  );
}

function CustomerDrawer({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const initials = customer.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedDate = customer.joinedAt
    ? new Date(customer.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-[#FAF9F5] border-l border-stone-200 overflow-y-auto flex flex-col justify-between h-full shadow-2xl">
        <div>
          {/* Header */}
          <div className="sticky top-0 bg-[#FAF9F5]/90 backdrop-blur border-b border-stone-200 p-6 flex items-center justify-between z-10">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Admin Console</p>
              <h3 className="font-display text-xl font-bold text-stone-855 mt-1">Customer Profile</h3>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-750 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Avatar and Name */}
          <div className="p-8 border-b border-stone-200 bg-stone-50/50 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-[color:var(--saffron)]/10 text-[color:var(--saffron)] flex items-center justify-center font-display text-2xl font-bold shadow-sm border border-[color:var(--saffron)]/20 mb-4">
              {initials || "U"}
            </div>
            <h4 className="font-display text-lg font-bold text-stone-800">{customer.name}</h4>
            <p className="text-xs text-stone-450 mt-1">{customer.email}</p>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-3">Contact Information</p>
              <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-450 font-medium">Email</span>
                  <a
                    href={`mailto:${customer.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-stone-800 font-semibold hover:text-[color:var(--saffron)] transition-colors"
                  >
                    {customer.email}
                  </a>
                </div>
                <div className="flex justify-between items-center text-sm pt-2.5 border-t border-stone-100">
                  <span className="text-stone-450 font-medium">Phone</span>
                  <span className="text-stone-800 font-semibold">{customer.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2.5 border-t border-stone-100">
                  <span className="text-stone-450 font-medium">Location</span>
                  <span className="text-stone-800 font-semibold">{customer.city || "N/A"}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-450 font-bold mb-3">Activity & History</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm text-left">
                  <p className="text-[9px] uppercase tracking-wider text-stone-450 font-bold">Total Orders</p>
                  <p className="font-display text-2xl font-bold text-stone-800 mt-1">{customer.orders}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm text-left">
                  <p className="text-[9px] uppercase tracking-wider text-stone-450 font-bold">Total Spent</p>
                  <p className="font-display text-2xl font-bold text-stone-800 mt-1">₹{customer.spent.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-3">Account Details</p>
              <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-450 font-medium">Customer ID</span>
                  <span className="text-stone-605 font-mono text-xs">{customer.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2.5 border-t border-stone-100">
                  <span className="text-stone-455 font-medium">Date Joined</span>
                  <span className="text-stone-800 font-medium">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 bg-stone-50/50 flex gap-3">
          <a
            href={`mailto:${customer.email}`}
            className="flex-1 bg-[color:var(--ink)] text-[color:var(--ivory)] py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow hover:bg-[color:var(--saffron)] transition-all duration-300 text-center flex items-center justify-center gap-2"
          >
            <Mail className="h-4 w-4" /> Send Email
          </a>
          <button
            onClick={onClose}
            className="px-6 border border-stone-200 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-white hover:bg-stone-50 hover:border-stone-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Blogs View ---------------- */
function BlogsView() {
  const [customBlogs, setCustomBlogs] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Culture");
  const [author, setAuthor] = useState("Dharmik Atelier");
  const [readTime, setReadTime] = useState("5 min read");
  const [excerpt, setExcerpt] = useState("");
  const [contentText, setContentText] = useState("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "blogs"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCustomBlogs(list);
    });
    return unsub;
  }, []);

  const allBlogs = useMemo(() => {
    const mappedCustom = customBlogs.map((b) => ({
      id: b.id,
      slug: b.slug || b.id,
      title: b.title,
      author: b.author || "Dharmik Atelier",
      category: b.category || "Culture",
      date: b.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: b.status || "Published",
      readTime: b.readTime || "5 min read",
      excerpt: b.excerpt || "",
      content: b.content || [],
      isCustom: true,
    }));

    const staticBlogs = BLOG_POSTS.map((b, idx) => ({
      id: `static-${idx}`,
      slug: b.slug,
      title: b.title,
      author: b.author,
      category: b.tag,
      date: b.date,
      status: "Published",
      readTime: b.readTime,
      excerpt: b.excerpt,
      content: b.content || [],
      isCustom: false,
    }));

    return [...mappedCustom, ...staticBlogs];
  }, [customBlogs]);

  const filtered = allBlogs.filter((b) => b.title.toLowerCase().includes(q.toLowerCase()));

  function openCreate() {
    setEditingBlog(null);
    setTitle("");
    setCategory("Culture");
    setAuthor("Dharmik Atelier");
    setReadTime("5 min read");
    setExcerpt("");
    setContentText("");
    setCreating(true);
  }

  function openEdit(blog: any) {
    setEditingBlog(blog);
    setTitle(blog.title);
    setCategory(blog.category);
    setAuthor(blog.author);
    setReadTime(blog.readTime);
    setExcerpt(blog.excerpt || "");
    const paragraphs = (blog.content || [])
      .filter((c: any) => c.type === "paragraph")
      .map((c: any) => c.text)
      .join("\n\n");
    setContentText(paragraphs);
    setCreating(true);
  }

  async function handleSaveBlog(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !contentText.trim()) {
      toast.error("Title and Content are required");
      return;
    }
    setPublishing(true);
    try {
      const isEdit = !!editingBlog;
      const slug = isEdit
        ? editingBlog.slug
        : title
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

      const blogData = {
        id: slug,
        slug,
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        date: isEdit ? editingBlog.date : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "Published",
        readTime: readTime.trim(),
        excerpt: excerpt.trim() || contentText.trim().substring(0, 120) + "...",
        content: contentText.split("\n\n").map(text => ({ type: "paragraph", text: text.trim() })),
        imgKey: isEdit ? (editingBlog.imgKey || "hero1") : "hero1",
      };

      await setDoc(doc(db, "blogs", slug), blogData);
      
      if (!isEdit) {
        // Dispatch notifications to subscribers for NEW articles only
        await notificationService.notifyNewBlog({
          id: slug,
          title: blogData.title,
          category: blogData.category,
          readTime: blogData.readTime,
          slug: blogData.slug,
          excerpt: blogData.excerpt,
        });
      }

      // Reset form
      setTitle("");
      setCategory("Culture");
      setAuthor("Dharmik Atelier");
      setReadTime("5 min read");
      setExcerpt("");
      setContentText("");
      setCreating(false);
      setEditingBlog(null);
    } catch (err: any) {
      console.error(err);
      toast.error(`Saving failed: ${err.message}`);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader
        title="Blogs"
        sub={`${allBlogs.length} articles on our sacred journal.`}
        action={
          <button onClick={openCreate} className="flex items-center gap-2 bg-[color:var(--saffron)] text-[color:var(--ink)] px-5 py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-[color:var(--ink)] hover:text-white transition-all duration-300 shadow cursor-pointer">
            <Plus className="h-4 w-4" /> New Article
          </button>
        }
      />
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles..."
          className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 text-stone-800 placeholder-stone-400 font-medium shadow-sm"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((b) => (
          <div key={b.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between">
            <div>
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0 flex items-center justify-center font-display text-xl text-[color:var(--saffron)] font-bold border border-stone-200/50">
                  {b.title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">{b.category}</span>
                    <span className={`text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold ${b.status === "Published" ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-500"}`}>
                      {b.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm truncate mt-1 text-stone-805">{b.title}</h3>
                  <p className="text-[11px] text-stone-550 mt-0.5">By {b.author} · {b.readTime}</p>
                </div>
              </div>
              <p className="text-[11px] text-stone-550 mt-3 line-clamp-2 italic">"{b.excerpt}"</p>
              <p className="text-[10px] text-stone-400 mt-4 pt-3 border-t border-stone-100">Created {b.date}</p>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-stone-100">
              <button onClick={() => setSelectedBlog(b)} className="flex-1 border border-stone-200 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer">View</button>
              {b.isCustom ? (
                <>
                  <button
                    onClick={() => openEdit(b)}
                    className="flex-1 border border-stone-200 py-2 text-[10px] font-bold uppercase tracking-widest text-[color:var(--saffron)] hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete "${b.title}"?`)) {
                        try {
                          await deleteDoc(doc(db, "blogs", b.id));
                        } catch (err: any) {
                          toast.error(`Delete failed: ${err.message}`);
                        }
                      }
                    }}
                    className="px-4 border border-stone-200 py-2 text-stone-450 hover:text-red-500 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    disabled
                    className="flex-1 border border-stone-100 py-2 text-stone-300 rounded-lg cursor-not-allowed text-stone-300"
                    title="Static seed content cannot be edited."
                  >
                    Edit
                  </button>
                  <button
                    disabled
                    className="px-4 border border-stone-100 py-2 text-stone-300 rounded-lg cursor-not-allowed"
                    title="Static seed content cannot be deleted."
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Creation/Edit Modal/Overlay */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in text-stone-800">
          <div className="w-full max-w-xl bg-white border border-stone-200 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setCreating(false); setEditingBlog(null); }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-display text-xl font-bold mb-1">{editingBlog ? "Edit Article" : "Publish New Article"}</h2>
            <p className="text-xs text-stone-500 mb-6">
              {editingBlog ? "Update this story inside the database." : "Write a story to the journal and notify all newsletter subscribers."}
            </p>
            
            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The Symbolism of Om..."
                  className="w-full border border-stone-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[color:var(--saffron)] text-stone-805 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-stone-200 bg-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[color:var(--saffron)] text-stone-805"
                  >
                    <option value="Culture">Culture</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Sacred Symbols">Sacred Symbols</option>
                    <option value="Style">Style</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Read Time</label>
                  <input
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5 min read"
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[color:var(--saffron)] text-stone-805 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Author</label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Dharmik Atelier"
                  className="w-full border border-stone-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[color:var(--saffron)] text-stone-805 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Excerpt</label>
                <input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A short summary of the article..."
                  className="w-full border border-stone-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[color:var(--saffron)] text-stone-805 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Content Paragraph(s)</label>
                <textarea
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Write the article content. Separate paragraphs by leaving an empty line."
                  rows={6}
                  className="w-full border border-stone-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[color:var(--saffron)] text-stone-805 bg-white"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setCreating(false); setEditingBlog(null); }}
                  className="flex-1 border border-stone-200 py-3 text-xs uppercase tracking-widest font-bold text-stone-550 rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="flex-1 bg-[color:var(--saffron)] text-white py-3 text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-[color:var(--ink)] hover:text-white transition-all disabled:opacity-55 cursor-pointer"
                >
                  {publishing ? "Saving..." : editingBlog ? "Save Changes" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedBlog && (
        <BlogDetailDrawer blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}
    </div>
  );
}

interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  date: string;
  status: string;
  readTime: string;
  excerpt: string;
  content: any[];
  isCustom: boolean;
}

function BlogDetailDrawer({ blog, onClose }: { blog: BlogArticle; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl bg-[#FAF9F5] border-l border-stone-200 overflow-y-auto flex flex-col justify-between h-full shadow-2xl">
        <div>
          {/* Header */}
          <div className="sticky top-0 bg-[#FAF9F5]/90 backdrop-blur border-b border-stone-200 p-6 flex items-center justify-between z-10">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">{blog.category} · {blog.readTime}</p>
              <h3 className="font-display text-xl font-bold text-stone-855 mt-1">Article Preview</h3>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-750 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Article Banner Info */}
          <div className="p-8 border-b border-stone-200 bg-stone-50/50">
            <h1 className="font-display text-2xl font-bold text-stone-800 leading-snug">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-4 font-medium">
              <span>By <strong className="text-stone-700">{blog.author}</strong></span>
              <span>·</span>
              <span>Published on {blog.date}</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold uppercase tracking-wider text-[9px]">{blog.status}</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-8 space-y-6 text-stone-850 leading-relaxed text-sm">
            {blog.excerpt && (
              <p className="text-base text-stone-500 italic border-l-4 border-[color:var(--saffron)] pl-4 py-1 bg-stone-50 rounded-r-lg">
                {blog.excerpt}
              </p>
            )}

            <div className="space-y-4">
              {blog.content && blog.content.length > 0 ? (
                blog.content.map((sec: any, idx: number) => {
                  switch (sec.type) {
                    case "heading":
                      return (
                        <h4 key={idx} className="font-display text-lg font-bold text-stone-900 mt-6 pt-2">
                          {sec.text}
                        </h4>
                      );
                    case "paragraph":
                      return (
                        <p key={idx} className="text-stone-700 leading-relaxed">
                          {sec.text}
                        </p>
                      );
                    case "quote":
                      return (
                        <blockquote key={idx} className="bg-stone-100/70 border-l-4 border-amber-500 p-4 italic text-stone-650 rounded-r-lg my-4">
                          {sec.text}
                        </blockquote>
                      );
                    case "list":
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-2 text-stone-700 my-2">
                          {sec.items?.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      );
                    case "divider":
                      return <hr key={idx} className="border-stone-200 my-6" />;
                    default:
                      return null;
                  }
                })
              ) : (
                <p className="text-stone-400 italic">No article content blocks available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 bg-stone-50/50 flex justify-end gap-3">
          <a
            href={`/journal/${blog.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 bg-[color:var(--ink)] text-[color:var(--ivory)] py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow hover:bg-[color:var(--saffron)] transition-all duration-300 text-center flex items-center justify-center"
          >
            Open on Website
          </a>
          <button
            onClick={onClose}
            className="px-6 border border-stone-200 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-white hover:bg-stone-50 hover:border-stone-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Coupons ---------------- */
function CouponsView() {
  const { coupons } = useAdminState();
  const [creating, setCreating] = useState(false);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader
        title="Coupons"
        sub={`${coupons.filter((c) => c.active).length} active discount codes.`}
        action={
          <button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-[color:var(--saffron)] text-[color:var(--ink)] px-5 py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-[color:var(--ink)] hover:text-white transition-all duration-300 shadow">
            <Plus className="h-4 w-4" /> New coupon
          </button>
        }
      />

      <div className="grid md:grid-cols-2 gap-6">
        {coupons.map((c) => (
          <div key={c.code} className="relative border border-stone-200 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${c.active ? "bg-[color:var(--saffron)]" : "bg-stone-200"}`} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl tracking-wide font-bold text-stone-800">{c.code}</p>
                <p className="text-xs text-stone-500 mt-1">{c.description}</p>
              </div>
              <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full ${c.active ? "bg-emerald-50 text-emerald-650" : "bg-stone-100 text-stone-400"}`}>
                {c.active ? "Active" : "Disabled"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-stone-100 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-450 font-bold">Discount</p>
                <p className="font-display text-lg font-bold mt-1 text-stone-850">{c.discountPct}%</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-450 font-bold">Uses</p>
                <p className="font-display text-lg font-bold mt-1 text-stone-850">{c.uses}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-450 font-bold">Expires</p>
                <p className="text-stone-700 font-semibold text-xs mt-2">{new Date(c.expires).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-stone-100">
              <button
                onClick={() => {
                  adminStore.toggleCoupon(c.code);
                }}
                className={`flex-1 border rounded-lg py-2 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 ${
                  c.active
                    ? "border-red-200 hover:bg-red-50 text-red-650"
                    : "border-emerald-200 hover:bg-emerald-50 text-emerald-650"
                }`}
              >
                {c.active ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete coupon ${c.code}?`)) {
                    adminStore.deleteCoupon(c.code);
                  }
                }}
                className="px-4 border border-stone-200 rounded-lg py-2 text-stone-450 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {creating && <CouponDrawer onClose={() => setCreating(false)} />}
    </div>
  );
}

function CouponDrawer({ onClose }: { onClose: () => void }) {
  const [c, setC] = useState<Coupon>({ code: "", description: "", discountPct: 10, expires: "2026-12-31", uses: 0, active: true });

  function save() {
    if (!c.code) { toast.error("Code required"); return; }
    adminStore.addCoupon({ ...c, code: c.code.toUpperCase() });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-[#FAF9F5] border-l border-stone-200 overflow-y-auto flex flex-col justify-between">
        <div>
          <div className="sticky top-0 bg-[#FAF9F5]/90 backdrop-blur border-b border-stone-200 p-6 flex items-center justify-between z-10">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">New</p>
              <h3 className="font-display text-xl font-bold text-stone-850 mt-1">Add coupon</h3>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-750 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="p-6 space-y-4">
            <Field label="Code" value={c.code} onChange={(v) => setC({ ...c, code: v.toUpperCase() })} />
            <Field label="Description" value={c.description} onChange={(v) => setC({ ...c, description: v })} />
            <div className="grid grid-cols-2 gap-4">
              <NumField label="Discount %" value={c.discountPct} onChange={(v) => setC({ ...c, discountPct: v })} />
              <Field label="Expires" value={c.expires} onChange={(v) => setC({ ...c, expires: v })} type="date" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl mt-2">
              <div>
                <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">Initial Status</p>
                <p className="text-[10px] text-stone-450 mt-0.5">{c.active ? "Coupon is active immediately" : "Coupon is created as disabled"}</p>
              </div>
              <button
                type="button"
                onClick={() => setC({ ...c, active: !c.active })}
                className={`px-4 py-2 border rounded-lg transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider bg-white ${
                  c.active
                    ? "border-emerald-200 text-emerald-600 hover:border-emerald-300"
                    : "border-stone-200 text-stone-500 hover:border-stone-300"
                }`}
              >
                {c.active ? "Active" : "Disabled"}
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-stone-200 bg-stone-50 flex gap-3">
          <button onClick={save} className="flex-1 bg-[color:var(--ink)] text-[color:var(--ivory)] py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow hover:bg-[color:var(--saffron)] transition-all duration-300 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Create coupon
          </button>
          <button onClick={onClose} className="px-6 border border-stone-200 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white hover:border-stone-300 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}
