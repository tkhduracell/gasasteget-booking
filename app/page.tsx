import { CourseCards } from "@/components/course-cards";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-warm">
      <header className="bg-purple-main py-8 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Gasasteget
          </h1>
          <p className="mt-2 text-white/80">Boka din nästa danskurs</p>
        </div>
      </header>
      <CourseCards />
    </main>
  );
}
