"use client";

import { useState } from "react";

import { useSettings } from "@/contexts/SettingsContext";
import { modalText } from "@/lib/i18n/modal";
import { t } from "@/lib/t";

import LoginForm from "./LoginForm";
import LoginHeader from "./LoginHeader";
import SocialLoginButton from "./SocialLoginButton";

export default function LoginCard() {
  const { language } = useSettings();
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div
      className={`
        w-full
        rounded-3xl
        border border-white/10
        bg-[#101012]
        shadow-md
md:p-8
      `}
    >
      <LoginHeader isSignUp={isSignUp} />

      <LoginForm isSignUp={isSignUp} />

      {!isSignUp && (
        <>
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#a1a1a1]" />

            <span className="text-xs uppercase tracking-[0.3em] text-[#a1a1a1]">
              {t(modalText.or, language)}
            </span>

            <div className="h-px flex-1 bg-[#a1a1a1]" />
          </div>

          <SocialLoginButton />
        </>
      )}

      <p
        className={`
          text-center text-base text-[#a1a1a1]
          ${isSignUp ? "mt-5" : "mt-8"}
        `}
      >
        {isSignUp
          ? t(modalText.alreadyHaveAccount, language)
          : t(modalText.newUser, language)}{" "}
        <button
          type="button"
          onClick={() => setIsSignUp((currentValue) => !currentValue)}
          className="font-bold text-[#e6007e] transition hover:text-[#ca006f]"
        >
          {isSignUp
            ? t(modalText.singIn, language)
            : t(modalText.createAnAccount, language)}
        </button>
      </p>
    </div>
  );
}
