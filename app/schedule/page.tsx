import { MonthCalendar } from "../components/calendar/MonthCalendar";

export default function SchedulePage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-warm">
      <header className="bg-purple-main py-6 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Gasasteget
          </h1>
          <p className="mt-1 text-white/80">Schema</p>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <MonthCalendar />
      </div>
    </main>
  );
}
