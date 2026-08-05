"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { formatPrice } from "@/lib/format-price";
import { localePath } from "@/lib/locale-path";
import type { Price } from "@/types/price";
import { motion } from "framer-motion";

type LibraryCardProps = {
  title: string;
  image: string;
  artist?: string;
  href: string;
  price: Price;
  currency: "BRL" | "USD";
  acquired?: boolean;
};

export default function LibraryCard({
  title,
  image,
  artist,
  href,
  price,
  currency,
  acquired = false,
}: LibraryCardProps) {
  const { language, routeLocale } = useSettings();
  const { isLoading } = useAuth();

  const localizedHref = localePath(href, routeLocale);

  const acquiredLabel = language === "pt" ? "Adquirido" : "Owned";

  return (
    <Link
      href={localizedHref}
      onClick={(event) => {
        if (isLoading) {
          event.preventDefault();
        }
      }}
      aria-disabled={isLoading}
      className={`
        group/card
        block
        w-[280px]
        shrink-0
        outline-none
        sm:w-[300px]
        lg:w-[320px]
        ${isLoading ? "cursor-wait" : ""}
      `}
    >
      <motion.article
        whileHover={{
          scale: 1.034,
        }}
        whileTap={{
          scale: 0.995,
        }}
        transition={{
          type: "spring",
          stiffness: 110,
          damping: 28,
          mass: 1.2,
        }}
        className="
          relative
          isolate
          origin-center
          motion-reduce:transform-none
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-5
            top-4
            -z-10
            h-[70%]
            rounded-[2rem]
            bg-black/50
            blur-2xl
            opacity-0
            transition-opacity
            duration-500
            group-hover/card:opacity-100
          "
        />
        <div
          className="
            relative
            aspect-[16/9]
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.10]
            bg-[#111214]
            shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_14px_38px_rgba(0,0,0,0.34)]
            transition-[border-color,box-shadow]
            duration-500
            ease-[cubic-bezier(0.2,0.8,0.2,1)]
            group-hover/card:border-white/[0.22]
            group-hover/card:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_16px_36px_rgba(0,0,0,0.34)]
            group-focus-visible/card:border-white/[0.22]
            group-focus-visible/card:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_24px_56px_rgba(0,0,0,0.50)]
            group-focus-visible/card:ring-2
            group-focus-visible/card:ring-white/20
          "
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 300px, 320px"
            className="
              object-cover
              transition-[transform,filter]
              duration-700
              ease-[cubic-bezier(0.2,0.8,0.2,1)]
              group-hover/card:scale-[1.015]
              group-hover/card:contrast-[1.04]
              group-hover/card:saturate-[1.03]
              group-focus-visible/card:scale-[1.015]
              group-focus-visible/card:contrast-[1.04]
              group-focus-visible/card:saturate-[1.03]
              motion-reduce:transform-none
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/45
              via-transparent
              to-black/10
              transition-opacity
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover/card:opacity-90
              group-focus-visible/card:opacity-90
            "
          />

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
          >
            <motion.span
              aria-hidden="true"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              transition={{
                type: "spring",

                stiffness: 180,

                damping: 22,

                mass: 0.9,
              }}
              className="
                flex
                h-11
                w-11
                translate-y-0.5
                cursor-pointer
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-black/35
                text-white
                opacity-0
                shadow-lg
                backdrop-blur-lg
                transition-[opacity,background-color,border-color]
                duration-300
                ease-[cubic-bezier(0.22,1,0.36,1)]

                group-hover/card:translate-y-0
                group-hover/card:opacity-100
                group-hover/card:border-white/30
                group-hover/card:bg-black/50

                group-focus-visible/card:translate-y-0
                group-focus-visible/card:opacity-100
                group-focus-visible/card:border-white/30
                group-focus-visible/card:bg-black/50
              "
            >
              <motion.svg
                whileHover={{ scale: 1.06 }}
                transition={{
                  duration: 0.25,

                  ease: [0.22, 1, 0.36, 1],
                }}
                viewBox="0 0 24 24"
                className="ml-0.5 h-5 w-5 fill-current"
              >
                <path d="M9 7.5v9l7-4.5-7-4.5Z" />
              </motion.svg>
            </motion.span>
          </div>

          <div className="absolute right-3 top-3">
            {acquired ? (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-emerald-300/15
                  bg-black/45
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-emerald-200/80
                  backdrop-blur-lg
                  transition-[background-color,border-color,color,transform]
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover/card:-translate-y-px
                  group-hover/card:border-emerald-300/25
                  group-hover/card:bg-black/58
                  group-hover/card:text-emerald-100
                  group-focus-visible/card:-translate-y-px
                  group-focus-visible/card:border-emerald-300/25
                  group-focus-visible/card:bg-black/58
                  group-focus-visible/card:text-emerald-100
                  motion-reduce:transform-none
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/90" />

                {acquiredLabel}
              </span>
            ) : (
              <span
                className="
                  rounded-full
                  border
                  border-white/15
                  bg-black/50
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-white/80
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_16px_rgba(0,0,0,0.18)]
                  backdrop-blur-xl
                  transition-[background-color,border-color,color,transform]
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover/card:-translate-y-px
                  group-hover/card:border-white/22
                  group-hover/card:bg-black/60
                  group-hover/card:text-white/90
                  group-focus-visible/card:-translate-y-px
                  group-focus-visible/card:border-white/22
                  group-focus-visible/card:bg-black/60
                  group-focus-visible/card:text-white/90
                  motion-reduce:transform-none
                "
              >
                {formatPrice(price, currency)}
              </span>
            )}
          </div>
        </div>

        <div className="px-1 pt-3.5">
          <h3
            className="
              line-clamp-1
              text-[15px]
              font-medium
              leading-5
              tracking-[-0.025em]
              text-white/92
              transition-colors
              duration-300
              ease-out
              group-hover/card:text-white
              group-focus-visible/card:text-white
            "
          >
            {title}
          </h3>

          {artist && (
            <p
              className="
                mt-1
                line-clamp-1
                text-[13px]
                leading-5
                text-white/38
                transition-colors
                duration-300
                ease-out
                group-hover/card:text-white/55
                group-focus-visible/card:text-white/55
              "
            >
              {artist}
            </p>
          )}
        </div>
      </motion.article>
    </Link>
  );
}
