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

const softEase = [0.22, 1, 0.36, 1] as const;

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
    <div className="grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)] ">
      <div ref={leftColumnRef} className="self-start will-change-transform">
        <motion.aside
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.99,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.9,
            delay: 0.08,
            ease: softEase,
          }}
          className="
            overflow-hidden
            rounded-xl
            border
            border-white/[0.11]
            bg-white/[0.04]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_16px_40px_rgba(0,0,0,0.20)]
            backdrop-blur-xl
          "
        >
          <div className="flex min-h-[540px] flex-col justify-between p-6 sm:p-7">
            <ProductHeader
              product={product}
              language={language}
              variant="public"
            />

            <div className="mt-10 border-t border-white/10 pt-5">
              <p className="text-xs text-white/42">{completeProductLabel}</p>

              <div className="mt-1 flex items-end justify-between gap-4">
                <p className="text-2xl font-semibold tracking-tight text-white">
                  {formattedPrice}
                </p>

                <span className="text-xs text-white/34">
                  {language === "pt" ? "Pagamento único" : "One-time payment"}
                </span>
              </div>

              <motion.button
                type="button"
                onClick={onUnlock}
                whileHover={{ scale: 1.012 }}
                whileTap={{ scale: 0.985 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 24,
                  mass: 1,
                }}
                className="
                  mt-4
                  inline-flex
                  min-h-10
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  px-4
                  text-sm
                  font-semibold
                  text-black
                  transition-colors
                  duration-300
                  hover:bg-white/90
                "
              >
                {unlockLabel}
              </motion.button>
            </div>
          </div>
        </motion.aside>
      </div>

      <div ref={rightColumnRef} className="min-w-0">
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.992,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.95,
            delay: 0.16,
            ease: softEase,
          }}
          className="
            overflow-hidden
            rounded-xl
            border
            border-white/[0.12]
            bg-[#0d0e10]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_48px_rgba(0,0,0,0.24)]
          "
        >
          <LessonPreviewPlayer
            previewUrl={product.previewVideo}
            language={language}
            onUnlock={onUnlock}
          />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
            scale: 0.994,
            filter: "blur(4px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.95,
            delay: 0.24,
            ease: softEase,
          }}
          className="
            mt-8
            overflow-hidden
            rounded-xl
            border
            border-white/[0.10]
            bg-white/[0.032]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_14px_38px_rgba(0,0,0,0.18)]
            backdrop-blur-xl
          "
        >
          <div className="flex items-center justify-between border-b border-white/[0.1] px-5 py-4 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/40">
              {language === "pt" ? "Conteúdo" : "Content"}
            </p>

            <span className="text-xs text-white/32">
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
