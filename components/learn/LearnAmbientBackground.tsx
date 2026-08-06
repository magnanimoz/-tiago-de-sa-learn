"use client";

import { useRef } from "react";

import { useBlobParallax } from "@/hooks/useBlobParallax";

type LearnAmbientBackgroundProps = {
  compact?: boolean;
};

export default function LearnAmbientBackground({
  compact = false,
}: LearnAmbientBackgroundProps) {
  const pinkBlobRef = useRef<HTMLDivElement>(null);
  const blueBlobRef = useRef<HTMLDivElement>(null);

  useBlobParallax(pinkBlobRef, {
    speed: -0.03,
    inertia: 0.01,
    scale: 0.009,
  });

  useBlobParallax(blueBlobRef, {
    speed: -0.05,
    inertia: 0.01,
    scale: -0.005,
  });

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 bg-[#070809]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className={`
            absolute
            left-[-14rem]
            top-0
            opacity-0
            animate-[blobFadeIn_1.2s_ease-out_forwards]
            ${
              compact
                ? "h-[18rem] w-[28rem] scale-125"
                : "h-[20rem] w-[32rem] scale-150"
            }
          `}
        >
          <div
            ref={pinkBlobRef}
            className="h-full w-full will-change-transform"
            style={{
              background:
                "radial-gradient(circle, rgba(230,0,126,0.18) 0%, rgba(230,0,126,0.08) 38%, transparent 72%)",
            }}
          />
        </div>

        <div
          className={`
            absolute
            right-[-12rem]
            opacity-0
            animate-[blobFadeIn_1.2s_ease-out_250ms_forwards]
            ${
              compact
                ? "top-[18rem] h-[34rem] w-[26rem] scale-110"
                : "top-[24rem] h-[40rem] w-[30rem] scale-130"
            }
          `}
        >
          <div
            ref={blueBlobRef}
            className="h-full w-full will-change-transform"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.08) 38%, transparent 72%)",
            }}
          />
        </div>
      </div>
    </>
  );
}
