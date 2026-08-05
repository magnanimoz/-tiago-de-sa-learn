"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import PublicProductExperience from "@/components/learn/PublicProductExperience";
import UnlockedProductExperience from "@/components/learn/UnlockedProductExperience";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useProductColumnsParallax } from "@/hooks/useProductColumnsParallax";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-path";
import type { ContentProduct } from "@/types/content-product";

type ContentProductExperienceProps = {
  product: ContentProduct;
  language: Locale;
  hasAccess: boolean;
};

export default function ContentProductExperience({
  product,
  language,
  hasAccess,
}: ContentProductExperienceProps) {
  const router = useRouter();

  const { isAuthenticated } = useAuth();
  const { routeLocale } = useSettings();

  const isCourse = product.type === "course";

  const completeProductLabel =
    language === "pt"
      ? isCourse
        ? "Curso completo"
        : "Aula completa"
      : isCourse
        ? "Full course"
        : "Full lesson";

  const unlockLabel =
    language === "pt"
      ? isCourse
        ? "Desbloquear curso"
        : "Desbloquear aula"
      : isCourse
        ? "Unlock course"
        : "Unlock lesson";

  function handleUnlock() {
    if (!isAuthenticated) {
      router.push(localePath("/login", routeLocale));
      return;
    }

    router.push(localePath(`/checkout/${product.slug}`, routeLocale));
  }

  const [selectedLessonId, setSelectedLessonId] = useState(
    product.lessons[0]?.id ?? "",
  );

  const backButtonRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  useProductColumnsParallax({
    backButtonRef,
    leftColumnRef,
    rightColumnRef,
    dependency: product.lessons.length,
  });

  const locale = language === "pt" ? "pt-BR" : "en-US";
  const currency = language === "pt" ? "BRL" : "USD";
  const amount = language === "pt" ? product.price.brl : product.price.usd;

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  function selectLesson(id: string) {
    if (!hasAccess) {
      return;
    }

    setSelectedLessonId(id);
  }

  return (
    <div className="relative">
      <section className="relative mx-auto w-full max-w-6xl">
        <motion.div
          ref={backButtonRef}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8 will-change-transform"
        >
          <Link
            href={localePath("/learn", routeLocale)}
            className="group inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white/75"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={1.8}
            />

            <span>
              {language === "pt"
                ? "Voltar para a biblioteca"
                : "Back to library"}
            </span>
          </Link>
        </motion.div>
        {!hasAccess ? (
          <PublicProductExperience
            product={product}
            language={language}
            formattedPrice={formattedPrice}
            completeProductLabel={completeProductLabel}
            unlockLabel={unlockLabel}
            onUnlock={handleUnlock}
            leftColumnRef={leftColumnRef}
            rightColumnRef={rightColumnRef}
          />
        ) : (
          <UnlockedProductExperience
            product={product}
            language={language}
            selectedLessonId={selectedLessonId}
            onSelectLesson={selectLesson}
          />
        )}
      </section>
    </div>
  );
}
