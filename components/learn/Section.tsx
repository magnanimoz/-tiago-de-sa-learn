"use client";

import type { ReactNode } from "react";

import Shelf from "@/components/learn/Shelf";
import Reveal from "@/components/ui/Reveal";

type SectionProps = {
  id?: string;
  title: string;
  children: ReactNode;
  description?: string;
  countLabel?: string;
  actionLabel?: string;
  onViewAll?: () => void;
};

export default function Section({
  id,
  title,
  children,
  description,
  countLabel,
  actionLabel,
  onViewAll,
}: SectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <Reveal variant="section">
        <Shelf
          title={title}
          description={description}
          countLabel={countLabel}
          actionLabel={actionLabel}
          onViewAll={onViewAll}
        >
          {children}
        </Shelf>
      </Reveal>
    </section>
  );
}
