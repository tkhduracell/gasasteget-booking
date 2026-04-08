import { TopBar } from "@/components/top-bar";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { CourseCards } from "@/components/course-cards";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <TopBar />
      <Navbar />
      <Hero />
      <CourseCards />
      <Footer />
    </main>
  );
}
