export function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-purple-main via-purple-dark to-purple-main text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2260%22%20height%3D%2260%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221.5%22%20fill%3D%22rgba(255%2C255%2C255%2C0.08)%22%2F%3E%3C%2Fsvg%3E')] opacity-60" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-purple-accent">
          Bugg | West Coast Swing | Boogie Woogie | Fox
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Gasasteget
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          Lunds Dansklubb Gasasteget, ideell danssportsförening. Kurser &amp; event
          för alla åldrar och nivåer i egen fantastisk lokal med Lunds absolut
          bästa dansgolv!
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#kurser"
            className="rounded-full border-2 border-white px-8 py-3 font-semibold uppercase tracking-wider transition-colors hover:bg-white hover:text-purple-main"
          >
            Kurser &amp; Event
          </a>
          <a
            href="#"
            className="rounded-full border-2 border-white px-8 py-3 font-semibold uppercase tracking-wider transition-colors hover:bg-white hover:text-purple-main"
          >
            Socialdans
          </a>
          <a
            href="#"
            className="rounded-full border-2 border-white px-8 py-3 font-semibold uppercase tracking-wider transition-colors hover:bg-white hover:text-purple-main"
          >
            Tävlingsverksamhet
          </a>
        </div>
      </div>
    </section>
  );
}
