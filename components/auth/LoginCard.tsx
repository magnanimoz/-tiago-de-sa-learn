"use client";

import LoginForm from "./LoginForm";
import LoginHeader from "./LoginHeader";
import SocialLoginButton from "./SocialLoginButton";
import { useSettings } from "@/contexts/SettingsContext";
import { modalText } from "@/lib/i18n/modal";
import { t } from "@/lib/t";

export default function LoginCard() {
  const { language } = useSettings();

  return (
    <div
      className="
        w-full
        rounded-3xl
        border border-white/10
        border-1
      bg-[#101012]
        p-7
        shadow-md
        md:p-8
      "
    >
      <LoginHeader />
      <LoginForm />

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#a1a1a1]" />

        <span className="text-xs uppercase tracking-[0.3em] text-[#a1a1a1]">
          {t(modalText.or, language)}
        </span>

        <div className="h-px flex-1 bg-[#a1a1a1]" />
      </div>

      <SocialLoginButton />

      <p className="mt-8 text-center text-base text-[#a1a1a1]">
        {t(modalText.newUser, language)}{" "}
        <button
          type="button"
          className="font-bold text-[#e6007e] transition hover:text-[#ca006f]"
        >
          {t(modalText.createAnAccount, language)}
        </button>
      </p>
    </div>
  );
}
