"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";

import ProductHeader from "@/components/learn/ProductHeader";
import type { Locale } from "@/lib/i18n";
import { learnText } from "@/lib/i18n/learn";
import { t } from "@/lib/t";
import type { ContentProduct } from "@/types/content-product";

type UnlockedProductExperienceProps = {
  product: ContentProduct;
  language: Locale;
  selectedLessonId: string;
  onSelectLesson: (id: string) => void;
};

export default function UnlockedProductExperience({
  product,
  language,
  selectedLessonId,
  onSelectLesson,
}: UnlockedProductExperienceProps) {
  const selectedLesson =
    product.lessons.find((item) => item.id === selectedLessonId) ??
    product.lessons[0];

  const selectedLessonIndex = selectedLesson
    ? product.lessons.findIndex((item) => item.id === selectedLesson.id)
    : -1;

  return (
    <div className="mt-5 grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <motion.aside
        initial={{
          opacity: 0,
          y: 12,
          filter: "blur(3px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1,
          delay: 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
      >
        <ProductHeader
          product={product}
          language={language}
          variant="unlocked"
        />

        <div className="border-t border-white/10 px-5 py-3.5">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/30">
            {t(learnText.content, language)}
          </p>
        </div>

        <div className="border-t border-white/10">
          {product.lessons.map((item, index) => {
            const isSelected = item.id === selectedLesson?.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectLesson(item.id)}
                className={`group flex w-full items-center gap-3 border-b border-white/[0.07] px-5 py-4 text-left transition last:border-b-0 ${
                  isSelected ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                }`}
              >
                <span className="w-7 shrink-0 font-mono text-xs text-white/25">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className={`min-w-0 flex-1 text-sm font-medium ${
                    isSelected ? "text-white" : "text-white/55"
                  }`}
                >
                  {t(item.title, language)}
                </span>

                {isSelected && (
                  <Play className="h-3.5 w-3.5 shrink-0 text-white/50" />
                )}
              </button>
            );
          })}
        </div>
      </motion.aside>

      <motion.div
        initial={{
          opacity: 0,
          y: 14,
          filter: "blur(3px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.35,
          delay: 0.16,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
      >
        {selectedLesson ? (
          <>
            <video
              key={selectedLesson.id}
              src={selectedLesson.videoUrl}
              controls
              className="aspect-video w-full bg-black object-cover"
            />

            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/30">
                {language === "pt" ? "Aula" : "Lesson"}{" "}
                {String(selectedLessonIndex + 1).padStart(2, "0")}
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                {t(selectedLesson.title, language)}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
                {t(selectedLesson.description, language)}
              </p>
            </div>
          </>
        ) : (
          <div className="flex min-h-80 items-center justify-center p-6 text-center">
            <p className="text-sm text-white/40">
              {language === "pt"
                ? "Nenhuma aula disponível."
                : "No lessons available."}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
