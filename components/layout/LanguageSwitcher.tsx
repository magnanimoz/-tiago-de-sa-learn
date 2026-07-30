"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { useSettings } from "@/contexts/SettingsContext";
import { isRouteLocale, languageToRouteLocale, type Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  onBeforeChange?: () => void;
  size?: "sm" | "md";
};

function buildLocalizedPath(pathname: string, language: Locale) {
  const nextRouteLocale = languageToRouteLocale(language);
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && isRouteLocale(segments[0])) {
    segments[0] = nextRouteLocale;
  } else {
    segments.unshift(nextRouteLocale);
  }

  return `/${segments.join("/")}`;
}

export default function LanguageSwitcher({
  onBeforeChange,
  size = "sm",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { language } = useSettings();

  const [displayedLanguage, setDisplayedLanguage] = useState<Locale>(language);
  const [pendingLanguage, setPendingLanguage] = useState<Locale | null>(null);

  const shouldNavigateRef = useRef(false);

  function handleLanguageChange(nextLanguage: Locale) {
    if (nextLanguage === language || pendingLanguage !== null) {
      return;
    }

    shouldNavigateRef.current = true;
    setPendingLanguage(nextLanguage);
    setDisplayedLanguage(nextLanguage);
    onBeforeChange?.();
  }

  function handleTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (
      event.propertyName !== "left" ||
      !shouldNavigateRef.current ||
      !pendingLanguage
    ) {
      return;
    }

    shouldNavigateRef.current = false;

    const nextPath = buildLocalizedPath(pathname, pendingLanguage);

    window.location.assign(nextPath);
  }

  const isMedium = size === "md";

  const indicatorWidth = isMedium ? "w-12" : "w-11";
  const englishIndicatorPosition = isMedium ? "left-[52px]" : "left-[48px]";

  const buttonClasses = isMedium
    ? "min-w-12 px-3.5 py-2 text-sm"
    : "min-w-11 px-3 py-1.5 text-xs";
  return (
    <div
      className={[
        "relative flex items-center rounded-full border border-white/10",
        "bg-white/[0.025] p-1",
        pendingLanguage ? "pointer-events-none" : "",
      ].join(" ")}
      aria-label={language === "pt" ? "Selecionar idioma" : "Select language"}
      aria-busy={pendingLanguage !== null}
    >
      <div
        aria-hidden="true"
        onTransitionEnd={handleTransitionEnd}
        className={[
          "absolute bottom-1 top-1 rounded-full bg-white",
          "transition-[left] duration-300",
          "ease-[cubic-bezier(0.22,1,0.36,1)]",
          indicatorWidth,
          displayedLanguage === "pt" ? "left-1" : englishIndicatorPosition,
        ].join(" ")}
      />

      <button
        type="button"
        onClick={() => handleLanguageChange("pt")}
        disabled={pendingLanguage !== null}
        aria-pressed={displayedLanguage === "pt"}
        className={[
          "relative z-10 flex items-center justify-center rounded-full font-semibold",
          buttonClasses,
          "transition-colors duration-200",
          displayedLanguage === "pt"
            ? "text-black"
            : "text-white/40 hover:text-white/75",
        ].join(" ")}
      >
        PT
      </button>

      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        disabled={pendingLanguage !== null}
        aria-pressed={displayedLanguage === "en"}
        className={[
          "relative z-10 flex min-w-11 items-center justify-center",
          "rounded-full px-3 py-1.5 text-xs font-semibold",
          "transition-colors duration-200",
          displayedLanguage === "en"
            ? "text-black"
            : "text-white/40 hover:text-white/75",
        ].join(" ")}
      >
        EN
      </button>
    </div>
  );
}
