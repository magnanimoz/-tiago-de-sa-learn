"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

type LearnShelfNavigatorProps = {
  activeIndex: number;
  children: ReactNode[];
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function LearnShelfNavigator({
  activeIndex,
  children,
}: LearnShelfNavigatorProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
      "
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{
            opacity: 0,
            y: 40,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -40,
            filter: "blur(8px)",
          }}
          transition={{
            duration: 0.55,
            ease,
          }}
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
