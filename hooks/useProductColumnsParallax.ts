"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

type UseProductColumnsParallaxParams = {
  backButtonRef: RefObject<HTMLElement | null>;
  leftColumnRef: RefObject<HTMLElement | null>;
  rightColumnRef: RefObject<HTMLElement | null>;
  dependency?: number;
};

export function useProductColumnsParallax({
  backButtonRef,
  leftColumnRef,
  rightColumnRef,
  dependency = 0,
}: UseProductColumnsParallaxParams) {
  useEffect(() => {
    let animationFrameId: number | null = null;
    let maximumOffset = 0;

    const leftColumnSpeed = 0.35;
    const compensationRate = 1 - leftColumnSpeed;

    function measureColumns() {
      const leftColumn = leftColumnRef.current;
      const rightColumn = rightColumnRef.current;

      if (!leftColumn || !rightColumn) {
        maximumOffset = 0;
        return;
      }

      const leftHeight = leftColumn.scrollHeight;
      const rightHeight = rightColumn.scrollHeight;
      const visualCorrection = -6.5;

      maximumOffset = Math.max(rightHeight - leftHeight + visualCorrection, 0);
    }

    function updateParallax() {
      animationFrameId = null;

      const backButton = backButtonRef.current;
      const leftColumn = leftColumnRef.current;

      if (!backButton) {
        return;
      }

      if (window.innerWidth < 1024) {
        backButton.style.transform = "";

        if (leftColumn) {
          leftColumn.style.transform = "";
        }

        return;
      }

      const compensation = Math.min(
        window.scrollY * compensationRate,
        maximumOffset,
      );

      const transform = `translate3d(0, ${compensation}px, 0)`;

      backButton.style.transform = transform;

      if (leftColumn) {
        leftColumn.style.transform = transform;
      }
    }

    function requestParallaxUpdate() {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(updateParallax);
    }

    function handleResize() {
      measureColumns();
      requestParallaxUpdate();
    }

    measureColumns();
    requestParallaxUpdate();

    const resizeObserver = new ResizeObserver(() => {
      measureColumns();
      requestParallaxUpdate();
    });

    const backButtonElement = backButtonRef.current;
    const leftColumnElement = leftColumnRef.current;
    const rightColumnElement = rightColumnRef.current;

    if (leftColumnElement) {
      resizeObserver.observe(leftColumnElement);
    }

    if (rightColumnElement) {
      resizeObserver.observe(rightColumnElement);
    }

    window.addEventListener("scroll", requestParallaxUpdate, {
      passive: true,
    });

    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener("scroll", requestParallaxUpdate);
      window.removeEventListener("resize", handleResize);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (backButtonElement) {
        backButtonElement.style.transform = "";
      }

      if (leftColumnElement) {
        leftColumnElement.style.transform = "";
      }
    };
  }, [backButtonRef, dependency, leftColumnRef, rightColumnRef]);
}
