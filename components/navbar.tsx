import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-purple-main text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold tracking-wide">
          gasasteget
        </Link>
        <div className="hidden gap-8 text-sm font-medium uppercase tracking-wider md:flex">
          <a href="#" className="transition-colors hover:text-purple-accent">Aktuellt</a>
          <a href="#" className="transition-colors hover:text-purple-accent">Kurser &amp; Event</a>
          <a href="#" className="transition-colors hover:text-purple-accent">Kalender</a>
          <a href="#" className="transition-colors hover:text-purple-accent">Socialdans</a>
          <a href="#" className="transition-colors hover:text-purple-accent">Tävling</a>
          <a href="#" className="transition-colors hover:text-purple-accent">Föreningen</a>
        </div>
      </div>
    </nav>
  );
}
