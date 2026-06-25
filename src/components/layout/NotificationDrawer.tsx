import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, X, Mail, Inbox, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { useUI } from "@/stores/ui";
import { db } from "@/lib/firebase/firestore";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";

interface NotificationEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: "subscription" | "new-product" | "new-blog";
  targetTitle?: string;
  targetSlug?: string;
  sentAt: string;
}

export function NotificationDrawer() {
  const open = useUI((s) => s.notificationsOpen);
  const setOpen = useUI((s) => s.setNotificationsOpen);
  const [emailInput, setEmailInput] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState<NotificationEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Read email from localStorage on mount & drawer open
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dharmik_subscribed_email");
      if (stored) {
        setEmail(stored);
        setEmailInput(stored);
      }
    }
  }, [open]);

  // Focus input if no email is set
  useEffect(() => {
    if (open && !email) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, email]);

  // Mark all as read when opening drawer with email
  useEffect(() => {
    if (open && email) {
      localStorage.setItem(`dharmik_last_read_${email}`, new Date().toISOString());
      // Trigger update on Header count
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("dharmik_subscription_change"));
    }
  }, [open, email]);

  // Listen for escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Live listener to Firestore notifications for the email
  useEffect(() => {
    if (!email) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "sent_emails"),
        where("to", "==", email.toLowerCase().trim())
      );

      const unsubscribe = onSnapshot(q, (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as NotificationEmail);
        // Sort descending by sentAt locally
        const sorted = list.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
        setNotifications(sorted);
        setLoading(false);
      }, (err) => {
        console.error("Firestore onSnapshot error in NotificationDrawer:", err);
        setLoading(false);
      });

      return unsubscribe;
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [email]);

  function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    if (typeof window !== "undefined") {
      localStorage.setItem("dharmik_subscribed_email", cleanEmail);
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("dharmik_subscription_change"));
    }
    setEmail(cleanEmail);
    toast.success(`Loaded notifications for ${cleanEmail}`);
  }

  function handleDisconnect() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("dharmik_subscribed_email");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("dharmik_subscription_change"));
    }
    setEmail("");
    setEmailInput("");
    setNotifications([]);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[color:var(--ivory)] h-full shadow-2xl flex flex-col animate-slide-in text-foreground border-l border-[color:var(--border)]">
        {/* Header */}
        <div className="p-6 border-b border-[color:var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[color:var(--saffron)]/10 text-[color:var(--saffron)] rounded-lg">
              <Bell className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">Dharma Inbox</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Your email notifications</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:text-[color:var(--saffron)] transition-colors cursor-pointer"
            aria-label="Close notifications"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!email ? (
            /* Email Input Form */
            <div className="h-full flex flex-col justify-center text-center max-w-xs mx-auto space-y-6">
              <div className="mx-auto size-16 rounded-full bg-[color:var(--ink)]/5 flex items-center justify-center text-foreground/40">
                <Mail className="size-8" />
              </div>
              <div>
                <h3 className="font-display text-xl font-medium">Access your inbox</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Enter your email address to check notifications sent to you by Dharmik Threads.
                </p>
              </div>
              <form onSubmit={handleSaveEmail} className="space-y-3">
                <input
                  ref={inputRef}
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white border border-[color:var(--border)] px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-[color:var(--saffron)] focus:ring-1 focus:ring-[color:var(--saffron)]/10 transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-[color:var(--ink)] text-[color:var(--ivory)] py-3 text-xs uppercase tracking-[0.2em] font-semibold rounded-lg hover:bg-[color:var(--saffron)] hover:text-white transition-all cursor-pointer"
                >
                  Verify Email
                </button>
              </form>
            </div>
          ) : (
            /* Notifications List */
            <div className="space-y-6">
              {/* Active email details */}
              <div className="flex items-center justify-between p-3.5 bg-stone-100 rounded-xl border border-[color:var(--border)] text-xs">
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Subscribed as</p>
                  <p className="font-semibold text-foreground/80 truncate mt-0.5">{email}</p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-[10px] text-stone-500 hover:text-red-500 uppercase tracking-widest font-bold transition-colors cursor-pointer pl-4"
                >
                  Change
                </button>
              </div>

              {loading ? (
                <div className="py-20 text-center text-sm text-muted-foreground">
                  Synchronizing notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-20 text-center max-w-xs mx-auto space-y-4">
                  <div className="mx-auto size-12 rounded-full bg-[color:var(--ink)]/5 flex items-center justify-center text-foreground/30">
                    <Inbox className="size-6" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    No notifications sent to this email address yet. 
                    Subscriptions, new products, and journal articles will show up here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => {
                    const dateStr = new Date(notif.sentAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={notif.id}
                        className="bg-white border border-[color:var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Indicator Icon */}
                          <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                            notif.type === "subscription" 
                              ? "bg-amber-50 text-[color:var(--saffron)]" 
                              : notif.type === "new-product" 
                                ? "bg-orange-50 text-orange-600" 
                                : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {notif.type === "subscription" && <Sparkles className="size-4" />}
                            {notif.type === "new-product" && <Inbox className="size-4" />}
                            {notif.type === "new-blog" && <BookOpen className="size-4" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-muted-foreground tracking-wide font-medium">{dateStr}</p>
                            <h4 className="font-semibold text-sm text-foreground/90 mt-1 leading-snug">{notif.subject}</h4>
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">{notif.body}</p>

                            {/* Deep Links */}
                            {notif.type === "new-product" && notif.targetSlug && (
                              <Link
                                to="/product/$slug"
                                params={{ slug: notif.targetSlug }}
                                onClick={() => setOpen(false)}
                                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[color:var(--saffron)] mt-4 hover:underline cursor-pointer"
                              >
                                View Product <ArrowRight className="size-3" />
                              </Link>
                            )}

                            {notif.type === "new-blog" && notif.targetSlug && (
                              <Link
                                to="/journal/$slug"
                                params={{ slug: notif.targetSlug }}
                                onClick={() => setOpen(false)}
                                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-emerald-650 mt-4 hover:underline cursor-pointer"
                              >
                                Read Article <ArrowRight className="size-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
