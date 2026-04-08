export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-warm">
      <header className="bg-purple-main py-8 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Gasasteget
          </h1>
          <p className="mt-2 text-white/80">Lokalbokning</p>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <a
            href="/schedule"
            className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 shadow-md transition-shadow hover:shadow-lg"
          >
            <span className="text-4xl">📅</span>
            <h2 className="text-xl font-bold text-purple-dark">Boka kurspass</h2>
            <p className="text-center text-sm text-gray-600">
              Schemalägg kurser och välj tider i lokalen
            </p>
          </a>
          <a
            href="#"
            className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 shadow-md transition-shadow hover:shadow-lg"
          >
            <span className="text-4xl">🕐</span>
            <h2 className="text-xl font-bold text-purple-dark">Tränarnas tillgänglighet</h2>
            <p className="text-center text-sm text-gray-600">
              Ange och se tränartider för lokalen
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
