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
    <div className="w-full text-white">
      <LoginHeader isSignUp={isSignUp} />

      <LoginForm key={isSignUp ? "signup" : "login"} isSignUp={isSignUp} />

      {!isSignUp && (
        <>
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/15" />

            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
              {t(modalText.or, language)}
            </span>

            <div className="h-px flex-1 bg-white/15" />
          </div>

          <SocialLoginButton />
        </>
      )}

      <p
        className={`
          text-center
          text-base
          text-white/55
          ${isSignUp ? "mt-5" : "mt-8"}
        `}
      >
        {isSignUp
          ? t(modalText.alreadyHaveAccount, language)
          : t(modalText.newUser, language)}{" "}
        <button
          type="button"
          onClick={() => setIsSignUp((currentValue) => !currentValue)}
          className="
            font-semibold
            text-[#e6007e]
            transition-colors
            hover:text-[#ff168f]
            focus-visible:outline-none
            focus-visible:underline
            focus-visible:underline-offset-4
          "
        >
          {isSignUp
            ? t(modalText.singIn, language)
            : t(modalText.createAnAccount, language)}
        </button>
      </p>
    </div>
  );
}
