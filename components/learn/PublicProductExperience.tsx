"use client";

import type { RefObject } from "react";
import { motion } from "framer-motion";

import LessonPreviewPlayer from "@/components/learn/LessonPreviewPlayer";
import LockedLessonList from "@/components/learn/LockedLessonList";
import ProductHeader from "@/components/learn/ProductHeader";
import type { Locale } from "@/lib/i18n";
import type { ContentProduct } from "@/types/content-product";

type PublicProductExperienceProps = {
  product: ContentProduct;
  language: Locale;
  formattedPrice: string;
  completeProductLabel: string;
  unlockLabel: string;
  onUnlock: () => void;
  leftColumnRef: RefObject<HTMLDivElement | null>;
  rightColumnRef: RefObject<HTMLDivElement | null>;
};

export default function PublicProductExperience({
  product,
  language,
  formattedPrice,
  completeProductLabel,
  unlockLabel,
  onUnlock,
  leftColumnRef,
  rightColumnRef,
}: PublicProductExperienceProps) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div ref={leftColumnRef} className="self-start will-change-transform">
        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
        >
          <div className="flex min-h-[540px] flex-col justify-between p-6 sm:p-7">
            <ProductHeader
              product={product}
              language={language}
              variant="public"
            />

            <div className="mt-10 border-t border-white/10 pt-5">
              <p className="text-xs text-white/30">{completeProductLabel}</p>

              <div className="mt-1 flex items-end justify-between gap-4">
                <p className="text-2xl font-semibold tracking-tight text-white">
                  {formattedPrice}
                </p>

                <span className="text-xs text-white/25">
                  {language === "pt" ? "Pagamento único" : "One-time payment"}
                </span>
              </div>

              <button
                type="button"
                onClick={onUnlock}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/85"
              >
                {unlockLabel}
              </button>
            </div>
          </div>
        </motion.aside>
      </div>

      <div ref={rightColumnRef} className="min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.85,
            delay: 0.16,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-black"
        >
          <LessonPreviewPlayer
            previewUrl={product.previewVideo}
            language={language}
          />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.9,
            delay: 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018]"
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/30">
              {language === "pt" ? "Conteúdo" : "Content"}
            </p>

            <span className="text-xs text-white/20">
              {product.lessons.length}{" "}
              {language === "pt"
                ? product.lessons.length === 1
                  ? "Aula"
                  : "Aulas"
                : product.lessons.length === 1
                  ? "Lesson"
                  : "Lessons"}
            </span>
          </div>

          <LockedLessonList lessons={product.lessons} language={language} />
        </motion.div>
      </div>
    </div>
  );
}
