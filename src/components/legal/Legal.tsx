export function Legal({ title, body }: { title: string; body: [string, string][] }) {
  return (
    <div className="container-luxe py-20 md:py-28 max-w-3xl">
      <p className="eyebrow text-[color:var(--saffron)]">Policies</p>
      <h1 className="font-display text-5xl md:text-6xl mt-3">{title}</h1>
      <div className="mt-12 space-y-10">
        {body.map(([k, v]) => (
          <section key={k}>
            <h2 className="font-display text-2xl">{k}</h2>
            <p className="text-foreground/80 leading-relaxed mt-3">{v}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
