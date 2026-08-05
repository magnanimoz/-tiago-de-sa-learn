import { Lock } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import type { Lesson } from "@/types/lesson";
import { t } from "@/lib/t";

type LockedLessonListProps = {
  lessons: Lesson[];
  language: Locale;
};

export default function LockedLessonList({
  lessons,
  language,
}: LockedLessonListProps) {
  return (
    <div className="border-t border-white/[0.07]">
      {lessons.map((item, index) => (
        <div
          key={item.id}
          className="flex items-center gap-4 border-b border-white/[0.06] px-5 py-3.5 last:border-b-0 sm:px-6"
        >
          <span className="w-7 shrink-0 font-mono text-[11px] text-white/20">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="min-w-0 flex-1 text-sm font-light text-white/50">
            {t(item.title, language)}
          </span>

          <Lock className="h-3.5 w-3.5 shrink-0 text-white/15" />
        </div>
      ))}
    </div>
  );
}
