"use client";

import { type RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

type UseLearnScrollControllerOptions = {
  activeIndex: number;
  enabled: boolean;
  itemCount: number;
  anchorRef: RefObject<HTMLDivElement | null>;
  itemRefs: RefObject<Array<HTMLDivElement | null>>;
  onIndexChange: (index: number) => void;
};

function getCaptureOffset() {
  return window.matchMedia("(min-width: 640px)").matches ? 112 : 96;
}

function applyItemTransforms(
  items: Array<HTMLDivElement | null>,
  virtualIndex: number,
) {
  items.forEach((el, index) => {
    if (!el) {
      return;
    }

    const distance = index - virtualIndex;
    const clampedDistance = Math.min(Math.abs(distance), 1);

    gsap.set(el, {
      yPercent: distance * 100,
      opacity: 1 - clampedDistance * 0.75,
      scale: 1 - clampedDistance * 0.018,
      filter: `blur(${clampedDistance * 10}px)`,
      pointerEvents: clampedDistance > 0.5 ? "none" : "auto",
    });
  });
}

export function useLearnScrollController({
  activeIndex,
  enabled,
  itemCount,
  anchorRef,
  itemRefs,
  onIndexChange,
}: UseLearnScrollControllerOptions) {
  const onIndexChangeRef = useRef(onIndexChange);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastEmittedIndexRef = useRef(activeIndex);
  const isSyncingFromOutsideRef = useRef(false);

  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  }, [onIndexChange]);

  useEffect(() => {
    const anchor = anchorRef.current;

    if (!enabled || itemCount <= 1 || !anchor) {
      return;
    }

    const lastIndex = itemCount - 1;

    applyItemTransforms(itemRefs.current ?? [], activeIndex);

    const st = ScrollTrigger.create({
      trigger: anchor,
      start: () => `top top+=${getCaptureOffset()}`,
      end: () => `+=${lastIndex * window.innerHeight}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      snap: {
        snapTo: (progress) => Math.round(progress * lastIndex) / lastIndex,
        duration: 0.35,
        ease: "power1.inOut",
      },
      onUpdate: (self) => {
        const virtualIndex = self.progress * lastIndex;

        applyItemTransforms(itemRefs.current ?? [], virtualIndex);

        if (isSyncingFromOutsideRef.current) {
          return;
        }

        const nextIndex = Math.round(virtualIndex);

        if (nextIndex !== lastEmittedIndexRef.current) {
          lastEmittedIndexRef.current = nextIndex;
          onIndexChangeRef.current(nextIndex);
        }
      },
    });

    scrollTriggerRef.current = st;

    return () => {
      st.kill();
      scrollTriggerRef.current = null;
    };
  }, [anchorRef, enabled, itemCount, itemRefs]);

  useEffect(() => {
    const st = scrollTriggerRef.current;

    if (!st || itemCount <= 1) {
      return;
    }

    if (activeIndex === lastEmittedIndexRef.current) {
      return;
    }

    const lastIndex = itemCount - 1;
    const targetProgress = activeIndex / lastIndex;
    const targetScrollY = st.start + targetProgress * (st.end - st.start);

    isSyncingFromOutsideRef.current = true;
    lastEmittedIndexRef.current = activeIndex;

    gsap.to(window, {
      scrollTo: targetScrollY,
      duration: 0.35,
      ease: "power1.inOut",
      onUpdate: () => {
        const virtualIndex = st.progress * lastIndex;
        applyItemTransforms(itemRefs.current ?? [], virtualIndex);
      },
      onComplete: () => {
        isSyncingFromOutsideRef.current = false;
      },
    });
  }, [activeIndex, itemCount, itemRefs]);

  useEffect(() => {
    const handleResize = () => ScrollTrigger.refresh();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
