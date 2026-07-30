import CourseContent from "./CourseContent";

type CoursePageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

const courseNames: Record<string, string> = {
  "curso-nextjs": "Curso Completo de Next.js",
  "curso-react": "Curso de React Avançado",
  "curso-typescript": "Curso de TypeScript",
  "curso-tailwind": "Curso de Tailwind CSS",
  "curso-supabase": "Curso de Supabase",
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;

  const courseName = courseNames[courseSlug] ?? "Curso";

  return (
    <main className="relative min-h-screen overflow-x-clip pb-32 pt-32">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="
              absolute
              left-[-10rem]
              top-24
              h-80
              w-80
              rounded-full
              bg-magenta/15
              blur-3xl
              opacity-0
              scale-90
              animate-[blobFadeIn_1.2s_ease-out_forwards]
            "
        />

        <div
          className="
              absolute
              right-[-8rem]
              top-[28rem]
              h-72
              w-72
              rounded-full
              bg-blue/15
              blur-3xl
              opacity-0
              scale-90
              animate-[blobFadeIn_1.2s_ease-out_250ms_forwards]
            "
        />
      </div>

      <CourseContent courseName={courseName} />
    </main>
  );
}
