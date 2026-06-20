import { Star } from "lucide-react";

export type ReviewItem = {
  name: string;
  avatar: string;
  rating: number;
  title?: string;
  body: string;
  location?: string;
};

export function ReviewMarquee({ reviews, speedSec = 50 }: { reviews: ReviewItem[]; speedSec?: number }) {
  // duplicate the list so the -50% translate loops seamlessly
  const track = [...reviews, ...reviews];
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className="flex gap-4 md:gap-6 w-max marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speedSec}s` }}
      >
        {track.map((r, i) => (
          <figure
            key={i}
            className="w-[300px] md:w-[380px] shrink-0 bg-card p-6 md:p-7 border border-[color:var(--border)] relative"
          >
            <span className="absolute top-4 right-5 font-display text-5xl text-[color:var(--saffron)]/15 leading-none">"</span>
            <div className="flex items-center gap-3">
              <img
                src={r.avatar}
                alt={r.name}
                loading="lazy"
                className="size-11 rounded-full object-cover border border-[color:var(--border)]"
              />
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{r.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {r.location ? `${r.location} · ` : ""}Verified buyer
                </p>
              </div>
            </div>
            <div className="flex gap-0.5 mt-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`size-3.5 ${j < Math.floor(r.rating) ? "fill-[color:var(--gold)] text-[color:var(--gold)]" : "text-muted"}`}
                />
              ))}
            </div>
            <blockquote className="mt-3">
              {r.title && <p className="font-display text-lg leading-snug">{r.title}</p>}
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-5">{r.body}</p>
            </blockquote>
          </figure>
        ))}
      </div>
    </div>
  );
}
