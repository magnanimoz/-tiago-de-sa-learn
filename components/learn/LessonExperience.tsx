"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleDot,
  Clock3,
  Guitar,
  Infinity,
  Lock,
  Music2,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import { getTuningLabel } from "@/lib/get-tuning-label";
import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { learnText } from "@/lib/i18n/learn";
import { lessonText } from "@/lib/i18n/lesson";
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

  const backButtonRef = useRef<HTMLDivElement>(null);
  const salesLayoutRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backButton = backButtonRef.current!;
    const layout = salesLayoutRef.current!;
    const leftColumn = leftColumnRef.current!;
    const rightColumn = rightColumnRef.current!;

    if (!backButton || !layout || !leftColumn || !rightColumn) {
      return;
    }

    let animationFrameId: number | null = null;
    let maximumOffset = 0;

    const leftColumnSpeed = 0.35;
    const compensationRate = 1 - leftColumnSpeed;

    function measureColumns() {
      const leftHeight = leftColumn.scrollHeight;
      const rightHeight = rightColumn.scrollHeight;

      // Pequena correção visual para compensar bordas, margens e diferenças
      // perceptuais entre as duas colunas. Sem isso, elas parecem "grudar"
      // alguns pixels antes do esperado.
      const visualCorrection = -6.5;

      maximumOffset = Math.max(rightHeight - leftHeight + visualCorrection, 0);
    }

    function updateParallax() {
      animationFrameId = null;

      if (window.innerWidth < 1024) {
        backButton.style.transform = "";
        leftColumn.style.transform = "";
        return;
      }

      const compensation = Math.min(
        window.scrollY * compensationRate,
        maximumOffset,
      );

      const transform = `translate3d(0, ${compensation}px, 0)`;

      backButton.style.transform = transform;
      leftColumn.style.transform = transform;
    }

    function requestParallaxUpdate() {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(updateParallax);
    }

    function handleResize() {
      measureColumns();
      requestParallaxUpdate();
    }

    measureColumns();
    requestParallaxUpdate();

    const resizeObserver = new ResizeObserver(() => {
      measureColumns();
      requestParallaxUpdate();
    });

    resizeObserver.observe(leftColumn);
    resizeObserver.observe(rightColumn);

    window.addEventListener("scroll", requestParallaxUpdate, {
      passive: true,
    });

    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener("scroll", requestParallaxUpdate);
      window.removeEventListener("resize", handleResize);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      backButton.style.transform = "";
      leftColumn.style.transform = "";
    };
  }, [lesson.lessons.length]);

  const locale = language === "pt" ? "pt-BR" : "en-US";
  const currency = language === "pt" ? "BRL" : "USD";
  const amount = language === "pt" ? lesson.price.brl : lesson.price.usd;

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  const difficultyLabel =
    lesson.difficulty === "Beginner"
      ? t(lessonText.beginner, language)
      : lesson.difficulty === "Intermediate"
        ? t(lessonText.intermediate, language)
        : t(lessonText.advanced, language);

  const selectedLesson =
    lesson.lessons.find((item) => item.id === selectedLessonId) ??
    lesson.lessons[0];

  function selectLesson(id: string) {
    if (!hasAccess) return;

    setSelectedLessonId(id);
  }

  return (
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
            {language === "pt" ? "Voltar para a biblioteca" : "Back to library"}
          </span>
        </Link>
      </motion.div>
      {!hasAccess ? (
        <div
          ref={salesLayoutRef}
          className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]"
        >
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

                  <p className="mt-1 text-sm text-white/45">{lesson.artist}</p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2.5 text-[13px] font-light text-white/45">
                      <Clock3 className="h-4 w-4 shrink-0 text-white/30" />
                      <span>{lesson.duration}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-[13px] font-light text-white/45">
                      <Music2 className="h-4 w-4 shrink-0 text-white/30" />
                      <span>
                        {t(lessonText.key, language)} {lesson.key}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-[13px] font-light text-white/45">
                      <Guitar className="h-4 w-4 shrink-0 text-white/30" />
                      <span>{getTuningLabel(lesson.tuning, language)}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-[13px] font-light text-white/45">
                      <BarChart3 className="h-4 w-4 shrink-0 text-white/30" />
                      <span>{difficultyLabel}</span>
                    </div>

                    {lesson.capo !== "No capo" && (
                      <div className="flex items-center gap-2.5 text-[13px] font-light text-white/45">
                        <CircleDot className="h-4 w-4 shrink-0 text-white/30" />
                        <span>{lesson.capo}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5 text-[13px] font-light text-white/45">
                      <Infinity className="h-4 w-4 shrink-0 text-white/30" />
                      <span>{t(lessonText.lifetimeAccess, language)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-white/10 pt-5">
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
                previewUrl={lesson.previewVideo}
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
                  {lesson.lessons.length}{" "}
                  {language === "pt"
                    ? lesson.lessons.length === 1
                      ? "Aula"
                      : "Aulas"
                    : lesson.lessons.length === 1
                      ? "Lesson"
                      : "Lessons"}
                </span>
              </div>

              <div className="border-t border-white/[0.07]">
                {lesson.lessons.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b border-white/[0.06] px-5 py-3.5 last:border-b-0 sm:px-6"
                  >
                    <span className="w-7 shrink-0 font-mono text-[11px] text-white/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1 text-sm font-light text-white/50">
                      {t(item.title, language)}
                    </span>

                    <Lock className="h-3.5 w-3.5 shrink-0 text-white/15" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
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
      )}
    </section>
  );
}
