import LibraryCard from "@/components/learn/LibraryCard";
import type { LibraryItem } from "@/types/library-item";
import { t } from "@/lib/t";
import { AnimatePresence, motion } from "framer-motion";

type LibraryCardGridProps = {
  items: LibraryItem[];
  language: "pt" | "en";
  currency: "BRL" | "USD";
};

export default function LibraryCardGrid({
  items,
  language,
  currency,
}: LibraryCardGridProps) {
  return (
    <motion.div
      layout
      className="
        mx-auto
        grid
        w-full
        max-w-7xl
        grid-cols-1
        justify-items-center
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={`${item.type}-${item.slug}`}
            layout
            initial={{
              opacity: 0,
              y: 16,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -16,
              scale: 0.98,
            }}
            transition={{
              opacity: {
                duration: 0.35,
                delay: Math.min(index * 0.045, 0.22),
                ease: [0.16, 1, 0.3, 1],
              },
              y: {
                duration: 0.45,
                delay: Math.min(index * 0.045, 0.22),
                ease: [0.16, 1, 0.3, 1],
              },
              scale: {
                duration: 0.45,
                delay: Math.min(index * 0.045, 0.22),
                ease: [0.16, 1, 0.3, 1],
              },
              layout: {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
          >
            <LibraryCard
              title={t(item.title, language)}
              artist={item.artist}
              image={item.image}
              href={item.href}
              price={item.price}
              currency={currency}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
