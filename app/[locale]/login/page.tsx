"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import LoginCard from "@/components/auth/LoginCard";
import { useSettings } from "@/contexts/SettingsContext";
import { loginText } from "@/lib/i18n/login";
import { t } from "@/lib/t";

export default function LoginPage() {
  const [scrollY, setScrollY] = useState(0);
  const { language } = useSettings();

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#08080a]
        text-white
      "
    >
      <motion.div
        className="absolute inset-0"
        initial={{
          opacity: 0,
          scale: 1.08,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Image
          src="/images/login/hero-teste9.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-[center_38%]
            opacity-75
            saturate-[0.8]
            will-change-transform
            lg:object-[center_50%]
          "
          style={{
            transform: `translate3d(0, ${scrollY * 0.4}px, 0) scale(1.04)`,
          }}
        />
      </motion.div>

      <motion.div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#08080a]
          via-[#08080a]/35
          to-[#08080a]/95
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1.4,
          delay: 0.15,
        }}
      />

      <motion.div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-[#08080a]
          via-transparent
          to-[#08080a]/50
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1.4,
          delay: 0.25,
        }}
      />

      <section
        className="
          relative
          z-10
          mx-auto
          grid
          min-h-screen
          w-full
          max-w-[1600px]
          items-end
          gap-16
          px-6
          pb-12
          pt-32
          lg:grid-cols-[minmax(0,1fr)_420px]
          lg:items-center
          lg:px-12
          lg:pb-16
          xl:px-20
        "
      >
        <div className="max-w-4xl">
          <motion.div
            className="
              mb-7
              flex
              items-center
              gap-3
              text-xs
              font-medium
              uppercase
              tracking-[0.3em]
              text-white/55
            "
            initial={{
              opacity: 0,
              x: -24,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.span
              className="h-px bg-[#e6007e]"
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{
                duration: 0.8,
                delay: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            {t(loginText.welcome, language)}
          </motion.div>

          <h1
            className="
              max-w-4xl
              text-[clamp(4rem,9vw,9rem)]
              font-semibold
              uppercase
              leading-[0.78]
              tracking-[-0.075em]
              text-white
            "
          >
            <motion.span
              className="block"
              initial={{
                opacity: 0,
                y: 54,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1,
                delay: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {t(loginText.headlineFirst, language)}
            </motion.span>

            <motion.span
              className="block text-white/35"
              initial={{
                opacity: 0,
                y: 54,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1,
                delay: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {t(loginText.headlineSecond, language)}
            </motion.span>
          </h1>

          <motion.p
            className="
              mt-8
              max-w-md
              text-base
              leading-7
              text-white/65
              sm:text-lg
            "
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {t(loginText.description, language)}
          </motion.p>
        </div>

        <motion.div
          className="
            w-full
            border-t
            border-white/15
            bg-black/20
            pb-4
            pt-8
            backdrop-blur-sm
            lg:border-l
            lg:border-t-0
            lg:bg-transparent
            lg:pb-0
            lg:pl-12
            lg:pt-0
            lg:backdrop-blur-none
          "
          initial={{
            opacity: 0,
            x: 42,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <LoginCard />
        </motion.div>
      </section>

      <motion.p
        className="
          absolute
          bottom-6
          left-1/2
          z-10
          hidden
          -translate-x-1/2
          text-[10px]
          uppercase
          tracking-[0.3em]
          text-white/25
          xl:block
        "
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 1.15,
        }}
      >
        {t(loginText.footer, language)}
      </motion.p>
    </main>
  );
}
