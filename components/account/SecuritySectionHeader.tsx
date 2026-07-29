"use client";

import { ArrowLeft } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { accountText } from "@/lib/i18n/account";
import { t } from "@/lib/t";

type SecuritySectionHeaderProps = {
  language: Locale;
  onBack: () => void;
};

export default function SecuritySectionHeader({
  language,
  onBack,
}: SecuritySectionHeaderProps) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="mb-6 flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
    >
      <ArrowLeft size={18} />

      {t(accountText.security.goBack, language)}
    </button>
  );
}
