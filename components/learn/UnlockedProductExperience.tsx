"use client";

import { AnimatePresence, motion } from "framer-motion";

import ProductHeader from "@/components/learn/ProductHeader";
import type { Locale } from "@/lib/i18n";
import { learnText } from "@/lib/i18n/learn";
import { t } from "@/lib/t";
import type { ContentProduct } from "@/types/content-product";
import LessonPlayerGlow from "@/components/learn/LessonPlayerGlow";

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

  const accentColor = "#c47131";

  return (
    <div className="mt-5 grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div className="min-w-0">
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <ProductHeader
            product={product}
            language={language}
            variant="unlocked"
          />
        </motion.div>

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
          className="
          mt-6
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.11]
          bg-white/[0.04]
          shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_16px_44px_rgba(0,0,0,0.20)]
          backdrop-blur-xl
          lg:sticky
          lg:top-28
        "
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/55">
              {t(learnText.content, language)}
            </p>

            <span className="text-xs text-white/28">
              {product.lessons.length}
            </span>
          </div>

          <div>
            {product.lessons.map((item, index) => {
              const isSelected = item.id === selectedLesson?.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectLesson(item.id)}
                  className={`group relative isolate flex w-full items-center gap-4 border-b border-white/[0.06] px-5 py-5 text-left transition-[background-color,color]
duration-300 last:border-b-0 ${isSelected ? "" : "hover:bg-white/[0.03]"}`}
                >
                  {isSelected && (
                    <>
                      <motion.span
                        layoutId="active-lesson-background"
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 26,
                          mass: 0.9,
                        }}
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                        "
                        style={{
                          background: "rgba(196,113,49,0.06)",
                        }}
                      />

                      <motion.span
                        layoutId="active-lesson-indicator"
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 26,
                          mass: 0.9,
                        }}
                        className="
                          pointer-events-none
                          absolute
                          inset-y-3
                          left-0
                          w-[2px]
                          rounded-full
                        "
                        style={{
                          backgroundColor: accentColor,
                          boxShadow: "0 0 14px rgba(196,113,49,0.45)",
                        }}
                      />
                    </>
                  )}
                  <span
                    className={`relative z-10 w-8 shrink-0 font-mono text-[11px] transition-colors ${
                      isSelected
                        ? "text-white/65"
                        : "text-white/22 group-hover:text-white/35"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div
                    className={`relative z-10 min-w-0 flex-1 transition-colors duration-300 ${
                      isSelected
                        ? "text-white"
                        : "text-white/60 group-hover:text-white/82"
                    }`}
                  >
                    <p className="truncate text-[15px] font-medium">
                      {t(item.title, language)}
                    </p>

                    {item.duration && (
                      <p
                        className={`
                          mt-1
                          text-xs
                          transition-colors
                          duration-300
                          ${
                            isSelected
                              ? "text-white/42"
                              : "text-white/25 group-hover:text-white/38"
                          }
                        `}
                      >
                        {item.duration}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.aside>
      </div>

      <div className="relative isolate min-w-0">
        <LessonPlayerGlow lessonId={selectedLesson?.id} />

        {selectedLesson ? (
          <>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`lesson-heading-${selectedLesson.id}`}
                initial={{
                  opacity: 0,
                  y: 6,
                  filter: "blur(3px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  y: -4,
                  filter: "blur(3px)",
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-4 px-1"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p
                    className="text-xs font-medium uppercase tracking-[0.18em]"
                    style={{
                      color: accentColor,
                    }}
                  >
                    {language === "pt" ? "Assistindo agora" : "Now playing"}
                  </p>

                  <span className="text-xs tabular-nums text-white/32">
                    {String(selectedLessonIndex + 1).padStart(2, "0")} /{" "}
                    {String(product.lessons.length).padStart(2, "0")}
                  </span>
                </div>

                <h2
                  className="
              mt-2
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-white
              sm:text-3xl
            "
                >
                  {t(selectedLesson.title, language)}
                </h2>
              </motion.div>
            </AnimatePresence>

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
                duration: 1.05,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
          relative
          z-10
          min-w-0
          overflow-hidden
          rounded-3xl
          border
          border-white/[0.12]
          bg-[#0d0e10]/95
          shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_28px_90px_rgba(0,0,0,0.34)]
        "
            >
              <video
                src={selectedLesson.videoUrl}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full bg-[#090a0c] object-cover"
              />

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`lesson-description-${selectedLesson.id}`}
                  initial={{
                    opacity: 0,
                    y: 6,
                    filter: "blur(3px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                    filter: "blur(3px)",
                  }}
                  transition={{
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="border-t border-white/[0.10] p-6 sm:p-8"
                >
                  {selectedLesson.duration && (
                    <p className="text-xs text-white/34">
                      {selectedLesson.duration}
                    </p>
                  )}

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58 sm:text-base">
                    {t(selectedLesson.description, language)}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <div className="flex min-h-80 items-center justify-center rounded-3xl border border-white/[0.10] bg-white/[0.025] p-6 text-center">
            <p className="text-sm text-white/40">
              {language === "pt"
                ? "Nenhuma aula disponível."
                : "No lessons available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
