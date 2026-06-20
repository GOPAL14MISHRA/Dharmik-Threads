import { Link } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { SearchDrawer } from "@/components/layout/SearchDrawer";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import { useUI } from "@/stores/ui";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/story", label: "Story" },
  { to: "/journal", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const count = useCart((s) => s.items.reduce((n, x) => n + x.quantity, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-[13px] uppercase tracking-[0.18em] font-medium text-foreground/80 hover:text-[color:var(--saffron)] transition-colors relative group"
                activeProps={{ className: "text-[color:var(--saffron)]" }}
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[color:var(--saffron)] transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="p-2.5 hover:text-[color:var(--saffron)] transition-colors">
              <Search className="size-[18px]" />
            </button>
            <Link to="/account" aria-label="Account" className="p-2.5 hover:text-[color:var(--saffron)] transition-colors hidden sm:inline-flex">
              <User className="size-[18px]" />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="relative p-2.5 hover:text-[color:var(--saffron)] transition-colors">
              <Heart className="size-[18px]" />
              {wishCount > 0 && (
                <span className="absolute top-1 right-1 size-4 rounded-full bg-[color:var(--saffron)] text-[10px] font-semibold text-white grid place-items-center">
                  {wishCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Cart, ${count} items`}
              className="relative p-2.5 hover:text-[color:var(--saffron)] transition-colors"
            >
              <ShoppingBag className="size-[18px]" />
              {count > 0 && (
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
        <div className="fixed inset-0 z-[60] bg-[color:var(--ink)] text-[color:var(--ivory)] animate-fade-in">
          <div className="container-luxe flex h-16 items-center">
            <Logo />
            <button className="ml-auto p-2" aria-label="Close" onClick={() => setMobileOpen(false)}>
              <X className="size-5" />
            </button>
          </div>
          <nav className="container-luxe mt-12 flex flex-col gap-6">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="font-display text-4xl"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/account" onClick={() => setMobileOpen(false)} className="font-display text-4xl">
              Account
            </Link>
          </nav>
        </div>
      )}
      <SearchDrawer />
    </>
  );
}
