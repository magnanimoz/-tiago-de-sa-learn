"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/ui/Container";
import LibraryCard from "@/components/learn/LibraryCard";
import Shelf from "@/components/learn/Shelf";
import SearchResults from "@/components/learn/SearchResults";
import Section from "@/components/learn/Section";
import LearnSectionMonitor, {
  type LearnSectionItem,
} from "@/components/learn/LearnSectionMonitor";
import LearnViewport from "@/components/learn/LearnViewport";
import { useSettings } from "@/contexts/SettingsContext";
import { useBlobParallax } from "@/hooks/useBlobParallax";
import { useLearnScrollController } from "@/hooks/useLearnScrollController";
import { learnText } from "@/lib/i18n/learn";
import { t } from "@/lib/t";

type LearnProductCard = {
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
  featured: boolean;
  href: string;
  hasAccess: boolean;
};

type LearnPageClientProps = {
  purchasedProducts: LearnProductCard[];
  featuredProducts: LearnProductCard[];
  songs: LearnProductCard[];
  courses: LearnProductCard[];
  packs: LearnProductCard[];
};

const softEase = [0.22, 1, 0.36, 1] as const;

const shelfItemVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.99,
    filter: "blur(3px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.95,
      ease: softEase,
    },
  },
};

export default function LearnPageClient({
  purchasedProducts,
  featuredProducts,
  songs,
  courses,
  packs,
}: LearnPageClientProps) {
  const [search, setSearch] = useState("");

  const [activeSection, setActiveSection] = useState(
    purchasedProducts.length > 0
      ? "purchases"
      : featuredProducts.length > 0
        ? "featured"
        : songs.length > 0
          ? "songs"
          : courses.length > 0
            ? "courses"
            : packs.length > 0
              ? "packs"
              : "",
  );

  const { language, currency } = useSettings();

  const pinkBlobRef = useRef<HTMLDivElement>(null);
  const blueBlobRef = useRef<HTMLDivElement>(null);
  const learnStickyRef = useRef<HTMLDivElement>(null);

  const learnLabel = t(learnText.learn, language);

  useBlobParallax(pinkBlobRef, {
    speed: -0.03,
    inertia: 0.01,
    scale: 0.009,
  });

  useBlobParallax(blueBlobRef, {
    speed: -0.05,
    inertia: 0.01,
    scale: -0.005,
  });

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  const searchableProducts = [
    ...featuredProducts,
    ...songs,
    ...courses,
    ...packs,
  ].filter(
    (product, index, array) =>
      array.findIndex(
        (item) => item.type === product.type && item.slug === product.slug,
      ) === index,
  );

  const sectionItems: LearnSectionItem[] = [
    ...(purchasedProducts.length > 0
      ? [
          {
            id: "purchases",
            label: language === "pt" ? "Minhas compras" : "My purchases",
          },
        ]
      : []),

    ...(featuredProducts.length > 0
      ? [
          {
            id: "featured",
            label:
              language === "pt" ? "Adicionados recentemente" : "Recently added",
          },
        ]
      : []),

    ...(songs.length > 0
      ? [
          {
            id: "songs",
            label: t(learnText.songs, language),
          },
        ]
      : []),

    ...(courses.length > 0
      ? [
          {
            id: "courses",
            label: t(learnText.courses, language),
          },
        ]
      : []),

    ...(packs.length > 0
      ? [
          {
            id: "packs",
            label: t(learnText.packs, language),
          },
        ]
      : []),
  ];

  const activeIndex = Math.max(
    0,
    sectionItems.findIndex((item) => item.id === activeSection),
  );

  function handleSectionChange(sectionId: string) {
    setActiveSection(sectionId);
  }

  function handleViewportIndexChange(index: number) {
    const nextSection = sectionItems[index];

    if (!nextSection) {
      return;
    }

    setActiveSection(nextSection.id);
  }

  useLearnScrollController({
    activeIndex,
    enabled: !search.trim(),
    itemCount: sectionItems.length,
    anchorRef: learnStickyRef,
    onIndexChange: handleViewportIndexChange,
  });

  const sections = [
    purchasedProducts.length > 0 && (
      <motion.section
        id="purchases"
        key="purchases"
        className="scroll-mt-72"
        variants={shelfItemVariants}
      >
        <Shelf title={t(learnText.myPurchases, language)}>
          {purchasedProducts.map((product) => (
            <LibraryCard
              key={`${product.type}-${product.slug}`}
              artist={product.artist}
              title={t(product.title, language)}
              price={product.price}
              currency={currency}
              image={product.image}
              href={product.href}
              acquired
            />
          ))}
        </Shelf>
      </motion.section>
    ),

    featuredProducts.length > 0 && (
      <motion.section
        id="featured"
        key="featured"
        className="scroll-mt-72"
        variants={shelfItemVariants}
      >
        <Shelf title={t(learnText.recentlyAdded, language)}>
          {featuredProducts.map((product) => (
            <LibraryCard
              key={`${product.type}-${product.slug}`}
              artist={product.artist}
              title={t(product.title, language)}
              price={product.price}
              currency={currency}
              image={product.image}
              href={product.href}
              acquired={product.hasAccess}
            />
          ))}
        </Shelf>
      </motion.section>
    ),

    songs.length > 0 && (
      <motion.div key="songs" variants={shelfItemVariants}>
        <Section id="songs" title={t(learnText.songs, language)}>
          {songs.map((song) => (
            <LibraryCard
              key={song.slug}
              artist={song.artist}
              title={t(song.title, language)}
              price={song.price}
              currency={currency}
              image={song.image}
              href={song.href}
              acquired={song.hasAccess}
            />
          ))}
        </Section>
      </motion.div>
    ),

    courses.length > 0 && (
      <motion.div key="courses" variants={shelfItemVariants}>
        <Section id="courses" title={t(learnText.courses, language)}>
          {courses.map((course) => (
            <LibraryCard
              key={course.slug}
              artist={course.artist}
              title={t(course.title, language)}
              price={course.price}
              currency={currency}
              image={course.image}
              href={course.href}
              acquired={course.hasAccess}
            />
          ))}
        </Section>
      </motion.div>
    ),

    packs.length > 0 && (
      <motion.div key="packs" variants={shelfItemVariants}>
        <Section id="packs" title={t(learnText.packs, language)}>
          {packs.map((pack) => (
            <LibraryCard
              key={pack.slug}
              artist={pack.artist}
              title={t(pack.title, language)}
              price={pack.price}
              currency={currency}
              image={pack.image}
              href={pack.href}
              acquired={pack.hasAccess}
            />
          ))}
        </Section>
      </motion.div>
    ),
  ].filter(Boolean);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 bg-[#070809]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="
            absolute
            left-[-14rem]
            top-0
            h-[20rem]
            w-[32rem]
            scale-150
            opacity-0
            animate-[blobFadeIn_1.2s_ease-out_forwards]
          "
        >
          <div
            ref={pinkBlobRef}
            className="h-full w-full will-change-transform"
            style={{
              background:
                "radial-gradient(circle, rgba(230,0,126,0.18) 0%, rgba(230,0,126,0.08) 38%, transparent 72%)",
            }}
          />
        </div>

        <div
          className="
            absolute
            right-[-12rem]
            top-[24rem]
            h-[40rem]
            w-[30rem]
            scale-130
            opacity-0
            animate-[blobFadeIn_1.2s_ease-out_250ms_forwards]
          "
        >
          <div
            ref={blueBlobRef}
            className="h-full w-full will-change-transform"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.08) 38%, transparent 72%)",
            }}
          />
        </div>
      </div>

      <main className="relative min-h-screen overflow-x-clip pb-32 pt-24 sm:pt-28">
        <Container>
          <div
            className="
    relative
    min-h-[calc(100svh-6rem)]
    pb-6
    lg:pb-8
  "
          >
            <div ref={learnStickyRef} className="sticky top-24 z-30 sm:top-28">
              <div
                className="
        grid
        items-end
        gap-8
        lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.95fr)]
        lg:gap-16
      "
              >
                <div className="max-w-2xl">
                  <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          delayChildren: 0.15,
                          staggerChildren: 0.08,
                        },
                      },
                    }}
                    aria-label={learnLabel}
                    className="
                    text-2xl
                    font-medium
                    font-stretch-150%
                    uppercase
                    tracking-[0.28em]
                    text-magenta
                    sm:text-3xl
                  "
                  >
                    {Array.from(learnLabel).map((character, index) => (
                      <motion.span
                        key={`${character}-${index}`}
                        aria-hidden="true"
                        variants={{
                          hidden: {
                            opacity: 0,
                            x: -6,
                            filter: "blur(4px)",
                          },
                          visible: {
                            opacity: 1,
                            x: 0,
                            filter: "blur(0px)",
                            transition: {
                              duration: 0.5,
                              ease: softEase,
                            },
                          },
                        }}
                        className="inline-block"
                      >
                        {character === " " ? "\u00A0" : character}
                      </motion.span>
                    ))}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
                      ease: softEase,
                      delay: 0.32,
                    }}
                    className="
                    mt-1.5
                    max-w-xl
                    text-base
                    leading-7
                    text-white/44
                    sm:text-lg
                    sm:leading-8
                  "
                  >
                    {t(learnText.subtitle, language)}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.4,
                    ease: softEase,
                  }}
                  className="mt-2 w-full lg:mt-0 lg:pb-1"
                >
                  <p
                    className="
                    mb-2.5
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-white/30
                  "
                  >
                    {language === "pt"
                      ? "Explorar catálogo"
                      : "Explore catalog"}
                  </p>

                  <div
                    className="
                    group
                    flex
                    h-12
                    items-center
                    rounded-xl
                    border
                    border-white/[0.09]
                    bg-white/[0.025]
                    px-4
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
                    transition-[background-color,border-color,box-shadow]
                    duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    hover:border-white/[0.13]
                    hover:bg-white/[0.032]
                    focus-within:border-white/[0.18]
                    focus-within:bg-white/[0.04]
                    focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.16)]
                  "
                  >
                    <svg
                      className="
                      h-4
                      w-4
                      shrink-0
                      text-white/30
                      transition-all
                      duration-300
                      sm:h-5
                      sm:w-5
                      group-focus-within:scale-[1.04]
                      group-focus-within:text-magenta
                      group-focus-within:drop-shadow-[0_0_8px_rgba(230,0,126,0.32)]
                    "
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5" />
                    </svg>

                    <input
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t(learnText.searchPlaceholder, language)}
                      className="
                      ml-3
                      min-w-0
                      flex-1
                      bg-transparent
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/30
                      sm:ml-4
                      sm:text-base
                    "
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-white/35
                        transition-all
                        duration-200
                        sm:h-9
                        sm:w-9
                        hover:bg-white/[0.06]
                        hover:text-white
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-white/30
                      "
                        aria-label={t(learnText.clearSearch, language)}
                      >
                        <svg
                          className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M18 6 6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{
                  duration: 1.15,
                  delay: 0.62,
                  ease: softEase,
                }}
                className="
                mb-3
                mt-10
                w-full
                origin-left
                will-change-transform
              "
              >
                <LearnSectionMonitor
                  items={sectionItems}
                  activeSection={activeSection}
                  onSectionChange={handleSectionChange}
                />
              </motion.div>

              <div className="pt-6 lg:pt-8">
                <AnimatePresence mode="wait">
                  {search.trim() ? (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                    >
                      <div className="mb-8 flex items-center justify-between gap-4">
                        <p className="min-w-0 text-sm text-white/45">
                          {t(learnText.resultsFor, language)}{" "}
                          <span className="font-medium text-white/80">
                            “{search.trim()}”
                          </span>
                        </p>

                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          className="
                          shrink-0
                          text-sm
                          text-white/45
                          transition-colors
                          duration-200
                          hover:text-white
                          focus-visible:outline-none
                          focus-visible:text-white
                          focus-visible:underline
                          focus-visible:underline-offset-4
                        "
                        >
                          {t(learnText.clearSearch, language)}
                        </button>
                      </div>

                      <SearchResults
                        search={search}
                        language={language}
                        currency={currency}
                        items={searchableProducts}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="shelves"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                    >
                      <LearnViewport activeIndex={activeIndex}>
                        {sections}
                      </LearnViewport>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
