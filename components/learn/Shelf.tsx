"use client";

import { Children, ReactNode, useEffect, useRef, useState } from "react";

interface ShelfProps {
  title: string;
  children: ReactNode;
  className?: string;
  onViewAll?: () => void;
}

export default function Shelf({
  title,
  children,
  className = "",
  onViewAll,
}: ShelfProps) {
  const shelfRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const shelf = shelfRef.current;

    if (!shelf) {
      return;
    }

    const maxScrollLeft = shelf.scrollWidth - shelf.clientWidth;

    setCanScrollLeft(shelf.scrollLeft > 4);
    setCanScrollRight(shelf.scrollLeft < maxScrollLeft - 4);
  };

  const scrollShelf = (direction: "left" | "right") => {
    const shelf = shelfRef.current;

    if (!shelf) {
      return;
    }

    const scrollAmount = Math.min(shelf.clientWidth * 0.8, 960);

    const amount = direction === "left" ? -scrollAmount : scrollAmount;

    console.log("direction:", direction);
    console.log("amount:", amount);
    console.log("scrollLeft antes:", shelf.scrollLeft);

    shelf.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

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
    };
  }, [children]);

  const itemCount = Children.count(children);

  return (
    <section className={`mt-20 ${className}`}>
      {/* Header */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="flex items-center justify-between px-6 lg:px-8">
          <h2 className="text-3xl font-medium tracking-[-0.04em]">{title}</h2>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="hidden text-sm font-medium text-muted transition-colors duration-300 hover:text-white md:block"
            >
              View all
            </button>
          )}
        </div>
      </div>

      {/* Região dos cards */}
      <div className="group relative left-1/2 mt-4 w-screen -translate-x-1/2">
        {/* Seta esquerda */}
        <button
          type="button"
          aria-label={`Mover ${title} para a esquerda`}
          onClick={() => scrollShelf("left")}
          disabled={!canScrollLeft}
          className={`absolute left-8 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-white bg-black/40 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-black/70 ${
            canScrollLeft
              ? "opacity-0 group-hover:opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
          className={`absolute right-8 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-white bg-black/40 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-black/70 ${
            canScrollRight
              ? "opacity-0 group-hover:opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        {/* Lista horizontal */}
        <div
          ref={shelfRef}
          className="library-shelf-scroll overflow-x-auto scroll-smooth py-4"
        >
          <div className="flex w-max gap-6 px-6 lg:px-8">{children}</div>
        </div>
      </div>

      {itemCount === 0 && (
        <p className="mt-4 text-sm text-muted">No items available.</p>
      )}
    </section>
  );
}
