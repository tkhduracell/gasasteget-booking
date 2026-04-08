const courses = [
  {
    title: "Bugg Nybörjare",
    date: "Starts 14 april",
    level: "Nybörjare",
    description: "Lär dig grunderna i bugg — Sveriges mest populära pardans.",
  },
  {
    title: "West Coast Swing",
    date: "Starts 21 april",
    level: "Fortsättning",
    description: "Utveckla din WCS med musikalitet och partnerskap i fokus.",
  },
  {
    title: "Boogie Woogie Intro",
    date: "Starts 28 april",
    level: "Nybörjare",
    description: "Energifylld dans med rötter i rock'n'roll. Ingen förkunskap krävs.",
  },
];

export function CourseCards() {
  return (
    <section id="kurser" className="bg-gray-warm py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-purple-dark">
          Kommande kurser
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.title}
              className="flex flex-col rounded-2xl bg-white p-8 shadow-md transition-shadow hover:shadow-lg"
            >
              <span className="mb-2 inline-block w-fit rounded-full bg-purple-main/10 px-3 py-1 text-xs font-semibold uppercase text-purple-main">
                {course.level}
              </span>
              <h3 className="mt-2 text-xl font-bold text-purple-dark">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{course.date}</p>
              <p className="mt-4 flex-1 text-gray-600">{course.description}</p>
              <a
                href="#"
                className="mt-6 inline-block rounded-full bg-purple-main px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-purple-light"
              >
                Boka plats
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
