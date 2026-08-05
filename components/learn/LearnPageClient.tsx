"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import LibraryCard from "@/components/learn/LibraryCard";
import Shelf from "@/components/learn/Shelf";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/lib/t";
import { learnText } from "@/lib/i18n/learn";
import SearchResults from "@/components/learn/SearchResults";
import { AnimatePresence, motion } from "framer-motion";
import { useBlobParallax } from "@/hooks/useBlobParallax";
import Section from "@/components/learn/Section";

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

export default function LearnPageClient({
  purchasedProducts,
  featuredProducts,
  songs,
  courses,
  packs,
}: LearnPageClientProps) {
  const [search, setSearch] = useState("");
  const { language, currency } = useSettings();
  const [hasMounted, setHasMounted] = useState(false);
  const learnLabel = t(learnText.learn, language);

  const pinkBlobRef = useRef<HTMLDivElement>(null);
  const blueBlobRef = useRef<HTMLDivElement>(null);

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
                font-normal
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              delay: 0.45,
            }}
          >
            <div className="mb-10 mt-6 max-w-2xl">
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
                  transition-[background-color,border-color,box-shadow,transform]
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]

                  hover:border-white/[0.13]
                  hover:bg-white/[0.032]

                  focus-within:border-white/[0.18]
                  focus-within:bg-white/[0.04]
                  focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.16)]

                  motion-reduce:transform-none
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
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={{
              opacity: 0,
              scaleX: 0,
            }}
            animate={{
              opacity: 1,
              scaleX: 1,
            }}
            transition={{
              duration: 1.15,
              delay: 0.62,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mb-10
              h-px
              w-full
              max-w-2xl
              origin-left
              bg-gradient-to-r
              from-white/[0.09]
              via-white/[0.05]
              to-transparent
              will-change-transform
            "
          />
          <div
            className="
              min-h-[65svh]
              lg:min-h-[70svh]
            "
          >
            <AnimatePresence mode="wait">
              {search.trim() ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
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
                  className="space-y-4 md:space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.25,
                      ease: "easeOut",
                    },
                  }}
                  transition={{
                    duration: hasMounted ? 0.25 : 0.6,
                    ease: "easeOut",
                  }}
                  onAnimationComplete={() => {
                    setHasMounted(true);
                  }}
                >
                  {purchasedProducts.length > 0 && (
                    <section id="purchases" className="scroll-mt-28">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: hasMounted ? 0 : 0.65,
                          duration: 1.5,
                          ease: "easeOut",
                        }}
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
                      </motion.div>
                    </section>
                  )}

                  {featuredProducts.length > 0 && (
                    <section id="featured" className="scroll-mt-28">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: hasMounted ? 0 : 0.75,
                          duration: 1.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
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
                      </motion.div>
                    </section>
                  )}

                  {songs.length > 0 && (
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
                  )}

                  {courses.length > 0 && (
                    <Section
                      id="courses"
                      title={t(learnText.courses, language)}
                      countLabel={
                        language === "pt"
                          ? `${courses.length} ${courses.length === 1 ? "curso" : "cursos"}`
                          : `${courses.length} ${courses.length === 1 ? "course" : "courses"}`
                      }
                    >
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
                  )}

                  {packs.length > 0 && (
                    <Section
                      id="packs"
                      title={t(learnText.packs, language)}
                      countLabel={
                        language === "pt"
                          ? `${packs.length} ${packs.length === 1 ? "pack" : "packs"}`
                          : `${packs.length} ${packs.length === 1 ? "pack" : "packs"}`
                      }
                    >
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
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </main>
    </>
  );
}
