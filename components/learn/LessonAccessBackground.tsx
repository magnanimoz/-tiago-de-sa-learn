"use client";

import { useRef } from "react";

import { useBlobParallax } from "@/hooks/useBlobParallax";

export default function LessonAccessBackground() {
  const blobRef = useRef<HTMLDivElement>(null);

  useBlobParallax(blobRef, {
    speed: -0.04,
    inertia: 0.012,
    scale: 0.004,
  });

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#070809]">
      <div
        className="absolute inset-0 opacity-0 animate-lesson-darken"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.28))",
        }}
      />

      <div
        className="
          absolute
          left-[59%]
          top-[-3rem]
          h-[65rem]
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
                  "radial-gradient(ellipse, rgba(196,113,49,0.24) 0%, rgba(132,70,30,0.16) 36%, rgba(80,40,20,0.08) 58%, transparent 76%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
