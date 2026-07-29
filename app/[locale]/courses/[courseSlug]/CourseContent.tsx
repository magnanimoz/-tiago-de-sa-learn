"use client";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ListVideo,
} from "lucide-react";

const lessons = [
  {
    id: 1,
    title: "Introdução ao curso",
    description:
      "Conheça a estrutura do curso e veja o que será desenvolvido nas próximas aulas.",
  },
  {
    id: 2,
    title: "Preparando o ambiente",
    description:
      "Configure as ferramentas necessárias para acompanhar o conteúdo.",
  },
  {
    id: 3,
    title: "Primeiros conceitos",
    description:
      "Comece a trabalhar com os conceitos fundamentais apresentados no curso.",
  },
];

type CourseContentProps = {
  courseName: string;
};

export default function CourseContent({ courseName }: CourseContentProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(1);

  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);

  const selectedLesson =
    lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];

  function toggleLessonCompleted(lessonId: number) {
    setCompletedLessonIds((current) => {
      const isCompleted = current.includes(lessonId);

      if (isCompleted) {
        return current.filter((id) => id !== lessonId);
      }

      return [...current, lessonId];
    });
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />

        <p className="text-sm font-stretch-110% uppercase tracking-[0.2em] text-white/60">
          Curso adquirido
        </p>
      </div>

      <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
        {courseName}
      </h1>

      <div
        className={`
          mt-14
          grid
          items-start
          gap-6
          transition-[grid-template-columns]
          duration-300
          ease-out
          ${
            isCollapsed
              ? "lg:grid-cols-[4.5rem_minmax(0,1fr)]"
              : "lg:grid-cols-[22rem_minmax(0,1fr)]"
          }
        `}
      >
        <aside className="sticky top-28 overflow-hidden rounded-2xl border border-white/10 bg-black/[0.035] backdrop-blur-sm">
          <div
            className={`
              flex
              items-center

              ${isCollapsed ? "justify-center p-3" : "justify-between px-5 py-4"}
            `}
          >
            {!isCollapsed && (
              <p className="text-sm font-light uppercase tracking-[0.18em] text-white/55">
                Conteúdo
              </p>
            )}

            <button
              type="button"
              onClick={() => setIsCollapsed((current) => !current)}
              aria-label={
                isCollapsed
                  ? "Expandir conteúdo do curso"
                  : "Recolher conteúdo do curso"
              }
              title={isCollapsed ? "Expandir conteúdo" : "Recolher conteúdo"}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                text-white/55
                transition
                hover:border-white/20
                hover:bg-white/[0.06]
                hover:text-white
              "
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3 px-3 py-4">
              <ListVideo className="mb-1 h-5 w-5 text-white/45" />

              {lessons.map((lesson) => {
                const isSelected = lesson.id === selectedLessonId;
                const isCompleted = completedLessonIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLessonId(lesson.id)}
                    aria-label={`Abrir aula ${lesson.id}: ${lesson.title}`}
                    title={`Aula ${lesson.id}: ${lesson.title}`}
                    className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        border
                        text-sm
                        font-semibold
                        transition
                        ${
                          isCompleted
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                            : isSelected
                              ? "border-white/20 bg-white/[0.08] text-white"
                              : "border-white/10 text-white/45 hover:border-white/20 hover:bg-white/[0.05] hover:text-white/80"
                        }
                    `}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : lesson.id}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {lessons.map((lesson) => {
                const isSelected = lesson.id === selectedLessonId;
                const isCompleted = completedLessonIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`
                      relative
                      w-full
                      overflow-hidden
                      rounded-xl
                      border
                      px-5
                      py-4
                      text-left
                      transition
                      ${
                        isSelected
                          ? "border-white/20 bg-white/[0.04]"
                          : "border-white/10 bg-white/[0.015] hover:border-white/20 hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-blue" />
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <span
                          className={`
                                block
                                text-sm
                                font-medium
                                ${isSelected ? "text-blue" : "text-white/40"}
                            `}
                        >
                          Aula {lesson.id}
                        </span>

                        <span
                          className={`
                                mt-1
                                block
                                font-medium
                                ${isSelected ? "text-white" : "text-white/70"}
                            `}
                        >
                          {lesson.title}
                        </span>
                      </div>

                      {isCompleted && (
                        <span
                          className="
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-400/15
                            text-emerald-400
                        "
                          title="Aula concluída"
                        >
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-sm">
          <div className="aspect-video bg-black/40">
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-white/40">
                O conteúdo da aula aparecerá aqui
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-white/40">
                  Aula {selectedLesson.id}
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {selectedLesson.title}
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/60">
                  {selectedLesson.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleLessonCompleted(selectedLesson.id)}
                className={`
                            flex
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            px-4
                            py-3
                            text-sm
                            font-medium
                            transition
                            ${
                              completedLessonIds.includes(selectedLesson.id)
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                                : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                            }
                        `}
              >
                <CheckCircle2 className="h-4 w-4" />

                {completedLessonIds.includes(selectedLesson.id)
                  ? "Aula concluída"
                  : "Marcar como concluída"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
