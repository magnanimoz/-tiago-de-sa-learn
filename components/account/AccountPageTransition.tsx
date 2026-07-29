"use client";

import type { ReactNode } from "react";

type AccountPageTransitionProps = {
  children: ReactNode;
};

export default function AccountPageTransition({
  children,
}: AccountPageTransitionProps) {
  return { children };
}
