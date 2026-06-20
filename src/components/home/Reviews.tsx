import { Star } from "lucide-react";
import { ReviewMarquee, type ReviewItem } from "@/components/reviews/ReviewMarquee";

const REVIEWS: ReviewItem[] = [
  {
    name: "Aarav Sharma",
    location: "Mumbai",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 5,
    title: "Beyond expectation.",
    body: "The fabric feels like armor. The print is sharp enough to be hung in a gallery. This is what Indian streetwear should always have been.",
  },
  {
    name: "Priya Kapoor",
    location: "Bengaluru",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 5,
    title: "Tasteful and powerful.",
    body: "I was nervous about Hindu imagery on apparel — afraid of kitsch. Dharmik handles it with the reverence and craft it deserves.",
  },
  {
    name: "Rohan Mehta",
    location: "Delhi",
    avatar: "https://i.pravatar.cc/120?img=15",
    rating: 5,
    title: "My fourth order.",
    body: "Every drop is better than the last. The Krishna hoodie is the most complimented piece I own. Period.",
  },
  {
    name: "Ananya Iyer",
    location: "London",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: 5,
    title: "Worth the shipping.",
    body: "Wears beautifully, washes beautifully, holds its color after a year. A piece of home I can carry across the world.",
  },
  {
    name: "Kabir Singh",
    location: "Chandigarh",
    avatar: "https://i.pravatar.cc/120?img=68",
    rating: 5,
    title: "Heirloom quality.",
    body: "Stitching, weight, drape — every detail says someone cared. I will be passing these pieces down.",
  },
  {
    name: "Meera Nair",
    location: "Kochi",
    avatar: "https://i.pravatar.cc/120?img=44",
    rating: 4,
    title: "Soulful prints.",
    body: "The Devi tee made me tear up a little. Felt like wearing a prayer. Sizing ran true.",
  },
  {
    name: "Vivaan Joshi",
    location: "Pune",
    avatar: "https://i.pravatar.cc/120?img=14",
    rating: 5,
    title: "Streetwear with substance.",
    body: "Finally something that doesn't water down the iconography. Cuts clean, hits hard.",
  },
  {
    name: "Isha Reddy",
    location: "Hyderabad",
    avatar: "https://i.pravatar.cc/120?img=49",
    rating: 5,
    title: "Obsessed.",
    body: "Three pieces deep and already eyeing the next drop. The packaging alone is a moment.",
  },
  {
    name: "Arjun Bhatia",
    location: "Jaipur",
    avatar: "https://i.pravatar.cc/120?img=33",
    rating: 5,
    title: "Crafted, not printed.",
    body: "You can feel the difference. The gold detail catches light beautifully in person.",
  },
  {
    name: "Sanya Verma",
    location: "Toronto",
    avatar: "https://i.pravatar.cc/120?img=25",
    rating: 5,
    title: "A piece of home.",
    body: "Diaspora kid here. Wearing Dharmik feels like carrying my grandmother's blessing with me.",
  },
];


export function Reviews() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-luxe flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <p className="eyebrow text-[color:var(--saffron)]">From the community</p>
          <h2 className="font-display text-4xl md:text-6xl mt-3">
            12,000+ <span className="italic">devotees.</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4 fill-[color:var(--gold)] text-[color:var(--gold)]" />
          ))}
          <span className="text-sm font-semibold ml-2">4.9 / 5</span>
        </div>
      </div>

      <ReviewMarquee reviews={REVIEWS} speedSec={70} />

    </section>
  );
}
