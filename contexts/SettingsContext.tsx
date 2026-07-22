"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language = "pt" | "en";
export type Currency = "BRL" | "USD";

interface SettingsContextData {
  language: Language;
  currency: Currency;
  setLanguage: (language: Language) => void;
}

const SettingsContext = createContext<SettingsContextData | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("language");

    if (saved === "pt" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  function handleSetLanguage(language: Language) {
    localStorage.setItem("language", language);
    setLanguage(language);
  }

  return (
    <SettingsContext.Provider
      value={{
        language,
        currency: language === "pt" ? "BRL" : "USD",
        setLanguage: handleSetLanguage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
