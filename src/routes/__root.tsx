import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/auth";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NotificationDrawer } from "@/components/layout/NotificationDrawer";
import { Toaster } from "@/components/ui/sonner";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { WhatsAppButton } from "@/components/WhatsAppButton";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow text-[color:var(--saffron)]">404</p>
        <h1 className="font-display text-6xl mt-3">Path not found.</h1>
        <p className="mt-4 text-muted-foreground">
          The page you seek has dissolved into the void. Let us guide you back.
        </p>
        <Link
          to="/"
          className="inline-block mt-8 bg-[color:var(--ink)] text-[color:var(--ivory)] px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-[color:var(--saffron)] transition-colors"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Something interrupted the flow.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Try again, or return home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-[color:var(--ink)] text-[color:var(--ivory)] px-6 py-3 text-xs uppercase tracking-[0.25em]"
          >
            Try again
          </button>
          <a href="/" className="border border-input px-6 py-3 text-xs uppercase tracking-[0.25em]">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dharmik — Wear Your Dharma | Premium Sanatan Streetwear" },
      { name: "description", content: "Modern streetwear inspired by Sanatan heritage. Hand-illustrated, heavyweight, made in India." },
      { name: "theme-color", content: "#111111" },
      { property: "og:title", content: "Dharmik — Wear Your Dharma | Premium Sanatan Streetwear" },
      { property: "og:description", content: "Modern streetwear inspired by Sanatan heritage. Hand-illustrated, heavyweight, made in India." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dharmik" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dharmik — Wear Your Dharma | Premium Sanatan Streetwear" },
      { name: "twitter:description", content: "Modern streetwear inspired by Sanatan heritage. Hand-illustrated, heavyweight, made in India." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/551c2a85-9f38-49c3-a101-f75cea591c0e/id-preview-9a6d8169--f3d57953-4a30-4642-b054-0d37a3684ea1.lovable.app-1781271993362.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/551c2a85-9f38-49c3-a101-f75cea591c0e/id-preview-9a6d8169--f3d57953-4a30-4642-b054-0d37a3684ea1.lovable.app-1781271993362.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Tiro+Devanagari+Sanskrit&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isHideLayout = (location.pathname === "/account" && !currentUser) || location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <SplashScreen />
      {!isHideLayout && <Header />}
      <main>
        <Outlet />
      </main>
      {!isHideLayout && <Footer />}
      <CartDrawer />
      <NotificationDrawer />
      <Toaster position="top-center" richColors />
      {!isHideLayout && <WhatsAppButton />}
    </QueryClientProvider>
  );
}
