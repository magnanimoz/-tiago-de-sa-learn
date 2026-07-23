"use client";

import { ChevronRight, KeyRound, Mail } from "lucide-react";

type SecurityMenuProps = {
  onPasswordClick: () => void;
  onEmailClick: () => void;
};

export default function SecurityMenu({
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
          <p className="font-medium text-white">Alterar senha</p>

          <p className="mt-1 text-sm text-white/50">
            Altere sua senha para manter sua conta protegida.
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
          <p className="font-medium text-white">Alterar e-mail</p>

          <p className="mt-1 text-sm text-white/50">
            Escolha um novo endereço de e-mail para sua conta.
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
