"use client";

import { ChevronRight, KeyRound, Mail } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { accountText } from "@/lib/i18n/account";
import { t } from "@/lib/t";

type SecurityMenuProps = {
  language: Locale;
  onPasswordClick: () => void;
  onEmailClick: () => void;
};

export default function SecurityMenu({
  language,
  onPasswordClick,
  onEmailClick,
}: SecurityMenuProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <button
        type="button"
        onClick={onPasswordClick}
        className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
      >
        <KeyRound size={20} className="text-white/60" />

        <div className="flex-1">
          <p className="font-medium text-white">
            {t(accountText.security.changePassword, language)}
          </p>

          <p className="mt-1 text-sm text-white/50">
            {t(accountText.security.passwordDescription, language)}
          </p>
        </div>

        <ChevronRight
          size={20}
          className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/60"
        />
      </button>

      <div className="h-px bg-white/10" />

      <button
        type="button"
        onClick={onEmailClick}
        className="group flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
      >
        <Mail size={20} className="text-white/60" />

        <div className="flex-1">
          <p className="font-medium text-white">
            {t(accountText.security.changeEmail, language)}
          </p>

          <p className="mt-1 text-sm text-white/50">
            {t(accountText.security.emailDescription, language)}
          </p>
        </div>

        <ChevronRight
          size={20}
          className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/60"
        />
      </button>
    </div>
  );
}
