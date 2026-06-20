import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="Dharmik home">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1" />
        <path
          d="M16 6 L16 26 M9 11 Q16 16 23 11 M9 21 Q16 16 23 21"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="2" fill="var(--saffron)" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">
        Dharmik<span className="text-[color:var(--saffron)]">.</span>
      </span>
    </Link>
  );
}
