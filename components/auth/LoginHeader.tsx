"use client";

import { useSettings } from "@/contexts/SettingsContext";

interface LoginHeaderProps {
  isSignUp: boolean;
}

export default function LoginHeader({ isSignUp }: LoginHeaderProps) {
  const { language } = useSettings();

  return (
    <header className="text-center">
      <h1 className="mb-4 text-[1.9rem] font-medium tracking-[-0.03em] text-white">
        {isSignUp
          ? language === "pt"
            ? "Cadastrar"
            : "Sign Up"
          : language === "pt"
            ? "Entrar"
            : "Login"}
      </h1>
    </header>
  );
}
