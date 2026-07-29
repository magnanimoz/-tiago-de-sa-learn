"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import UpdateEmailForm from "@/components/account/UpdateEmailForm";
import UpdatePasswordForm from "@/components/account/UpdatePasswordForm";
import SecurityMenu from "@/components/account/SecurityMenu";
import SecuritySectionHeader from "@/components/account/SecuritySectionHeader";

import type { Locale } from "@/lib/i18n";
import { accountText } from "@/lib/i18n/account";
import { t } from "@/lib/t";

type SecurityViewProps = {
  language: Locale;
};

export function SecurityView({ language }: SecurityViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [direction, setDirection] = useState<1 | -1>(1);

  const section = searchParams.get("section") ?? "menu";

  function navigateToSection(
    section?: "password" | "email",
    navigationDirection: 1 | -1 = 1,
  ) {
    setDirection(navigationDirection);

    const url = section
      ? `/account/security?section=${section}`
      : "/account/security";

    router.replace(url);
  }

  return (
    <>
      <div className="mb-5">
        {section === "menu" ? (
          <h2 className="text-2xl font-semibold text-white">
            {t(accountText.security.pageTitle, language)}
          </h2>
        ) : (
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <span className="text-white/50">
              {t(accountText.security.pageTitle, language)}
            </span>

            <span className="text-white/30">›</span>

            <span className="text-white">
              {section === "password"
                ? t(accountText.security.changePassword, language)
                : t(accountText.security.changeEmail, language)}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={section}
          initial={{
            opacity: 0,
            x: direction > 0 ? 8 : -8,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: direction > 0 ? -8 : 8,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
        >
          {section === "menu" && (
            <SecurityMenu
              language={language}
              onPasswordClick={() => navigateToSection("password", 1)}
              onEmailClick={() => navigateToSection("email", 1)}
            />
          )}

          {(section === "password" || section === "email") && (
            <div className="space-y-6">
              <SecuritySectionHeader
                language={language}
                onBack={() => navigateToSection(undefined, -1)}
              />

              {section === "password" && (
                <UpdatePasswordForm language={language} />
              )}

              {section === "email" && <UpdateEmailForm language={language} />}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
