"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type LessonPreviewPlayerProps = {
  previewUrl: string;
  language: "pt" | "en";
};

export default function LessonPreviewPlayer({
  previewUrl,
  language,
}: LessonPreviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFinished, setIsFinished] = useState(false);

  function handleEnded() {
    setIsFinished(true);
  }

  function replayPreview() {
    const video = videoRef.current;

    if (!video) return;

    setIsFinished(false);
    video.currentTime = 0;
    video.play();
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
      <video
        ref={videoRef}
        src={previewUrl}
        controls={!isFinished}
        onEnded={handleEnded}
        className="h-full w-full object-cover"
      />

      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{
                opacity: 0,
                y: 12,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.65,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10 max-w-md text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                  ease: "easeOut",
                }}
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-lg text-white/60"
              >
                🔒
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.45,
                  ease: "easeOut",
                }}
                className="mt-5 text-2xl font-semibold text-white"
              >
                {language === "pt"
                  ? "Continue com a aula completa"
                  : "Continue with the full lesson"}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.55,
                  ease: "easeOut",
                }}
                className="mt-2 text-sm leading-6 text-white/50"
              >
                {language === "pt"
                  ? "Você assistiu à prévia gratuita. Desbloqueie a aula completa para continuar aprendendo."
                  : "You've watched the free preview. Unlock the full lesson to keep learning."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.65,
                  ease: "easeOut",
                }}
                className="mt-6 flex flex-col justify-center gap-2 sm:flex-row"
              >
                <button
                  type="button"
                  onClick={replayPreview}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                >
                  {language === "pt" ? "Assistir novamente" : "Watch again"}
                </button>

                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/85"
                >
                  {language === "pt" ? "Desbloquear aula" : "Unlock lesson"}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
