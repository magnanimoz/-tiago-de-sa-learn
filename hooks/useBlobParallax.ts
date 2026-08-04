"use client";

import { RefObject, useEffect } from "react";

type UseBlobParallaxOptions = {
  speed?: number;
  inertia?: number;
  scale?: number;
};

export function useBlobParallax(
  blobRef: RefObject<HTMLDivElement | null>,
  { speed = 0.2, inertia = 0.04, scale = 0 }: UseBlobParallaxOptions = {},
) {
  useEffect(() => {
    let frame = 0;

    let current = 0;
    let target = 0;

    function animate() {
      const blob = blobRef.current;

      if (!blob) {
        return;
      }

      target = window.scrollY * speed;

      current += (target - current) * inertia;

      const blobScale = 1 + current * scale;

      blob.style.transform = `
        translate3d(0, ${current}px, 0)
        scale(${blobScale})
      `;

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);

      const blob = blobRef.current;

      if (blob) {
        blob.style.transform = "";
      }
    };
  }, [blobRef, speed, inertia]);
}
