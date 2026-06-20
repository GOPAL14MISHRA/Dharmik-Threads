import shiva from "@/assets/product-shiva.jpg";
import krishna from "@/assets/product-krishna.jpg";
import hanuman from "@/assets/product-hanuman.jpg";
import ram from "@/assets/product-ram.jpg";
import cap from "@/assets/product-cap.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import poster from "@/assets/product-poster.jpg";

const tiles = [
  { img: hero1, span: "row-span-2" },
  { img: shiva, span: "" },
  { img: krishna, span: "" },
  { img: hero2, span: "row-span-2" },
  { img: hanuman, span: "" },
  { img: cap, span: "" },
  { img: ram, span: "" },
  { img: poster, span: "" },
];

export function InstagramGallery() {
  return (
    <section className="py-24 md:py-32 bg-[color:var(--ink)] text-[color:var(--ivory)]">
      <div className="container-luxe text-center mb-12">
        <p className="eyebrow text-[color:var(--gold)]">@dharmik.threads</p>
        <h2 className="font-display text-4xl md:text-6xl mt-3">
          Worn by the <span className="italic">community.</span>
        </h2>
      </div>
      <div className="container-luxe grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[240px] gap-2 md:gap-3">
        {tiles.map((t, i) => (
          <a key={i} href="#" className={`relative group overflow-hidden ${t.span}`}>
            <img src={t.img} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-[color:var(--saffron)]/0 group-hover:bg-[color:var(--saffron)]/30 transition-colors" />
          </a>
        ))}
      </div>
    </section>
  );
}
