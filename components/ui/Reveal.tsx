"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type RevealVariant = "section" | "hero" | "card";

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  once?: boolean;
  amount?: number;
};

const ease = [0.16, 1, 0.3, 1] as const;

const variants = {
  section: {
    y: 28,
    scale: 0.99,
    duration: 0.95,
    blur: 0,
  },

  hero: {
    y: 18,
    scale: 1,
    duration: 1.15,
    blur: 0,
  },

  card: {
    y: 16,
    scale: 0.985,
    duration: 0.65,
    blur: 0,
  },
} as const;

export default function Reveal({
  children,
  className,
  variant = "section",
  delay = 0,
  once = true,
  amount = 0.16,
}: RevealProps) {
  const config = variants[variant];

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: config.y,
        scale: config.scale,
        filter: `blur(${config.blur}px)`,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{
        once,
        amount,
        margin: "0px 0px -8% 0px",
      }}
      transition={{
        delay,
        duration: config.duration,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}
