"use client";

import { type ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import AccountSidebar from "@/components/account/AccountSidebar";
import Header from "@/components/layout/Header";

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/account")) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  const firstName = user?.user_metadata?.name?.trim().split(" ")[0] ?? "Aluno";

  return (
    <>
      <Header />

      <div className="relative min-h-screen overflow-hidden bg-[#070709]">
        <div className="pointer-events-none fixed inset-0 isolate overflow-hidden">
          <div
            className="
              absolute
              -left-56
              top-0
              h-[36rem]
              w-[36rem]
              opacity-0
              scale-90
              animate-[blobFadeIn_1.2s_ease-out_forwards]
            "
            style={{
              background:
                "radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0.08) 38%, transparent 72%)",
            }}
          />

          <div
            className="
              absolute
              -right-56
              top-[24rem]
              h-[36rem]
              w-[36rem]
              opacity-0
              scale-90
              animate-[blobFadeIn_1.2s_ease-out_250ms_forwards]
            "
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.08) 38%, transparent 72%)",
            }}
          />
        </div>

        <motion.main
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: isLoading ? 0 : 1,
            y: isLoading ? 16 : 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-semibold text-white">
              Olá, {firstName}!
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <motion.div
              initial={{ x: -24 }}
              animate={{ x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: "easeOut",
              }}
            >
              <AccountSidebar />
            </motion.div>

            <motion.section
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="self-start rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <motion.div
                key={pathname}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
              >
                {children}
              </motion.div>
            </motion.section>
          </div>
        </motion.main>
      </div>
    </>
  );
}
