"use client";

import type { ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

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
  const { scrollY } = useScroll();

  const productOffset = useTransform(scrollY, [0, 240], [0, 18]);

  const smoothProductOffset = useSpring(productOffset, {
    stiffness: 140,
    damping: 30,
    mass: 0.5,
  });

  return (
    <div>
      <motion.div
        initial={{
          opacity: 0,
          y: 16,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mb-8"
      >
        {header}
      </motion.div>

      <div className="grid items-start gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="self-start lg:sticky lg:top-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 22,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1.8,
              delay: 0.2,
              ease: [0.18, 0.9, 0.2, 1],
            }}
            style={{
              y: smoothProductOffset,
            }}
          >
            {productSummary}
          </motion.div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 26,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 2.3,
            delay: 0.4,
            ease: [0.18, 0.9, 0.2, 1],
          }}
        >
          {paymentPanel}
        </motion.div>
      </div>
    </div>
  );
}
