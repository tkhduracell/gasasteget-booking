export function Footer() {
  return (
    <footer className="bg-purple-dark py-12 text-white/80">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold text-white">Gasasteget</h3>
            <p className="text-sm">
              Lunds Dansklubb Gasasteget
              <br />
              Ideell danssportsförening
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-bold text-white">Kontakt</h3>
            <p className="text-sm">
              Gasasteget
              <br />
              Lund
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-bold text-white">Länkar</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="transition-colors hover:text-white">Kurser &amp; Event</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Socialdans</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Bli medlem</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Kontakt</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm">
          &copy; 2026 Gasasteget. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
}
