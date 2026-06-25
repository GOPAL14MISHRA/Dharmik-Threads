import { Link, useLocation } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, User, Menu, X, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { SearchDrawer } from "@/components/layout/SearchDrawer";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import { useUI } from "@/stores/ui";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/story", label: "Story" },
  { to: "/journal", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const location = useLocation();
  const path = location.pathname;

  function isLinkActive(to: string) {
    if (to === "/") {
      return path === "/";
    }
    // For shop: active if starts with /shop, /product, /category
    if (to === "/shop") {
      return path.startsWith("/shop") || path.startsWith("/product/") || path.startsWith("/category/");
    }
    // For collections: active if starts with /collections, /collection
    if (to === "/collections") {
      return path.startsWith("/collections") || path.startsWith("/collection/");
    }
    // For blog: active if starts with /journal
    if (to === "/journal") {
      return path.startsWith("/journal");
    }
    // Default exact match
    return path === to;
  }

  const count = useCart((s) => s.items.reduce((n, x) => n + x.quantity, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const notificationsOpen = useUI((s) => s.notificationsOpen);
  const setNotificationsOpen = useUI((s) => s.setNotificationsOpen);
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkEmail = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("dharmik_subscribed_email");
        if (stored) {
          setEmail(stored);
        } else {
          setEmail("");
        }
      }
    };

    checkEmail();
    window.addEventListener("storage", checkEmail);
    window.addEventListener("dharmik_subscription_change", checkEmail);

    return () => {
      window.removeEventListener("storage", checkEmail);
      window.removeEventListener("dharmik_subscription_change", checkEmail);
    };
  }, []);

  useEffect(() => {
    if (!email) {
      setUnreadCount(0);
      return;
    }

    try {
      const q = query(collection(db, "sent_emails"), where("to", "==", email));
      const unsubscribe = onSnapshot(q, (snap) => {
        const lastRead = localStorage.getItem(`dharmik_last_read_${email}`) || "0";
        const list = snap.docs.map((d) => d.data());
        const unread = list.filter((n) => new Date(n.sentAt).getTime() > new Date(lastRead).getTime()).length;
        setUnreadCount(unread);
      });
      return unsubscribe;
    } catch (e) {
      console.error("Firestore error in Header:", e);
    }
  }, [email, notificationsOpen]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[color:var(--ink)] text-[color:var(--ivory)] text-[11px] tracking-[0.25em] uppercase">
        <div className="container-luxe overflow-hidden whitespace-nowrap py-2">
          <div className="flex w-max gap-16 marquee">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-16">
                <span>Free shipping over ₹1,499</span>
                <span className="text-[color:var(--gold)]">॥ ॐ ॥</span>
                <span>Cash on Delivery available</span>
                <span className="text-[color:var(--gold)]">॥ ॐ ॥</span>
                <span>Use code DHARMA10 for 10% off your first order</span>
                <span className="text-[color:var(--gold)]">॥ ॐ ॥</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[color:var(--ivory)]/85 backdrop-blur-md border-b border-[color:var(--border)]"
            : "bg-[color:var(--ivory)]"
        }`}
      >
        <div className="container-luxe flex h-16 md:h-20 items-center gap-4">
          <button
            className="md:hidden -ml-2 p-2"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <Logo className="shrink-0" />

          <nav className="hidden md:flex items-center gap-9 ml-10" aria-label="Primary">
            {NAV.map((n) => {
              const active = isLinkActive(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`text-[13px] uppercase tracking-[0.18em] font-medium transition-colors relative group ${
                    active
                      ? "text-[color:var(--saffron)]"
                      : "text-foreground/80 hover:text-[color:var(--saffron)]"
                  }`}
                >
                  {n.label}
                  <span className={`absolute -bottom-1 left-0 h-px transition-all bg-[color:var(--saffron)] ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="p-2.5 hover:text-[color:var(--saffron)] transition-colors cursor-pointer">
              <Search className="size-[18px]" />
            </button>
            <Link to="/account" aria-label="Account" className="p-2.5 hover:text-[color:var(--saffron)] transition-colors hidden sm:inline-flex">
              <User className="size-[18px]" />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="relative p-2.5 hover:text-[color:var(--saffron)] transition-colors">
              <Heart className="size-[18px]" />
              {mounted && wishCount > 0 && (
                <span className="absolute top-1 right-1 size-4 rounded-full bg-[color:var(--saffron)] text-[10px] font-semibold text-white grid place-items-center">
                  {wishCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setNotificationsOpen(true)}
              aria-label="Notifications"
              className="relative p-2.5 hover:text-[color:var(--saffron)] transition-colors cursor-pointer"
            >
              <Bell className="size-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 size-4 rounded-full bg-[color:var(--saffron)] text-[10px] font-semibold text-white grid place-items-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Cart, ${count} items`}
              className="relative p-2.5 hover:text-[color:var(--saffron)] transition-colors cursor-pointer"
            >
              <ShoppingBag className="size-[18px]" />
              {mounted && count > 0 && (
                <span className="absolute top-1 right-1 size-4 rounded-full bg-[color:var(--saffron)] text-[10px] font-semibold text-white grid place-items-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
          />
          {/* Menu Drawer */}
          <div className="fixed inset-y-0 left-0 w-[50%] max-w-[280px] min-w-[200px] z-[60] bg-[color:var(--ink)] text-[color:var(--ivory)] animate-fade-in shadow-2xl flex flex-col">
            <div className="px-4 flex h-16 items-center justify-between border-b border-white/10">
              <Logo />
              <button
                className="p-1 hover:text-[color:var(--saffron)] transition-colors cursor-pointer"
                aria-label="Close"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="p-5 flex flex-col gap-5">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-[22px] tracking-wide hover:text-[color:var(--saffron)] transition-colors text-left"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="font-display text-[22px] tracking-wide hover:text-[color:var(--saffron)] transition-colors text-left"
              >
                Account
              </Link>
            </nav>
          </div>
        </>
      )}
      <SearchDrawer />
    </>
  );
}
