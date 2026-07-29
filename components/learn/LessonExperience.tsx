"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { CheckCircle2, Lock, Play } from "lucide-react";
import { motion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import { learnText } from "@/lib/i18n/learn";
import { localePath } from "@/lib/locale-path";
import type { Song } from "@/types/song";
import { t } from "@/lib/t";

import LessonPreviewPlayer from "./LessonPreviewPlayer";

type LessonExperienceProps = {
  lesson: Song;
  language: Locale;
  hasAccess: boolean;
};

export default function LessonExperience({
  lesson,
  language,
  hasAccess,
}: LessonExperienceProps) {
  const router = useRouter();

  const { isAuthenticated } = useAuth();
  const { routeLocale } = useSettings();

  function handleUnlock() {
    if (!isAuthenticated) {
      router.push(localePath("/login", routeLocale));
      return;
    }

    router.push(localePath(`/checkout/${lesson.slug}`, routeLocale));
  }

  const [selectedLessonId, setSelectedLessonId] = useState(
    lesson.lessons[0]?.id ?? "",
  );

  const locale = language === "pt" ? "pt-BR" : "en-US";
  const currency = language === "pt" ? "BRL" : "USD";
  const amount = language === "pt" ? lesson.price.brl : lesson.price.usd;

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  const selectedLesson =
    lesson.lessons.find((item) => item.id === selectedLessonId) ??
    lesson.lessons[0];

  function selectLesson(id: string) {
    if (!hasAccess) return;

    setSelectedLessonId(id);
  }

  return (
    <section className="relative mx-auto w-full max-w-6xl">
      {!hasAccess && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 2.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
        >
          <div className="grid lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-magenta" />

                  <p className="text-sm font-medium text-white/45">
                    {language === "pt" ? "Prévia da aula" : "Lesson preview"}
                  </p>
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  {t(lesson.title, language)}
                </h1>

                <p className="text-sm text-white/45">{lesson.artist}</p>

                <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs text-white/35">
                  <span>{lesson.duration}</span>
                  <span className="text-white/15">•</span>
                  <span>Key {lesson.key}</span>
                  <span className="text-white/15">•</span>
                  <span>{lesson.tuning}</span>

                  {lesson.capo !== "No capo" && (
                    <>
                      <span className="text-white/15">•</span>
                      <span>{lesson.capo}</span>
                    </>
                  )}
                </div>

                <p className="mt-5 text-sm leading-6 text-white/50">
                  {t(lesson.description, language)}
                </p>
              </div>

              {!hasAccess && (
                <div className="mt-8 border-t border-white/10 pt-5">
                  <p className="text-xs text-white/30">
                    {language === "pt" ? "Aula completa" : "Full lesson"}
                  </p>

                  <div className="mt-1 flex items-end justify-between gap-4">
                    <p className="text-2xl font-semibold tracking-tight text-white">
                      {formattedPrice}
                    </p>

                    <span className="text-xs text-white/25">
                      {language === "pt"
                        ? "Pagamento único"
                        : "One-time payment"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleUnlock}
                    className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/85"
                  >
                    {language === "pt" ? "Desbloquear aula" : "Unlock lesson"}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 bg-black lg:border-l lg:border-t-0">
              <LessonPreviewPlayer
                previewUrl={lesson.previewVideo}
                language={language}
              />
            </div>
          </div>
        </motion.div>
      )}
      {hasAccess ? (
        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                <span className="text-xs font-medium text-emerald-300">
                  {language === "pt" ? "Aula adquirida" : "Lesson unlocked"}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white">
                {t(lesson.title, language)}
              </h1>

              <p className="mt-1 text-sm text-white/45">{lesson.artist}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-white/35">
                <span>{lesson.duration}</span>
                <span className="text-white/15">•</span>
                <span>Key {lesson.key}</span>
                <span className="text-white/15">•</span>
                <span>{lesson.tuning}</span>

                {lesson.capo !== "No capo" && (
                  <>
                    <span className="text-white/15">•</span>
                    <span>{lesson.capo}</span>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 px-5 py-3.5">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/30">
                {t(learnText.content, language)}
              </p>
            </div>

            <div className="border-t border-white/10">
              {lesson.lessons.map((item, index) => {
                const isSelected = item.id === selectedLessonId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectLesson(item.id)}
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
          </aside>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            {selectedLesson && (
              <video
                key={selectedLesson.id}
                src={selectedLesson.videoUrl}
                controls
                className="aspect-video w-full bg-black object-cover"
              />
            )}

            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/30">
                {language === "pt" ? "Aula" : "Lesson"}{" "}
                {String(
                  lesson.lessons.findIndex(
                    (item) => item.id === selectedLessonId,
                  ) + 1,
                ).padStart(2, "0")}
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                {selectedLesson
                  ? t(selectedLesson.title, language)
                  : t(lesson.title, language)}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
                {selectedLesson
                  ? t(selectedLesson.description, language)
                  : t(lesson.description, language)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.65,
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
        >
          <div className="px-5 py-4 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/30">
              {language === "pt" ? "Conteúdo da aula" : "Lesson content"}
            </p>
          </div>

          <div className="border-t border-white/10">
            {lesson.lessons.map((item, index) => (
              <button
                key={item.id}
                type="button"
                disabled
                className="flex w-full cursor-default items-center gap-4 border-b border-white/[0.07] px-5 py-4 text-left last:border-b-0 sm:px-6"
              >
                <span className="w-8 shrink-0 font-mono text-xs text-white/25">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 text-sm font-medium text-white/60">
                  {t(item.title, language)}
                </span>

                <Lock className="h-4 w-4 shrink-0 text-white/25" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
