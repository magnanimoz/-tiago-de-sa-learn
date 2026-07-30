"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

type CheckoutLayoutProps = {
  header: ReactNode;
  productSummary: ReactNode;
  paymentPanel: ReactNode;
};

export default function CheckoutLayout({
  header,
  productSummary,
  paymentPanel,
}: CheckoutLayoutProps) {
  const previousScrollYRef = useRef(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const { scrollY } = useScroll();

  const productOffset = useTransform(scrollY, [0, 900], [0, 120]);

  const smoothProductOffset = useSpring(productOffset, {
    stiffness: 110,
    damping: 28,
    mass: 0.7,
  });

  useMotionValueEvent(scrollY, "change", (currentScrollY) => {
    const previousScrollY = previousScrollYRef.current;
    const difference = currentScrollY - previousScrollY;

    if (currentScrollY < 80) {
      setIsHeaderVisible(true);
      previousScrollYRef.current = currentScrollY;
      return;
    }

    if (Math.abs(difference) < 4) {
      return;
    }

    setIsHeaderVisible(difference < 0);
    previousScrollYRef.current = currentScrollY;
  });

  useEffect(() => {
    previousScrollYRef.current = window.scrollY;
  }, []);

  return (
    <div>
      <motion.div
        initial={false}
        animate={
          isHeaderVisible
            ? {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }
            : {
                opacity: 0,
                y: -18,
                filter: "blur(5px)",
              }
        }
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={["mb-8", isHeaderVisible ? "" : "pointer-events-none"].join(
          " ",
        )}
      >
        {header}
      </motion.div>

      <div className="grid items-start gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <motion.div
          style={{
            y: smoothProductOffset,
          }}
          className="self-start"
        >
          {productSummary}
        </motion.div>

        <div>{paymentPanel}</div>
      </div>
    </div>
  );
}
