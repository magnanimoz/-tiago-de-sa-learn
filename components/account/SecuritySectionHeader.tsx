"use client";

import { ArrowLeft } from "lucide-react";

type SecuritySectionHeaderProps = {
  title: string;
  onBack: () => void;
};

export default function SecuritySectionHeader({
  title,
  onBack,
}: SecuritySectionHeaderProps) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      <h3 className="mb-6 text-xl font-semibold text-white">{title}</h3>
    </>
  );
}
