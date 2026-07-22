import Container from "@/components/ui/Container";
import { lessons } from "@/lib/lessons";
import Image from "next/image";
import { notFound } from "next/navigation";

type LessonPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;

  const lesson = lessons.find((lesson) => lesson.slug === slug);

  if (!lesson) {
    notFound();
  }

  return (
    <main className="pt-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
            <Image
              src={lesson.image}
              alt={lesson.title.pt}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-magenta">
              {lesson.artist}
            </p>

            <h1 className="mt-6 text-6xl font-medium tracking-tighter">
              {lesson.title.pt}
            </h1>

            <div className="mt-8 flex gap-6 text-muted">
              <span>{lesson.difficulty}</span>
              <span>{lesson.price}</span>
            </div>

            <button className="mt-10 rounded-full bg-foreground px-8 py-4 text-background transition-opacity hover:opacity-80">
              Comprar aula
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
}
