"use client";

import { Children, type ReactNode, type RefObject } from "react";

type LearnViewportProps = {
  children: ReactNode;
  itemRefs: RefObject<Array<HTMLDivElement | null>>;
};

export default function LearnViewport({
  children,
  itemRefs,
}: LearnViewportProps) {
  const items = Children.toArray(children);

  return (
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
          min-h-[360px]
          w-full
          overflow-visible
          sm:min-h-[420px]
          lg:min-h-[460px]
        "
      >
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="
              absolute
              inset-0
              mx-auto
              h-full
              w-full
              max-w-[1200px]
              px-6
              will-change-transform
              lg:px-8
            "
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
