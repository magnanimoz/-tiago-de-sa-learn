"use client";

import { motion } from "framer-motion";

type LessonPlayerGlowProps = {
  lessonId?: string;
  isSwitching?: boolean;
};

export default function LessonPlayerGlow({
  lessonId,
  isSwitching = false,
}: LessonPlayerGlowProps) {
  return (
    <motion.div
      key={lessonId}
      aria-hidden="true"
      initial={{
        opacity: 0,
        scale: 1.18,
      }}
      animate={{
        opacity: isSwitching ? 0.28 : 0.14,
        scale: isSwitching ? 1.32 : 1.18,
      }}
      transition={{
        duration: isSwitching ? 0.32 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        pointer-events-none
        absolute
        inset-x-[4%]
        top-[6%]
        z-0
        h-[82%]
        rounded-[3rem]
        blur-[90px]
        will-change-transform
      "
      style={{
        background:
          "radial-gradient(ellipse, rgba(196,113,49,0.95) 0%, rgba(150,76,30,0.55) 40%, transparent 74%)",
      }}
    />
  );
}
