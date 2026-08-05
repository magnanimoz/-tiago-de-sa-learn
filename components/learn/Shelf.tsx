"use client";

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

interface ShelfProps {
  title: string;
  children: ReactNode;
  className?: string;
  description?: string;
  countLabel?: string;
  actionLabel?: string;
  onViewAll?: () => void;
}

type AnimatedShelfItemProps = {
  children: ReactElement;
  isDimmed: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
};

function AnimatedShelfItem({
  children,
  isDimmed,
  onActivate,
  onDeactivate,
}: AnimatedShelfItemProps) {
  return (
    <motion.div
      animate={{
        opacity: isDimmed ? 0.92 : 1,
        scale: isDimmed ? 0.999 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 26,
        mass: 1.15,
      }}
      onHoverStart={onActivate}
      onHoverEnd={onDeactivate}
      onFocusCapture={onActivate}
      onBlurCapture={onDeactivate}
      className="shrink-0"
    >
      {children}
    </motion.div>
  );
}

const shelfEase = [0.16, 1, 0.3, 1] as const;

export default function Shelf({
  title,
  children,
  className = "",
  description,
  countLabel,
  actionLabel = "View all",
  onViewAll,
}: ShelfProps) {
  const shelfRef = useRef<HTMLDivElement>(null);

  const scrollAnimationFrameRef = useRef<number | null>(null);
  const scrollVelocityRef = useRef(0);
  const scrollTargetRef = useRef<number | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const updateScrollButtons = () => {
    const shelf = shelfRef.current;

    if (!shelf) {
      return;
    }

    const maxScrollLeft = shelf.scrollWidth - shelf.clientWidth;

    setCanScrollLeft(shelf.scrollLeft > 4);
    setCanScrollRight(shelf.scrollLeft < maxScrollLeft - 4);
  };

  function animateShelfScroll(targetScrollLeft: number) {
    const shelf = shelfRef.current;

    if (!shelf) {
      return;
    }

    if (scrollAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimationFrameRef.current);
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const maximumScrollLeft = Math.max(
      shelf.scrollWidth - shelf.clientWidth,
      0,
    );

    const target = Math.max(0, Math.min(targetScrollLeft, maximumScrollLeft));

    if (prefersReducedMotion) {
      shelf.scrollLeft = target;
      scrollVelocityRef.current = 0;
      updateScrollButtons();
      return;
    }

    let position = shelf.scrollLeft;
    let velocity = scrollVelocityRef.current;
    let previousTime = performance.now();

    const initialDistance = Math.abs(target - position);

    const mass = 1.2;

    const stiffness =
      initialDistance > 900 ? 105 : initialDistance > 500 ? 120 : 140;

    const damping =
      initialDistance > 900 ? 20 : initialDistance > 500 ? 21 : 22;

    function animate(currentTime: number) {
      const currentShelf = shelfRef.current;

      if (!currentShelf) {
        scrollAnimationFrameRef.current = null;
        scrollVelocityRef.current = 0;
        return;
      }

      const deltaTime = Math.min(
        Math.max((currentTime - previousTime) / 1000, 0),
        1 / 30,
      );

      previousTime = currentTime;

      const displacement = target - position;

      const springForce = displacement * stiffness;
      const dampingForce = velocity * damping;
      const acceleration = (springForce - dampingForce) / mass;

      velocity += acceleration * deltaTime;
      position += velocity * deltaTime;

      const currentMaximumScrollLeft = Math.max(
        currentShelf.scrollWidth - currentShelf.clientWidth,
        0,
      );

      position = Math.max(
        -10,
        Math.min(position, currentMaximumScrollLeft + 10),
      );

      currentShelf.scrollLeft = position;
      scrollVelocityRef.current = velocity;

      const remainingDistance = Math.abs(target - position);
      const remainingVelocity = Math.abs(velocity);

      const isSettled = remainingDistance < 0.35 && remainingVelocity < 2.5;

      if (isSettled) {
        currentShelf.scrollLeft = target;
        scrollVelocityRef.current = 0;
        scrollAnimationFrameRef.current = null;
        updateScrollButtons();
        return;
      }

      scrollAnimationFrameRef.current = window.requestAnimationFrame(animate);
    }

    scrollAnimationFrameRef.current = window.requestAnimationFrame(animate);
  }

  function cancelProgrammaticScroll() {
    if (scrollAnimationFrameRef.current !== null) {
      cancelAnimationFrame(scrollAnimationFrameRef.current);
      scrollAnimationFrameRef.current = null;
    }

    scrollVelocityRef.current = 0;
    scrollTargetRef.current = null;
  }

  function scrollShelf(direction: "left" | "right") {
    const shelf = shelfRef.current;

    if (!shelf) {
      return;
    }

    const cardWidth = 320;
    const cardGap = 24;
    const cardStep = cardWidth + cardGap;

    const visibleCards = Math.max(1, Math.floor(shelf.clientWidth / cardStep));

    const cardsToMove = Math.max(visibleCards - 1, 1);
    const scrollAmount = cardStep * cardsToMove;

    const currentBase = scrollTargetRef.current ?? shelf.scrollLeft;

    const rawTarget =
      direction === "left"
        ? currentBase - scrollAmount
        : currentBase + scrollAmount;

    const maximumScrollLeft = Math.max(
      shelf.scrollWidth - shelf.clientWidth,
      0,
    );

    const target = Math.max(0, Math.min(rawTarget, maximumScrollLeft));

    scrollTargetRef.current = target;

    animateShelfScroll(target);
  }

  useEffect(() => {
    const shelf = shelfRef.current;

    if (!shelf) {
      return;
    }

    updateScrollButtons();

    shelf.addEventListener("scroll", updateScrollButtons, {
      passive: true,
    });

    window.addEventListener("resize", updateScrollButtons);

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(shelf);

    return () => {
      shelf.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      resizeObserver.disconnect();

      if (scrollAnimationFrameRef.current !== null) {
        cancelAnimationFrame(scrollAnimationFrameRef.current);
      }

      scrollAnimationFrameRef.current = null;
      scrollVelocityRef.current = 0;
      scrollTargetRef.current = null;
    };
  }, [children]);

  const itemCount = Children.count(children);

  return (
    <section className={`group/shelf mt-10 ${className}`}>
      {/* Cabeçalho editorial */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2
                  className="
                    text-2xl
                    font-medium
                    tracking-[-0.035em]
                    text-white/90
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    group-hover/shelf:text-white
                    sm:text-[28px]
                    group-focus-within/shelf:text-white
                    motion-reduce:transform-none
                  "
                >
                  {title}
                </h2>

                {countLabel && (
                  <p
                    className="
                      text-xs
                      text-white/30
                      transition-colors
                      duration-500
                      group-hover/shelf:text-white/45
                      group-focus-within/shelf:text-white/45
                    "
                  >
                    {countLabel}
                  </p>
                )}
              </div>

              {description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                  {description}
                </p>
              )}
            </div>

            {onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="
                  hidden
                  shrink-0
                  text-sm
                  font-medium
                  text-white/45
                  transition-colors
                  duration-300
                  hover:text-white
                  focus-visible:outline-none
                  focus-visible:text-white
                  focus-visible:underline
                  focus-visible:underline-offset-4
                  md:block
                "
              >
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Região dos cards */}
      <div
        className="
          group/cards
          relative
          left-1/2
          mt-2
          w-screen
          -translate-x-1/2
        "
      >
        {/* Seta esquerda */}
        <button
          type="button"
          aria-label={`Mover ${title} para a esquerda`}
          onClick={() => scrollShelf("left")}
          disabled={!canScrollLeft}
          className={`
            absolute
            left-5
            top-1/2
            z-20
            hidden
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/12
            bg-black/65
            text-white/80
            shadow-[0_8px_24px_rgba(0,0,0,0.28)]
            backdrop-blur-md
            transition-[opacity,transform,background-color,border-color,color]
            duration-300
            ease-[cubic-bezier(0.2,0.8,0.2,1)]
            md:flex
            hover:scale-[1.03]
            hover:border-white/22
            hover:bg-black/80
            hover:text-white
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-white/30
            active:scale-[0.97]
            ${
              canScrollLeft
                ? `
                  opacity-0
                  group-hover/shelf:opacity-100
                  group-focus-within/shelf:opacity-100
                `
                : "opacity-0"
            }
          `}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Seta direita */}
        <button
          type="button"
          aria-label={`Mover ${title} para a direita`}
          onClick={() => scrollShelf("right")}
          disabled={!canScrollRight}
          className={`
            absolute
            right-5
            top-1/2
            z-20
            hidden
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/12
            bg-black/65
            text-white/80
            shadow-[0_8px_24px_rgba(0,0,0,0.28)]
            backdrop-blur-md
            transition-[opacity,transform,background-color,border-color,color]
            duration-300
            ease-[cubic-bezier(0.2,0.8,0.2,1)]
            md:flex
            hover:scale-[1.03]
            hover:border-white/22
            hover:bg-black/80
            hover:text-white
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-white/30
            active:scale-[0.97]
            ${
              canScrollRight
                ? `
                  opacity-0
                  group-hover/shelf:opacity-100
                  group-focus-within/shelf:opacity-100
                `
                : "opacity-0"
            }
          `}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-10
            w-10
            bg-gradient-to-r
            from-[#070809]/65
            via-[#070809]/18
            to-transparent
            transition-opacity
            duration-300
            ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${
              canScrollLeft
                ? `
                  opacity-0
                  group-hover/shelf:opacity-100
                  group-focus-within/shelf:opacity-100
                `
                : "opacity-0"
            }
          `}
        />

        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-10
            w-10
            bg-gradient-to-l
            from-[#070809]/65
            via-[#070809]/18
            to-transparent
            transition-opacity
            duration-300
            ease-[cubic-bezier(0.2,0.8,0.2,1)]
            ${
              canScrollRight
                ? `
                  opacity-0
                  group-hover/shelf:opacity-100
                  group-focus-within/shelf:opacity-100
                `
                : "opacity-0"
            }
          `}
        />

        {/* Lista horizontal */}
        <div
          ref={shelfRef}
          onPointerDown={cancelProgrammaticScroll}
          onWheel={cancelProgrammaticScroll}
          onTouchStart={cancelProgrammaticScroll}
          className="
            library-shelf-scroll
            overflow-x-auto
            overscroll-x-contain
            py-1
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:h-0
            [&::-webkit-scrollbar]:w-0
            [&::-webkit-scrollbar]:bg-transparent
          "
        >
          <div
            className="
              flex
              w-max
              gap-6
              px-6
              lg:px-8
            "
          >
            {Children.map(children, (child, index) => {
              if (!isValidElement(child)) {
                return child;
              }

              const itemKey = child.key ?? index;

              return (
                <AnimatedShelfItem
                  key={itemKey}
                  isDimmed={
                    activeItemIndex !== null && activeItemIndex !== index
                  }
                  onActivate={() => setActiveItemIndex(index)}
                  onDeactivate={() => setActiveItemIndex(null)}
                >
                  {child}
                </AnimatedShelfItem>
              );
            })}
          </div>
        </div>
      </div>

      {itemCount === 0 && (
        <p className="mt-4 text-sm text-muted">No items available.</p>
      )}
    </section>
  );
}
