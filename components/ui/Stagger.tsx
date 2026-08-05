"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
};

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

const staggerEase = [0.16, 1, 0.3, 1] as const;

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.06,
  once = true,
  amount = 0.15,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount,
        margin: "0px 0px -8% 0px",
      }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          y: 16,
          scale: 0.99,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.65,
            ease: staggerEase,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
