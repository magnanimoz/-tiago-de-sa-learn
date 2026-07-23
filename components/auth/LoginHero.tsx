"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function LoginHero() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // A imagem desce suavemente enquanto a página sobe.
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 55]);

  // Pequeno zoom evita aparecerem espaços vazios nas bordas.
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.14]);

  return (
    <section
      ref={heroRef}
      className="relative h-[280px] w-full overflow-hidden"
    >
      <motion.div
        className="absolute -inset-6"
        style={{
          y: imageY,
          scale: imageScale,
        }}
      >
        <Image
          src="/images/login/login-hero.jpg"
          alt="Tiago tocando guitarra"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Escurecimento para melhorar a leitura do título e da navbar */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex h-full items-center justify-center pt-15">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            delay: 0.25,
          }}
          className="-translate-y-2 text-5xl font-semibold tracking-tight text-white md:text-5xl"
        >
          Login
        </motion.h1>
      </div>
    </section>
  );
}
