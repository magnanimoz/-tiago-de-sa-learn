"use client";

import { useRef } from "react";
import { useBlobParallax } from "@/hooks/useBlobParallax";

export default function LessonAccessBackground() {
  const blobRef = useRef<HTMLDivElement>(null);

  useBlobParallax(blobRef, {
    speed: 0.22,
    inertia: 0.035,
  });

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#0d0d0f]">
      <div
        className="absolute inset-0 opacity-0 animate-lesson-darken"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.6))",
        }}
      />

      <div
        className="
          absolute
          left-[59%]
          top-[-3rem]
          h-[55rem]
          w-[62rem]
          -translate-x-1/2
        "
      >
        <div ref={blobRef} className="h-full w-full will-change-transform">
          <div className="h-full w-full opacity-0 animate-lesson-amber">
            <div
              className="lesson-amber-float h-full w-full"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(196,113,49,0.5) 0%, rgba(132,70,30,0.4) 34%, rgba(80,40,20,0.24) 56%, transparent 74%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
