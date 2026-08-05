import { motion } from "framer-motion";

import LibraryCardGrid from "@/components/learn/LibraryCardGrid";
import { learnText } from "@/lib/i18n/learn";
import { t } from "@/lib/t";

type SearchItem = {
  slug: string;
  type: "song" | "course" | "pack";
  title: {
    pt: string;
    en: string;
  };
  artist?: string;
  price: {
    brl: number;
    usd: number;
  };
  image: string;
  href: string;
};

type SearchResultsProps = {
  search: string;
  language: "pt" | "en";
  currency: "BRL" | "USD";
  items: SearchItem[];
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function SearchResults({
  search,
  language,
  currency,
  items,
}: SearchResultsProps) {
  const query = normalizeText(search);

  const results = items.filter((item) => {
    const titles = Object.values(item.title);
    const artist = item.artist ?? "";

    const matchesTitle = titles.some((title) =>
      normalizeText(title).includes(query),
    );

    const matchesArtist = normalizeText(artist).includes(query);

    return matchesTitle || matchesArtist;
  });

  if (results.length === 0) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 12,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.65,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
          flex
          min-h-[22rem]
          flex-col
          items-center
          justify-center
          px-6
          text-center
        "
      >
        <div
          aria-hidden="true"
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/[0.035]
            text-white/35
          "
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
            <path d="M8.5 10.5h5" />
          </svg>
        </div>

        <p className="mt-6 text-lg font-medium text-white">
          {t(learnText.noResultsTitle, language)}
        </p>

        <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
          {t(learnText.noResultsDescription, language)}
        </p>
      </motion.div>
    );
  }

  return (
    <LibraryCardGrid items={results} language={language} currency={currency} />
  );
}
