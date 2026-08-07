"use client";

import { Children, type ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type LearnViewportProps = {
  activeIndex: number;
  children: ReactNode;
};

const viewportEase = [0.22, 1, 0.36, 1] as const;

export default function LearnViewport({
  activeIndex,
  children,
}: LearnViewportProps) {
  const items = Children.toArray(children);

  const previousIndexRef = useRef(activeIndex);

  const [navigationDirection, setNavigationDirection] = useState<1 | -1>(1);
  const [isInitialEntrance, setIsInitialEntrance] = useState(true);

  useEffect(() => {
    if (activeIndex !== previousIndexRef.current) {
      setNavigationDirection(activeIndex > previousIndexRef.current ? 1 : -1);

      previousIndexRef.current = activeIndex;
    }
  }, [activeIndex]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsInitialEntrance(false);
    }, 1200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="relative">
      <div
        className="
          relative
          left-1/2
          w-screen
          -translate-x-1/2
        "
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.45) 20px, black 52px, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.45) 20px, black 52px, black 100%)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        <div
          className="
            relative
            mx-auto
            min-h-[360px]
            w-full
            max-w-[1200px]
            overflow-x-visible
            overflow-y-clip
            overscroll-y-contain
            px-6
            sm:min-h-[420px]
            lg:min-h-[460px]
            lg:px-8
          "
        >
          {items.map((item, index) => {
            const distance = index - activeIndex;

            const isActive = distance === 0;
            const isPrevious = distance === -1;
            const isNext = distance === 1;

            return (
              <motion.div
                key={index}
                custom={navigationDirection}
                initial={
                  isActive
                    ? {
                        y: 36,
                        opacity: 0,
                        scale: 0.985,
                        filter: "blur(8px)",
                      }
                    : isNext
                      ? {
                          y: "calc(72% + 36px)",
                          opacity: 0,
                          scale: 0.97,
                          filter: "blur(8px)",
                        }
                      : false
                }
                animate={{
                  y: isActive
                    ? 0
                    : isPrevious
                      ? "-82%"
                      : isNext
                        ? "72%"
                        : distance < 0
                          ? "-100%"
                          : "100%",
                  opacity: isActive ? 1 : isNext ? 0.22 : 0,
                  scale: isActive ? 1 : isNext ? 0.985 : 0.97,
                  filter: isActive
                    ? "blur(0px)"
                    : isNext
                      ? "blur(6px)"
                      : "blur(12px)",
                  pointerEvents: isActive ? "auto" : "none",
                }}
                transition={{
                  y: {
                    type: "spring",
                    stiffness: 90,
                    damping: 25,
                    mass: 1.1,
                    delay: isInitialEntrance
                      ? isActive
                        ? 0.18
                        : isNext
                          ? 0.42
                          : 0
                      : 0,
                  },
                  opacity: {
                    duration: 0.42,
                    ease: viewportEase,
                    delay: isInitialEntrance
                      ? isActive
                        ? 0.04
                        : isNext
                          ? 0.2
                          : 0
                      : 0,
                  },
                  scale: {
                    type: "spring",
                    stiffness: 170,
                    damping: 24,
                    mass: 0.82,
                    delay: isInitialEntrance
                      ? isActive
                        ? 0.06
                        : isNext
                          ? 0.22
                          : 0
                      : 0,
                  },
                  filter: {
                    duration: 0.46,
                    ease: viewportEase,
                    delay: isInitialEntrance
                      ? isActive
                        ? 0.04
                        : isNext
                          ? 0.2
                          : 0
                      : 0,
                  },
                }}
                aria-hidden={!isActive}
                className="
                  absolute
                  inset-x-6
                  top-0
                  z-10
                  lg:inset-x-8
                "
              >
                {item}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
