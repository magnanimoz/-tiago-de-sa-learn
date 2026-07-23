"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { useAuthModal } from "@/contexts/AuthModalContext";
import LoginCard from "./LoginCard";

const modalTransition = {
  duration: 0.25,
  ease: "easeOut" as const,
};

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuthModal();

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.button
            type="button"
            aria-label="Fechar modal"
            onClick={closeLoginModal}
            className="absolute inset-0 cursor-default bg-black/20 backdrop-blur-[8px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={modalTransition}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Login"
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            transition={modalTransition}
            className="relative z-10 w-full max-w-[460px]"
          >
            <button
              type="button"
              onClick={closeLoginModal}
              aria-label="Fechar"
              className="
                absolute
                right-5
                top-5
                z-20
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[#737373]
                transition-colors
                hover:bg-black/[0.05]
                hover:text-black
              "
            >
              <X size={18} />
            </button>

            <LoginCard />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
