import { createFileRoute } from "@tanstack/react-router";
import hero2 from "@/assets/hero-2.jpg";
import hero1 from "@/assets/hero-1.jpg";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Dharmik" },
      { name: "description", content: "Dharmik preserves Sanatan culture through modern, premium streetwear. Read our manifesto." },
    ],
    links: [{ rel: "canonical", href: "/story" }],
  }),
  component: Story,
});

function Story() {
  return (
    <>
      <section className="relative h-[60vh] min-h-[420px] bg-[color:var(--ink)] text-[color:var(--ivory)] overflow-hidden">
        <img src={hero2} alt="" className="absolute inset-0 size-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)] to-transparent" />
        <div className="container-luxe relative h-full flex flex-col justify-end pb-16">
          <p className="eyebrow text-[color:var(--gold)]">Manifesto</p>
          <h1 className="font-display text-6xl md:text-8xl mt-3 max-w-4xl leading-[0.95]">
            We do not sell <span className="italic">clothes.</span><br />
            We pass down <span className="text-gradient-gold">memory.</span>
          </h1>
        </div>
      </section>

      <article className="container-luxe py-20 md:py-28 max-w-3xl space-y-10 text-lg leading-relaxed text-foreground/85">
        <p className="font-display text-3xl text-foreground">
          Dharmik was born from a refusal — to let the most beautiful culture on earth
          be reduced to kitsch on cheap cotton.
        </p>
        <p>
          We are designers, artists, weavers and dyers across Mumbai, Tirupur and
          Varanasi. We grew up in a Bharat that worshipped at the temple in the
          morning and wore streetwear at night, and saw no reason these two should
          live apart.
        </p>
        <p>
          Every garment we make begins with a hand-drawn illustration. Every print
          is committed to heavyweight, garment-dyed cotton chosen for the way it
          ages. Every drop is small, slow and intentional — four times a year,
          never more.
        </p>
        <figure className="my-16">
          <img src={hero1} alt="" className="w-full aspect-[16/10] object-cover" loading="lazy" />
          <figcaption className="text-xs uppercase tracking-widest text-muted-foreground mt-3 text-center">Drop 04 · Mahadev Capsule</figcaption>
        </figure>
        <p>
          When you wear Dharmik, you wear a thousand-year-old verse, an artist's
          three-week sketch, a dyer's calloused hands, and a culture that has
          survived every empire that tried to erase it.
        </p>
        <p className="font-display text-3xl text-[color:var(--saffron)] text-center pt-8">
          Wear your dharma.
        </p>
      </article>
    </>
  );
}
