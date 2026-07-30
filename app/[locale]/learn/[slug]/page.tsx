import { notFound } from "next/navigation";

import Container from "@/components/ui/Container";
import LessonExperience from "@/components/learn/LessonExperience";
import { createClient } from "@/lib/supabase/server";
import { userHasAccessToContent } from "@/lib/access/user-has-access-to-content";
import { isRouteLocale, routeLocaleToLanguage } from "@/lib/i18n";

type LessonPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { locale, slug } = await params;

  if (!isRouteLocale(locale)) {
    notFound();
  }

  const language = routeLocaleToLanguage(locale);

  const supabase = await createClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      `
      id,
      slug,
      type,
      title_pt,
      title_en,
      description_pt,
      description_en,
      artist,
      price_brl,
      price_usd,
      image,
      preview_video,
      duration,
      difficulty,
      musical_key,
      tuning,
      capo,
      featured,
      published
    `,
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (productError) {
    console.error("Erro ao carregar produto:", productError);
  }

  if (!product) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hasAccess = user
    ? await userHasAccessToContent({
        userId: user.id,
        contentType: "song",
        contentId: product.slug,
      })
    : false;

  const { data: databaseLessons, error: lessonsError } = hasAccess
    ? await supabase
        .from("lessons")
        .select(
          `
          id,
          position,
          title_pt,
          title_en,
          description_pt,
          description_en,
          duration,
          video_url
        `,
        )
        .eq("product_id", product.id)
        .order("position", { ascending: true })
    : { data: null, error: null };

  if (lessonsError) {
    console.error("Erro ao carregar aulas:", lessonsError);
  }

  const { data: catalogLessons, error: catalogError } = !hasAccess
    ? await supabase
        .from("lesson_catalog")
        .select(
          `
          lesson_id,
          position,
          title_pt,
          title_en,
          duration
        `,
        )
        .eq("product_id", product.id)
        .order("position", { ascending: true })
    : { data: null, error: null };

  if (catalogError) {
    console.error("Erro ao carregar catálogo das aulas:", catalogError);
  }

  const lesson = {
    slug: product.slug,

    title: {
      pt: product.title_pt,
      en: product.title_en,
    },

    artist: product.artist ?? "",

    description: {
      pt: product.description_pt,
      en: product.description_en,
    },

    price: {
      brl: Number(product.price_brl),
      usd: Number(product.price_usd),
    },

    difficulty: product.difficulty as "Beginner" | "Intermediate" | "Advanced",

    duration: product.duration ?? "",
    key: product.musical_key ?? "",
    tuning: product.tuning ?? "",
    capo: product.capo ?? "No capo",

    image: product.image ?? "",
    previewVideo: product.preview_video ?? "",

    featured: product.featured ?? false,
    published: product.published ?? false,

    lessons: hasAccess
      ? (databaseLessons ?? []).map((item) => ({
          id: item.id,

          title: {
            pt: item.title_pt,
            en: item.title_en,
          },

          description: {
            pt: item.description_pt,
            en: item.description_en,
          },

          duration: item.duration,
          videoUrl: item.video_url,
        }))
      : (catalogLessons ?? []).map((item) => ({
          id: item.lesson_id,

          title: {
            pt: item.title_pt,
            en: item.title_en,
          },

          description: {
            pt: "",
            en: "",
          },

          duration: item.duration,
          videoUrl: "",
        })),
  };

  return (
    <>
      <main className="relative overflow-x-clip pb-32 pt-32">
        {hasAccess ? (
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0d0d0f]">
            <div
              className="
                  absolute
                  inset-0
                  opacity-0
                  animate-lesson-darken
                "
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.6))",
              }}
            />

            <div
              className="
                  absolute
                  left-[59%]
                  top-[-3rem]
                  h-[52rem]
                  w-[62rem]
                  -translate-x-1/2
                  opacity-0
                  animate-lesson-amber
                "
              style={{
                background:
                  "radial-gradient(ellipse, rgba(196, 113, 49, 0.5) 0%, rgba(132, 70, 30, 0.2) 34%, rgba(80, 40, 20, 0.1) 56%, transparent 74%)",
              }}
            />
          </div>
        ) : (
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div
              className="
                absolute
                left-[-14rem]
                top-0
                h-[32rem]
                w-[32rem]
                opacity-0
                scale-90
                animate-[blobFadeIn_1.2s_ease-out_forwards]
              "
              style={{
                background:
                  "radial-gradient(circle, rgba(230, 0, 126, 0.18) 0%, rgba(230, 0, 126, 0.08) 38%, transparent 72%)",
              }}
            />

            <div
              className="
                absolute
                right-[-12rem]
                top-[24rem]
                h-[30rem]
                w-[30rem]
                opacity-0
                scale-90
                animate-[blobFadeIn_1.2s_ease-out_250ms_forwards]
              "
              style={{
                background:
                  "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.08) 38%, transparent 72%)",
              }}
            />
          </div>
        )}

        <Container>
          <LessonExperience
            lesson={lesson}
            language={language}
            hasAccess={hasAccess}
          />
        </Container>
      </main>
    </>
  );
}
