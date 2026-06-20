import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { adminStore, ORDER_STATUS_LIST, type Coupon, type Customer } from "@/lib/admin/adminStore";
import type { Order, OrderStatus, Product } from "@/lib/types";
import { getDefaultImage, getBasePrice, getTotalStock } from "@/lib/types";
import { toast } from "sonner";
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
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Dharmik" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const ADMIN_USER = "admin";
const ADMIN_PASS = "dharmik123";
const SESSION_KEY = "dharmik_admin_session";

type TabKey = "dashboard" | "products" | "orders" | "customers" | "coupons";
const NAV: { key: TabKey; label: string; icon: typeof Package }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "customers", label: "Customers", icon: Users },
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(sessionStorage.getItem(SESSION_KEY) === "1");
    }
  }, []);

  if (!authed) return <AdminLogin onAuthed={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#0e0b08] text-[color:var(--ivory)]">
      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] min-h-screen">
        {/* Sidebar */}
        <aside className="border-r border-white/10 bg-black/40 backdrop-blur lg:sticky lg:top-0 lg:h-screen">
          <div className="p-6 border-b border-white/10">
            <p className="font-display text-2xl text-[color:var(--saffron)]">Dharmik</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1">Admin Console</p>
          </div>
          <nav className="p-3">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = tab === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => setTab(n.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-widest text-[11px] transition-all ${
                    active
                      ? "bg-[color:var(--saffron)] text-[color:var(--ink)] font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-white/10 mt-auto absolute bottom-0 left-0 right-0 lg:relative lg:mt-6">
            <button
              onClick={() => { adminStore.reset(); toast.success("Demo data reset"); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5"
            >
              <RotateCcw className="h-4 w-4" /> Reset demo
            </button>
            <button
              onClick={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-widest text-white/50 hover:text-red-400 hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0">
          {tab === "dashboard" && <Dashboard onNav={setTab} />}
          {tab === "products" && <ProductsView />}
          {tab === "orders" && <OrdersView />}
          {tab === "customers" && <CustomersView />}
          {tab === "coupons" && <CouponsView />}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Login ---------------- */
function AdminLogin({ onAuthed }: { onAuthed: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "1");
      toast.success("Welcome, admin.");
      onAuthed();
    } else {
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0e0b08] via-[#1a1410] to-[#0e0b08] text-[color:var(--ivory)] p-6">
      <div className="w-full max-w-md border border-white/10 bg-black/40 backdrop-blur p-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[color:var(--saffron)] text-[color:var(--ink)] grid place-items-center">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-2xl">Admin Console</p>
            <p className="text-xs text-white/50">Dharmik — restricted access</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field label="Username" value={u} onChange={setU} />
          <Field label="Password" value={p} onChange={setP} type="password" />
          <button className="w-full bg-[color:var(--saffron)] text-[color:var(--ink)] py-3.5 text-xs uppercase tracking-[0.3em] font-medium hover:bg-[color:var(--ivory)] transition-colors">
            Sign in
          </button>
        </form>
        <p className="mt-6 text-[11px] text-white/40 text-center">Demo · admin / dharmik123</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-white/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)]"
        required
      />
    </label>
  );
}

/* ---------------- Header / Shell ---------------- */
function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8 pb-6 border-b border-white/10">
      <div>
        <h1 className="font-display text-4xl">{title}</h1>
        {sub && <p className="text-sm text-white/50 mt-2">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard({ onNav }: { onNav: (t: TabKey) => void }) {
  const { orders, products, customers, coupons } = useAdminState();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;
  const pending = orders.filter((o) => o.orderStatus !== "delivered").length;

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
    <div className="p-8 lg:p-12">
      <PageHeader title="Dashboard" sub="Overview of your sacred storefront." />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} icon={IndianRupee} accent />
        <StatCard label="Orders" value={String(orders.length)} icon={ShoppingCart} hint={`${pending} pending`} />
        <StatCard label="Customers" value={String(customers.length)} icon={UserPlus} />
        <StatCard label="Avg. order value" value={`₹${aov.toLocaleString("en-IN")}`} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mt-8">
        <Panel title="Top products" action={<button onClick={() => onNav("products")} className="text-[11px] uppercase tracking-widest text-[color:var(--saffron)]">Manage →</button>}>
          <div className="divide-y divide-white/5">
            {topProducts.map(({ product, qty, revenue }) => (
              <div key={product.id} className="flex items-center gap-4 py-3">
                <img src={getDefaultImage(product)} alt={product.title} className="h-12 w-12 object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{product.title}</p>
                  <p className="text-[11px] text-white/40 uppercase tracking-widest mt-0.5">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">₹{revenue.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-white/40">{qty} sold</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-white/40 py-4">No sales yet.</p>}
          </div>
        </Panel>

        <Panel title="Recent orders" action={<button onClick={() => onNav("orders")} className="text-[11px] uppercase tracking-widest text-[color:var(--saffron)]">View all →</button>}>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.orderId} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate">{o.shippingAddress.fullName}</p>
                  <p className="text-[11px] text-white/40">#{o.orderId}</p>
                </div>
                <div className="text-right">
                  <p>₹{o.total.toLocaleString("en-IN")}</p>
                  <StatusPill status={o.orderStatus} mini />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <MiniCard label="Active coupons" value={String(coupons.filter((c) => c.active).length)} sub={`${coupons.length} total`} />
        <MiniCard label="Low stock" value={String(products.filter((p) => getTotalStock(p) < 5).length)} sub="below 5 units" />
        <MiniCard label="Collections" value={String(new Set(products.map((p) => p.collection)).size)} sub="active lines" />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, hint, accent }: { label: string; value: string; icon: typeof Package; hint?: string; accent?: boolean }) {
  return (
    <div className={`border p-6 ${accent ? "border-[color:var(--saffron)]/40 bg-gradient-to-br from-[color:var(--saffron)]/15 to-transparent" : "border-white/10 bg-white/[0.02]"}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-white/50">{label}</p>
        <Icon className={`h-4 w-4 ${accent ? "text-[color:var(--saffron)]" : "text-white/40"}`} />
      </div>
      <p className="font-display text-4xl mt-3">{value}</p>
      {hint && <p className="text-[11px] text-white/40 mt-1">{hint}</p>}
    </div>
  );
}

function MiniCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-5">
      <p className="text-[10px] uppercase tracking-widest text-white/50">{label}</p>
      <p className="font-display text-2xl mt-2">{value}</p>
      <p className="text-[11px] text-white/40 mt-1">{sub}</p>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">{title}</h2>
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

  const filtered = products.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-8 lg:p-12">
      <PageHeader
        title="Products"
        sub={`${products.length} items across your catalog.`}
        action={
          <button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-[color:var(--saffron)] text-[color:var(--ink)] px-5 py-3 text-[11px] uppercase tracking-widest font-medium hover:bg-[color:var(--ivory)] transition-colors">
            <Plus className="h-4 w-4" /> New product
          </button>
        }
      />

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)]"
        />
      </div>

      <div className="border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/50">
            <tr>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
              <th className="text-right px-4 py-3">Price</th>
              <th className="text-right px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={getDefaultImage(p)} alt={p.title} className="h-12 w-12 object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate">{p.title}</p>
                      <p className="text-[11px] text-white/40 truncate">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-white/60 capitalize hidden md:table-cell">{p.category}</td>
                <td className="px-4 py-3 text-right">₹{getBasePrice(p).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2 py-1 text-[11px] ${getTotalStock(p) < 5 ? "bg-red-500/15 text-red-300" : "text-white/60"}`}>{getTotalStock(p)}</span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(p)} className="text-[11px] uppercase tracking-widest text-[color:var(--saffron)] hover:underline mr-3">Edit</button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.title}"?`)) {
                        adminStore.deleteProduct(p.id);
                        toast.success("Product deleted");
                      }
                    }}
                    className="text-white/40 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-white/40">No products match your search.</td></tr>
            )}
          </tbody>
        </table>
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

  // Derive simple editable fields from first variant for the admin form
  const firstVariant = form.variants[0];
  const firstSize = firstVariant?.sizes[0];

  function save() {
    if (!form.title || !form.slug) { toast.error("Title and slug required"); return; }
    if (isNew) adminStore.addProduct(form);
    else adminStore.updateProduct(form.id, form);
    toast.success(isNew ? "Product added" : "Product updated");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-[#16110d] border-l border-white/10 overflow-y-auto">
        <div className="sticky top-0 bg-[#16110d] border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">{isNew ? "New" : "Edit"}</p>
            <h3 className="font-display text-2xl mt-1">{isNew ? "Add product" : form.title}</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-white/50">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="mt-1.5 w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)]"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <NumField
              label="Base price (₹)"
              value={firstSize?.price ?? 999}
              onChange={(v) => setForm({
                ...form,
                variants: form.variants.map((vt, vi) =>
                  vi === 0 ? { ...vt, sizes: vt.sizes.map((s, si) => si === 0 ? { ...s, price: v } : s) } : vt
                ),
              })}
            />
            <NumField
              label="Stock (first size)"
              value={firstSize?.stock ?? 0}
              onChange={(v) => setForm({
                ...form,
                variants: form.variants.map((vt, vi) =>
                  vi === 0 ? { ...vt, sizes: vt.sizes.map((s, si) => si === 0 ? { ...s, stock: v } : s) } : vt
                ),
              })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Category"
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v as Product["category"] })}
              options={["tshirts", "hoodies", "sweatshirts", "polos", "jackets", "caps", "accessories", "wall-art"]}
            />
            <SelectField
              label="Collection"
              value={form.collection}
              onChange={(v) => setForm({ ...form, collection: v as Product["collection"] })}
              options={["mahadev", "shri-ram", "krishna", "hanuman", "bhagavad-gita", "sanskrit", "temple-architecture", "durga"]}
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
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button onClick={save} className="flex-1 bg-[color:var(--saffron)] text-[color:var(--ink)] py-3 text-[11px] uppercase tracking-widest font-medium hover:bg-[color:var(--ivory)] transition-colors">
              {isNew ? "Add product" : "Save changes"}
            </button>
            <button onClick={onClose} className="px-6 border border-white/10 text-[11px] uppercase tracking-widest hover:bg-white/5">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-white/50">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)]"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-white/50">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)] capitalize"
      >
        {options.map((o) => <option key={o} value={o} className="bg-[#16110d]">{o}</option>)}
      </select>
    </label>
  );
}

