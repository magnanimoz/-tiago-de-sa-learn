"use client";
import { useState, useRef } from "react";
import Header from "@/components/layout/Header";
import Container from "@/components/ui/Container";
import { songs } from "@/lib/songs";
import { courses } from "@/lib/courses";
import { packs } from "@/lib/packs";
import LibraryCard from "@/components/learn/LibraryCard";
import Shelf from "@/components/learn/Shelf";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/lib/t";
import { learnText } from "@/lib/i18n/learn";
import SearchResults from "@/components/learn/SearchResults";
import { AnimatePresence, motion } from "framer-motion";

export default function LearnPage() {
  const [search, setSearch] = useState("");
  const { language, currency } = useSettings();
  const hasMounted = useRef(false);

  return (
    <>
      <Header />

      <main className="relative overflow-x-clip pt-32">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10rem] top-24 h-80 w-80 rounded-full bg-magenta/15 blur-3xl" />

          <div className="absolute right-[-8rem] top-[28rem] h-72 w-72 rounded-full bg-blue/15 blur-3xl" />
        </div>
        <Container>
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: 0.1,
              }}
            >
              <p className="text-4xl font-stretch-150% uppercase tracking-[0.3em] text-magenta">
                {t(learnText.learn, language)}
              </p>
            </motion.h1>

            <motion.h1
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
            </motion.h1>

            <motion.h1
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
            </motion.h1>
          </div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              delay: 0.45,
            }}
          >
            <div className="mt-8 mb-12">
              <div className="flex h-14 items-center rounded-4xl border border-border bg-card/40 px-5 backdrop-blur-sm">
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
          </motion.h1>

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
                />
              </motion.div>
            ) : (
              <motion.div
                key="shelves"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -16,
                  transition: {
                    delay: 0,
                    duration: 0.25,
                    ease: "easeOut",
                  },
                }}
                transition={{
                  delay: hasMounted.current ? 0 : 0.75,
                  duration: hasMounted.current ? 0.25 : 1.5,
                  ease: "easeOut",
                }}
                onAnimationStart={() => {
                  hasMounted.current = true;
                }}
              >
                <Shelf title={t(learnText.recentlyAdded, language)}>
                  {songs.map((song) => (
                    <LibraryCard
                      key={song.slug}
                      artist={song.artist}
                      title={t(song.title, language)}
                      price={song.price}
                      currency={currency}
                      image={song.image}
                      href={`/learn/${song.slug}`}
                    />
                  ))}
                </Shelf>

                <Shelf title={t(learnText.courses, language)}>
                  {courses.map((course) => (
                    <LibraryCard
                      key={course.slug}
                      title={t(course.title, language)}
                      price={course.price}
                      currency={currency}
                      image={course.image}
                      href={`/courses/${course.slug}`}
                    />
                  ))}
                </Shelf>

                <Shelf title={t(learnText.packs, language)}>
                  {packs.map((pack) => (
                    <LibraryCard
                      key={pack.slug}
                      title={t(pack.title, language)}
                      price={pack.price}
                      currency={currency}
                      image={pack.image}
                      href={`/packs/${pack.slug}`}
                    />
                  ))}
                </Shelf>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </main>
    </>
  );
}
