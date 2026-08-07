"use client";

import { type RefObject, useCallback, useEffect, useRef } from "react";

type ScrollMode = "shelves" | "released";

type UseLearnScrollControllerOptions = {
  activeIndex: number;
  enabled: boolean;
  itemCount: number;
  anchorRef: RefObject<HTMLDivElement | null>;
  onIndexChange: (index: number) => void;
};

const WHEEL_THRESHOLD = 26;
const TOUCH_THRESHOLD = 52;

const TRANSITION_LOCK_DURATION = 620;
const RECAPTURE_TOLERANCE = 4;
const RECAPTURE_MOMENTUM_LOCK = 320;

export function useLearnScrollController({
  activeIndex,
  enabled,
  itemCount,
  anchorRef,
  onIndexChange,
}: UseLearnScrollControllerOptions) {
  const modeRef = useRef<ScrollMode>(
    enabled && itemCount > 1 ? "shelves" : "released",
  );

  const activeIndexRef = useRef(activeIndex);
  const enabledRef = useRef(enabled);
  const itemCountRef = useRef(itemCount);
  const onIndexChangeRef = useRef(onIndexChange);

  const pageLockedRef = useRef(false);

  const transitionLockedRef = useRef(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  const gestureConsumedRef = useRef(false);
  const gestureIdleTimeoutRef = useRef<number | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const lastWheelDirectionRef = useRef<1 | -1 | null>(null);
  const recaptureMomentumLockedRef = useRef(false);
  const recaptureMomentumTimeoutRef = useRef<number | null>(null);

  const lastShelfReachedAtRef = useRef(0);
  const automaticReleaseTimeoutRef = useRef<number | null>(null);

  const touchStartYRef = useRef<number | null>(null);
  const touchConsumedRef = useRef(false);

  const previousScrollYRef = useRef(0);
  const previousAnchorTopRef = useRef<number | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    enabledRef.current = enabled;
    itemCountRef.current = itemCount;
    onIndexChangeRef.current = onIndexChange;
  }, [activeIndex, enabled, itemCount, onIndexChange]);

  const lockPage = useCallback(() => {
    if (pageLockedRef.current) {
      return;
    }

    document.documentElement.style.overflowY = "hidden";
    document.body.style.overflowY = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";

    pageLockedRef.current = true;
  }, []);

  const unlockPage = useCallback(() => {
    if (!pageLockedRef.current) {
      return;
    }

    document.documentElement.style.overflowY = "";
    document.body.style.overflowY = "";
    document.documentElement.style.overscrollBehavior = "";
    document.body.style.overscrollBehavior = "";

    pageLockedRef.current = false;
  }, []);

  const clearAutomaticRelease = useCallback(() => {
    if (automaticReleaseTimeoutRef.current !== null) {
      window.clearTimeout(automaticReleaseTimeoutRef.current);
      automaticReleaseTimeoutRef.current = null;
    }
  }, []);

  const setHeaderCaptured = useCallback((captured: boolean) => {
    window.dispatchEvent(
      new CustomEvent("learn-scroll-mode", {
        detail: {
          captured,
        },
      }),
    );
  }, []);

  const release = useCallback(() => {
    clearAutomaticRelease();

    modeRef.current = "released";
    wheelAccumulatorRef.current = 0;
    gestureConsumedRef.current = false;
    transitionLockedRef.current = false;
    lastWheelDirectionRef.current = null;

    recaptureMomentumLockedRef.current = false;

    if (recaptureMomentumTimeoutRef.current !== null) {
      window.clearTimeout(recaptureMomentumTimeoutRef.current);
      recaptureMomentumTimeoutRef.current = null;
    }

    unlockPage();
    setHeaderCaptured(false);

    const anchor = anchorRef.current;

    previousAnchorTopRef.current = anchor?.getBoundingClientRect().top ?? null;

    previousScrollYRef.current = window.scrollY;
  }, [anchorRef, clearAutomaticRelease, setHeaderCaptured, unlockPage]);

  const scheduleAutomaticRelease = useCallback(() => {
    clearAutomaticRelease();

    if (
      activeIndexRef.current !== itemCountRef.current - 1 ||
      modeRef.current !== "shelves"
    ) {
      return;
    }

    const elapsed = performance.now() - lastShelfReachedAtRef.current;

    const delay = Math.max(0, TRANSITION_LOCK_DURATION - elapsed);

    automaticReleaseTimeoutRef.current = window.setTimeout(() => {
      automaticReleaseTimeoutRef.current = null;

      if (
        modeRef.current !== "shelves" ||
        activeIndexRef.current !== itemCountRef.current - 1
      ) {
        return;
      }

      release();
    }, delay);
  }, [clearAutomaticRelease, release]);

  const registerGestureActivity = useCallback(() => {
    if (gestureIdleTimeoutRef.current !== null) {
      window.clearTimeout(gestureIdleTimeoutRef.current);
    }

    gestureIdleTimeoutRef.current = window.setTimeout(() => {
      gestureConsumedRef.current = false;
      wheelAccumulatorRef.current = 0;
      gestureIdleTimeoutRef.current = null;
    }, 180);
  }, []);

  const lockTransition = useCallback(() => {
    transitionLockedRef.current = true;

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      transitionLockedRef.current = false;
      transitionTimeoutRef.current = null;

      if (activeIndexRef.current === itemCountRef.current - 1) {
        scheduleAutomaticRelease();
      }
    }, TRANSITION_LOCK_DURATION);
  }, [scheduleAutomaticRelease]);

  const setShelf = useCallback(
    (nextIndex: number) => {
      const count = itemCountRef.current;

      if (nextIndex < 0 || nextIndex >= count) {
        return;
      }

      if (nextIndex === activeIndexRef.current) {
        return;
      }

      activeIndexRef.current = nextIndex;
      onIndexChangeRef.current(nextIndex);

      gestureConsumedRef.current = true;

      if (nextIndex === count - 1) {
        lastShelfReachedAtRef.current = performance.now();
      } else {
        clearAutomaticRelease();
        lastShelfReachedAtRef.current = 0;
      }

      lockTransition();

      if (nextIndex === count - 1) {
        scheduleAutomaticRelease();
      }
    },
    [clearAutomaticRelease, lockTransition, scheduleAutomaticRelease],
  );

  const lockRecaptureMomentum = useCallback(() => {
    recaptureMomentumLockedRef.current = true;

    if (recaptureMomentumTimeoutRef.current !== null) {
      window.clearTimeout(recaptureMomentumTimeoutRef.current);
    }

    recaptureMomentumTimeoutRef.current = window.setTimeout(() => {
      recaptureMomentumLockedRef.current = false;
      recaptureMomentumTimeoutRef.current = null;

      gestureConsumedRef.current = false;
      wheelAccumulatorRef.current = 0;
      lastWheelDirectionRef.current = null;
    }, RECAPTURE_MOMENTUM_LOCK);
  }, []);

  const capture = useCallback(
    (consumeCurrentGesture = false) => {
      if (!enabledRef.current || itemCountRef.current <= 1) {
        return;
      }

      clearAutomaticRelease();

      modeRef.current = "shelves";
      wheelAccumulatorRef.current = 0;
      transitionLockedRef.current = false;
      lastWheelDirectionRef.current = null;

      gestureConsumedRef.current = consumeCurrentGesture;
      touchConsumedRef.current = consumeCurrentGesture;

      if (consumeCurrentGesture) {
        lockRecaptureMomentum();
      }

      lockPage();
      setHeaderCaptured(true);

      if (
        activeIndexRef.current === itemCountRef.current - 1 &&
        !consumeCurrentGesture
      ) {
        lastShelfReachedAtRef.current = performance.now();
        scheduleAutomaticRelease();
      }
    },
    [
      clearAutomaticRelease,
      lockPage,
      lockRecaptureMomentum,
      scheduleAutomaticRelease,
      setHeaderCaptured,
    ],
  );

  useEffect(() => {
    if (enabled && itemCount > 1) {
      capture();
      return;
    }

    release();
  }, [capture, enabled, itemCount, release]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (!enabledRef.current || itemCountRef.current <= 1) {
        return;
      }

      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      if (modeRef.current === "released") {
        if (event.deltaY >= 0) {
          return;
        }

        const anchor = anchorRef.current;

        if (!anchor) {
          return;
        }

        const captureOffset = window.matchMedia("(min-width: 640px)").matches
          ? 112
          : 96;

        const anchorTop = anchor.getBoundingClientRect().top;

        const isStillAtShelfPosition =
          Math.abs(anchorTop - captureOffset) <= RECAPTURE_TOLERANCE;

        if (!isStillAtShelfPosition) {
          return;
        }

        event.preventDefault();

        capture(true);
      }

      event.preventDefault();

      if (recaptureMomentumLockedRef.current) {
        lockRecaptureMomentum();
        return;
      }

      registerGestureActivity();

      const wheelDirection: 1 | -1 = event.deltaY > 0 ? 1 : -1;

      if (
        lastWheelDirectionRef.current !== null &&
        wheelDirection !== lastWheelDirectionRef.current
      ) {
        gestureConsumedRef.current = false;
        wheelAccumulatorRef.current = 0;

        if (gestureIdleTimeoutRef.current !== null) {
          window.clearTimeout(gestureIdleTimeoutRef.current);
          gestureIdleTimeoutRef.current = null;
        }
      }

      lastWheelDirectionRef.current = wheelDirection;

      if (transitionLockedRef.current || gestureConsumedRef.current) {
        return;
      }

      const currentIndex = activeIndexRef.current;
      const lastIndex = itemCountRef.current - 1;

      wheelAccumulatorRef.current += event.deltaY;

      if (Math.abs(wheelAccumulatorRef.current) < WHEEL_THRESHOLD) {
        return;
      }

      const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;

      wheelAccumulatorRef.current = 0;

      const nextIndex = currentIndex + direction;

      if (nextIndex < 0 || nextIndex > lastIndex) {
        gestureConsumedRef.current = true;
        return;
      }

      setShelf(nextIndex);
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel, true);
    };
  }, [
    anchorRef,
    capture,
    lockRecaptureMomentum,
    registerGestureActivity,
    setShelf,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        modeRef.current !== "released" ||
        !enabledRef.current ||
        itemCountRef.current <= 1
      ) {
        previousScrollYRef.current = window.scrollY;
        return;
      }

      const anchor = anchorRef.current;

      if (!anchor) {
        previousScrollYRef.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < previousScrollYRef.current;

      const currentAnchorTop = anchor.getBoundingClientRect().top;

      const previousAnchorTop = previousAnchorTopRef.current;

      const captureOffset = window.matchMedia("(min-width: 640px)").matches
        ? 112
        : 96;

      if (
        scrollingUp &&
        activeIndexRef.current === itemCountRef.current - 1 &&
        previousAnchorTop !== null &&
        previousAnchorTop < captureOffset - RECAPTURE_TOLERANCE &&
        currentAnchorTop >= captureOffset - RECAPTURE_TOLERANCE
      ) {
        capture(true);
      }

      previousAnchorTopRef.current = currentAnchorTop;
      previousScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [anchorRef, capture]);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        return;
      }

      touchStartYRef.current = event.touches[0].clientY;
      touchConsumedRef.current = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (
        !enabledRef.current ||
        itemCountRef.current <= 1 ||
        touchStartYRef.current === null ||
        event.touches.length !== 1
      ) {
        return;
      }

      if (modeRef.current === "released") {
        return;
      }

      const currentY = event.touches[0].clientY;

      const deltaY = touchStartYRef.current - currentY;

      event.preventDefault();

      if (
        transitionLockedRef.current ||
        touchConsumedRef.current ||
        Math.abs(deltaY) < TOUCH_THRESHOLD
      ) {
        return;
      }

      const currentIndex = activeIndexRef.current;
      const lastIndex = itemCountRef.current - 1;

      const direction = deltaY > 0 ? 1 : -1;
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0 || nextIndex > lastIndex) {
        touchConsumedRef.current = true;
        return;
      }

      touchConsumedRef.current = true;
      setShelf(nextIndex);
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
      touchConsumedRef.current = false;
    };

    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
      capture: true,
    });

    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
      capture: true,
    });

    window.addEventListener("touchend", handleTouchEnd, {
      passive: true,
      capture: true,
    });

    window.addEventListener("touchcancel", handleTouchEnd, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart, true);

      window.removeEventListener("touchmove", handleTouchMove, true);

      window.removeEventListener("touchend", handleTouchEnd, true);

      window.removeEventListener("touchcancel", handleTouchEnd, true);
    };
  }, [setShelf]);

  useEffect(() => {
    return () => {
      unlockPage();
      clearAutomaticRelease();
      setHeaderCaptured(false);

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      if (gestureIdleTimeoutRef.current !== null) {
        window.clearTimeout(gestureIdleTimeoutRef.current);
      }

      if (recaptureMomentumTimeoutRef.current !== null) {
        window.clearTimeout(recaptureMomentumTimeoutRef.current);
      }
    };
  }, [clearAutomaticRelease, setHeaderCaptured, unlockPage]);
}
