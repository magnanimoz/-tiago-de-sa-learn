"use client";

import {
  BarChart3,
  CheckCircle2,
  CircleDot,
  Clock3,
  Guitar,
  Infinity,
  Music2,
  Play,
} from "lucide-react";

import ContentMetadataItem from "@/components/learn/ContentMetadataItem";
import type { Locale } from "@/lib/i18n";
import { lessonText } from "@/lib/i18n/lesson";
import { getTuningLabel } from "@/lib/get-tuning-label";
import { t } from "@/lib/t";
import type { ContentProduct } from "@/types/content-product";

type ProductHeaderProps = {
  product: ContentProduct;
  language: Locale;
  variant: "public" | "unlocked";
};

export default function ProductHeader({
  product,
  language,
  variant,
}: ProductHeaderProps) {
  const isSong = product.type === "song";
  const isCourse = product.type === "course";

  const difficultyLabel =
    product.difficulty === "Beginner"
      ? t(lessonText.beginner, language)
      : product.difficulty === "Intermediate"
        ? t(lessonText.intermediate, language)
        : t(lessonText.advanced, language);

  const tuningLabel = product.tuning
    ? getTuningLabel(product.tuning, language)
    : null;

  const previewLabel =
    language === "pt"
      ? isCourse
        ? "Prévia do curso"
        : "Prévia da aula"
      : isCourse
        ? "Course preview"
        : "Lesson preview";

  const acquiredLabel =
    language === "pt"
      ? isCourse
        ? "Curso adquirido"
        : "Aula adquirida"
      : isCourse
        ? "Course unlocked"
        : "Lesson unlocked";

  if (variant === "unlocked") {
    return (
      <div className="p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />

          <span className="text-xs font-medium text-emerald-300">
            {acquiredLabel}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white">
          {t(product.title, language)}
        </h1>

        {product.artist && (
          <p className="mt-1 text-sm text-white/45">{product.artist}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-white/35">
          <span>{product.duration}</span>

          {isSong && product.key && (
            <>
              <span className="text-white/15">•</span>

              <span>
                {t(lessonText.key, language)} {product.key}
              </span>
            </>
          )}

          {isSong && tuningLabel && (
            <>
              <span className="text-white/15">•</span>
              <span>{tuningLabel}</span>
            </>
          )}

          {isSong && product.capo && product.capo !== "No capo" && (
            <>
              <span className="text-white/15">•</span>
              <span>{product.capo}</span>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Play className="h-4 w-4 text-magenta" />

        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">
          {previewLabel}
        </p>
      </div>

      <h1
        className="
          mt-4
          text-[28px]
          font-semibold
          leading-[1.08]
          tracking-[-0.04em]
          text-white
          sm:text-[34px]
        "
      >
        {t(product.title, language)}
      </h1>

      <p className="mt-2 text-sm font-medium text-white/52">{product.artist}</p>

      <div className="mt-7 space-y-2.5">
        <ContentMetadataItem icon={Clock3}>
          {product.duration}
        </ContentMetadataItem>

        {isSong && product.key && (
          <ContentMetadataItem icon={Music2}>
            {t(lessonText.key, language)} {product.key}
          </ContentMetadataItem>
        )}

        {isSong && tuningLabel && (
          <ContentMetadataItem icon={Guitar}>{tuningLabel}</ContentMetadataItem>
        )}

        <ContentMetadataItem icon={BarChart3}>
          {difficultyLabel}
        </ContentMetadataItem>

        {isSong && product.capo && product.capo !== "No capo" && (
          <ContentMetadataItem icon={CircleDot}>
            {product.capo}
          </ContentMetadataItem>
        )}

        <ContentMetadataItem icon={Infinity}>
          {t(lessonText.lifetimeAccess, language)}
        </ContentMetadataItem>
      </div>
    </div>
  );
}
