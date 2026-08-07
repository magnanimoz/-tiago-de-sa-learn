"use client";

import { motion } from "framer-motion";

export type LearnSectionItem = {
  id: string;
  label: string;
};

type LearnSectionMonitorProps = {
  items: LearnSectionItem[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
};

export default function LearnSectionMonitor({
  items,
  activeSection,
  onSectionChange,
}: LearnSectionMonitorProps) {
  return (
    <nav
      aria-label="Navegação das seções"
      className="overflow-x-auto scrollbar-none"
    >
      <div className="relative min-w-max pt-3">
        <div
          aria-hidden="true"
          className="
          absolute
          left-0
          right-0
          top-0
          h-px
          bg-white/[0.06]
        "
        />

        <div
          className="
          relative
          flex
          items-end
          justify-center
          gap-6
          sm:gap-8
        "
        >
          {items.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                aria-current={isActive ? "true" : undefined}
                className="
                group
                relative
                flex
                min-h-8
                items-end
                whitespace-nowrap
                pb-1
                text-left
                focus-visible:outline-none
              "
              >
                {isActive && (
                  <motion.span
                    layoutId="learn-section-indicator"
                    aria-hidden="true"
                    className="
                    absolute
                    left-0
                    right-0
                    -top-3
                    h-px
                    bg-white/40
                  "
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                )}

                <span
                  className={`
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  transition-colors
                  duration-300
                  ${
                    isActive
                      ? "text-white/80"
                      : "text-white/30 group-hover:text-white/55"
                  }
                `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