/* ---------------- Orders ---------------- */
function OrdersView() {
  const { orders } = useAdminState();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const list = filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  return (
    <div className="p-8 lg:p-12">
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

      <div className="space-y-3">
        {list.map((o) => <OrderRow key={o.orderId} order={o} />)}
        {list.length === 0 && <p className="text-center text-white/40 py-12">No orders in this filter.</p>}
      </div>
    </div>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[11px] uppercase tracking-widest border transition-colors ${
        active ? "border-[color:var(--saffron)] bg-[color:var(--saffron)] text-[color:var(--ink)]" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function OrderRow({ order }: { order: Order }) {
  const date = new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="border border-white/10 bg-white/[0.02] p-5">
      <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-center">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-white/40">#{order.orderId}</p>
          <p className="font-medium mt-1">{order.shippingAddress.fullName}</p>
          <p className="text-xs text-white/50 mt-0.5">{order.shippingAddress.city}, {order.shippingAddress.state} · {date}</p>
        </div>
        <div className="flex items-center gap-2">
          {order.items.slice(0, 4).map((it, i) => (
            <img key={i} src={it.image} alt={it.title} className="h-12 w-12 object-cover border border-white/10" />
          ))}
          <div className="ml-2">
            <p className="text-sm">₹{order.total.toLocaleString("en-IN")}</p>
            <p className="text-[11px] text-white/40 uppercase">{order.paymentMethod}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={order.orderStatus} />
          <select
            value={order.orderStatus}
            onChange={(e) => {
              adminStore.updateOrderStatus(order.orderId, e.target.value as OrderStatus);
              toast.success(`Order ${order.orderId} → ${e.target.value}`);
            }}
            className="bg-white/5 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-[color:var(--saffron)] capitalize"
          >
            {ORDER_STATUS_LIST.map((s) => <option key={s} value={s} className="bg-[#16110d]">{s.replace(/-/g, " ")}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status, mini }: { status: OrderStatus; mini?: boolean }) {
  const colors: Record<OrderStatus, string> = {
    placed: "bg-blue-500/15 text-blue-300",
    packed: "bg-amber-500/15 text-amber-300",
    shipped: "bg-purple-500/15 text-purple-300",
    "out-for-delivery": "bg-cyan-500/15 text-cyan-300",
    delivered: "bg-emerald-500/15 text-emerald-300",
  };
  return (
    <span className={`inline-block ${colors[status]} ${mini ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2.5 py-1"} uppercase tracking-widest`}>
      {status.replace(/-/g, " ")}
    </span>
  );
}

/* ---------------- Customers ---------------- */
function CustomersView() {
  const { customers } = useAdminState();
  const [q, setQ] = useState("");
  const sorted = useMemo(() => [...customers].sort((a, b) => b.spent - a.spent), [customers]);
  const list = sorted.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.includes(q.toLowerCase()));

  return (
    <div className="p-8 lg:p-12">
      <PageHeader title="Customers" sub={`${customers.length} customers across India.`} />

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[color:var(--saffron)]"
        />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((c) => <CustomerCard key={c.id} customer={c} />)}
      </div>
    </div>
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  const initials = customer.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const joined = new Date(customer.joinedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  return (
    <div className="border border-white/10 bg-white/[0.02] p-5 hover:border-[color:var(--saffron)]/40 transition-colors">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-[color:var(--saffron)] text-[color:var(--ink)] grid place-items-center font-display text-lg">{initials}</div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{customer.name}</p>
          <p className="text-xs text-white/50 truncate">{customer.email}</p>
          <p className="text-[11px] text-white/40 mt-1">{customer.city} · joined {joined}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40">Orders</p>
          <p className="font-display text-xl mt-1">{customer.orders}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40">Spent</p>
          <p className="font-display text-xl mt-1 text-[color:var(--saffron)]">₹{customer.spent.toLocaleString("en-IN")}</p>
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
    <div className="p-8 lg:p-12">
      <PageHeader
        title="Coupons"
        sub={`${coupons.filter((c) => c.active).length} active discount codes.`}
        action={
          <button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-[color:var(--saffron)] text-[color:var(--ink)] px-5 py-3 text-[11px] uppercase tracking-widest font-medium hover:bg-[color:var(--ivory)] transition-colors">
            <Plus className="h-4 w-4" /> New coupon
          </button>
        }
      />

      <div className="grid md:grid-cols-2 gap-4">
        {coupons.map((c) => (
          <div key={c.code} className="relative border border-white/10 bg-white/[0.02] p-6 overflow-hidden">
            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${c.active ? "bg-[color:var(--saffron)]" : "bg-white/10"}`} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl tracking-wide">{c.code}</p>
                <p className="text-sm text-white/60 mt-1">{c.description}</p>
              </div>
              <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${c.active ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-white/40"}`}>
                {c.active ? "Active" : "Disabled"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/5 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Discount</p>
                <p className="font-display text-lg mt-1">{c.discountPct}%</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Uses</p>
                <p className="font-display text-lg mt-1">{c.uses}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Expires</p>
                <p className="text-sm mt-2">{new Date(c.expires).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { adminStore.toggleCoupon(c.code); toast.success(`Coupon ${c.active ? "disabled" : "enabled"}`); }}
                className="flex-1 border border-white/10 py-2 text-[11px] uppercase tracking-widest hover:bg-white/5"
              >
                {c.active ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete coupon ${c.code}?`)) {
                    adminStore.deleteCoupon(c.code);
                    toast.success("Coupon deleted");
                  }
                }}
                className="px-4 border border-white/10 py-2 text-white/40 hover:text-red-400 hover:border-red-500/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
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
    toast.success("Coupon added");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md bg-[#16110d] border-l border-white/10 overflow-y-auto">
        <div className="border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">New</p>
            <h3 className="font-display text-2xl mt-1">Add coupon</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Code" value={c.code} onChange={(v) => setC({ ...c, code: v.toUpperCase() })} />
          <Field label="Description" value={c.description} onChange={(v) => setC({ ...c, description: v })} />
          <div className="grid grid-cols-2 gap-4">
            <NumField label="Discount %" value={c.discountPct} onChange={(v) => setC({ ...c, discountPct: v })} />
            <Field label="Expires" value={c.expires} onChange={(v) => setC({ ...c, expires: v })} type="date" />
          </div>
          <button onClick={save} className="w-full bg-[color:var(--saffron)] text-[color:var(--ink)] py-3 text-[11px] uppercase tracking-widest font-medium hover:bg-[color:var(--ivory)] transition-colors mt-2 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Create coupon
          </button>
        </div>
      </div>
    </div>
  );
}
