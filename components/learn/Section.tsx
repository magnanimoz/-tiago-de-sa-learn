"use client";

import type { ReactNode } from "react";

import Shelf from "@/components/learn/Shelf";

type SectionProps = {
  id?: string;
  title: string;
  children: ReactNode;
  description?: string;
  actionLabel?: string;
  onViewAll?: () => void;
};

export default function Section({
  id,
  title,
  children,
  description,
  actionLabel,
  onViewAll,
}: SectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <Shelf
        title={title}
        description={description}
        actionLabel={actionLabel}
        onViewAll={onViewAll}
      >
        {children}
      </Shelf>
    </section>
  );
}
