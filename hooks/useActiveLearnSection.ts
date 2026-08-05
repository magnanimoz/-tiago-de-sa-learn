"use client";

import { useEffect, useState } from "react";

type UseActiveLearnSectionParams = {
  sectionIds: string[];
  enabled?: boolean;
};

export function useActiveLearnSection({
  sectionIds,
  enabled = true,
}: UseActiveLearnSectionParams) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    sectionIds[0] ?? null,
  );

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) {
      return;
    }

    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio,
          );

        const mostVisibleEntry = visibleEntries[0];

        if (mostVisibleEntry) {
          setActiveSectionId(mostVisibleEntry.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [enabled, sectionIds]);

  return activeSectionId;
}
