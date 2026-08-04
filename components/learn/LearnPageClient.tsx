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

export default function LearnPageClient({
  purchasedProducts,
  featuredProducts,
  songs,
  courses,
  packs,
}: LearnPageClientProps) {
  const [search, setSearch] = useState("");
  const { language, currency } = useSettings();
  const hasMounted = useRef(false);
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
      <main className="relative min-h-screen overflow-x-clip pb-32 pt-32">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="
              absolute
              left-[-14rem]
              top-0
              h-[20rem]
              w-[32rem]
              opacity-0
              scale-150
              animate-[blobFadeIn_1.2s_ease-out_forwards]
              "
          >
            <div
              ref={pinkBlobRef}
              className="h-full w-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(230, 0, 126, 0.18) 0%, rgba(230, 0, 126, 0.08) 38%, transparent 72%)",
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
              opacity-0
              scale-130
              animate-[blobFadeIn_1.2s_ease-out_250ms_forwards]
              "
          >
            <div
              ref={blueBlobRef}
              className="h-full w-full will-change-transform"
              style={{
                background:
                  "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.08) 38%, transparent 72%)",
              }}
            />
          </div>
        </div>
        <Container>
          <div className="max-w-3xl">
            <motion.p
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    delayChildren: 0.2,
                    staggerChildren: 0.14,
                  },
                },
              }}
              aria-label={learnLabel}
              className="
                text-4xl
                font-stretch-150%
                uppercase
                tracking-[0.3em]
                text-magenta
              "
            >
              {Array.from(learnLabel).map((character, index) => (
                <motion.span
                  key={`${character}-${index}`}
                  aria-hidden="true"
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: -8,
                      filter: "blur(4px)",
                    },
                    visible: {
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                  className="inline-block"
                >
                  {character === " " ? "\u00A0" : character}
                </motion.span>
              ))}
            </motion.p>

            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: 0.25,
              }}
              className="mt-6 text-5xl font-medium font-stretch-125% tracking-[-0.05em]"
            >
              {t(learnText.title, language)}
            </motion.div> */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: 0.35,
              }}
              className="mt-1 max-w-2xl text-lg leading-8 text-muted"
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
            <div className="mt-8 mb-12">
              <div
                className="
                  flex h-14 items-center
                  rounded-4xl
                  border border-border
                  bg-card/40
                  px-5
                  backdrop-blur-sm
                  transition-colors duration-200
                  focus-within:bg-card/60
                  focus-within:border-white/35
                "
              >
                <svg
                  className="h-5 w-5 text-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t(learnText.searchPlaceholder, language)}
                  className="ml-4 w-full bg-transparent text-base text-white outline-none placeholder:text-muted"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-all duration-300 hover:bg-white/5 hover:text-white"
                    aria-label={t(learnText.clearSearch, language)}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

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
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.25,
                      ease: "easeOut",
                    },
                  }}
                  transition={{
                    duration: hasMounted.current ? 0.25 : 0.6,
                    ease: "easeOut",
                  }}
                  onAnimationStart={() => {
                    hasMounted.current = true;
                  }}
                >
                  {purchasedProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: hasMounted.current ? 0 : 0.65,
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
                  )}

                  {featuredProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: hasMounted.current ? 0 : 0.75,
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
                  )}

                  {songs.length > 0 && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 24,
                        filter: "blur(5px)",
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                      }}
                      viewport={{
                        once: true,
                        amount: 0.12,
                      }}
                      transition={{
                        duration: 1.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Shelf title={t(learnText.songs, language)}>
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
                      </Shelf>
                    </motion.div>
                  )}

                  {courses.length > 0 && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 24,
                        filter: "blur(5px)",
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                      }}
                      viewport={{
                        once: true,
                        amount: 0.12,
                      }}
                      transition={{
                        duration: 1.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Shelf title={t(learnText.courses, language)}>
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
                      </Shelf>
                    </motion.div>
                  )}

                  {packs.length > 0 && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 24,
                        filter: "blur(5px)",
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                      }}
                      viewport={{
                        once: true,
                        amount: 0.12,
                      }}
                      transition={{
                        duration: 1.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Shelf title={t(learnText.packs, language)}>
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
                      </Shelf>
                    </motion.div>
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
